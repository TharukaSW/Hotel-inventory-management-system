// Authentication SDK for Micro Frontends
import React from 'react';

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

type AuthEventType = 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'AUTH_REFRESH';

interface AuthEvent {
  type: AuthEventType;
  user?: AuthUser;
}

type AuthCallback = (authState: AuthState) => void;

class AuthSDK {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
  };
  
  private callbacks: Set<AuthCallback> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    // Listen for auth events from the shell
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      const authEvent = event.data as AuthEvent;
      if (authEvent.type === 'AUTH_LOGIN' || authEvent.type === 'AUTH_REFRESH') {
        this.updateAuthState({
          user: authEvent.user || null,
          isAuthenticated: !!authEvent.user,
        });
      } else if (authEvent.type === 'AUTH_LOGOUT') {
        this.updateAuthState({
          user: null,
          isAuthenticated: false,
        });
      }
    });

    // Request current auth state from shell on initialization
    this.requestAuthState();
  }

  private requestAuthState() {
    // Ask the shell for current auth state
    window.parent.postMessage({ type: 'REQUEST_AUTH_STATE' }, '*');
  }

  private updateAuthState(newState: AuthState) {
    this.authState = newState;
    this.notifyCallbacks();
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => callback(this.authState));
  }

  // Public API
  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  public getUser(): AuthUser | null {
    return this.authState.user;
  }

  public isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  public hasRole(role: string): boolean {
    return this.authState.user?.role === role;
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.authState.user?.role || '');
  }

  public getAuthToken(): string | null {
    // Get token from shell via postMessage
    return sessionStorage.getItem('accessToken');
  }

  public subscribe(callback: AuthCallback): () => void {
    this.callbacks.add(callback);
    
    // Immediately call with current state
    callback(this.authState);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  public logout(): void {
    // Send logout request to shell
    window.parent.postMessage({ type: 'LOGOUT_REQUEST' }, '*');
  }

  // API request helper with automatic auth headers
  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      credentials: 'include', // Include HTTP-only cookies
      headers,
    });
  }
}

// Singleton instance
export const authSDK = new AuthSDK();

// React hook for micro frontends
export function useAuthSDK() {
  const [authState, setAuthState] = React.useState<AuthState>(authSDK.getAuthState());

  React.useEffect(() => {
    const unsubscribe = authSDK.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    hasRole: authSDK.hasRole.bind(authSDK),
    hasAnyRole: authSDK.hasAnyRole.bind(authSDK),
    logout: authSDK.logout.bind(authSDK),
    makeAuthenticatedRequest: authSDK.makeAuthenticatedRequest.bind(authSDK),
  };
}

export default authSDK;
