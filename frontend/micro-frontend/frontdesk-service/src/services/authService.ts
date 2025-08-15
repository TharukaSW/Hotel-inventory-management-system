// No-auth stub service to satisfy imports; all methods are no-ops or return open defaults.
class AuthService {
  private token: string | null = null;
  private user: any | null = null;

  async login(_credentials: any): Promise<any> {
    this.token = null;
    this.user = null;
    return { token: '', user: null };
  }

  async register(_userData: any): Promise<any> {
    return { token: '', user: null };
  }

  async logout(): Promise<void> {}
  async refreshToken(): Promise<string> { return ''; }
  async getCurrentUser(): Promise<any> { return null; }
  async updateProfile(_userData: any): Promise<any> { return null; }
  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {}
  async requestPasswordReset(_email: string): Promise<void> {}
  async resetPassword(_token: string, _newPassword: string): Promise<void> {}
  isAuthenticated(): boolean { return true; }
  getToken(): string | null { return null; }
  getUser(): any | null { return null; }
  hasRole(_role: string): boolean { return true; }
  hasAnyRole(_roles: string[]): boolean { return true; }
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  }
}

export const authService = new AuthService();
export default authService;
