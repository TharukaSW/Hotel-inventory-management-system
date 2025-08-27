import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import IframeView from './components/IframeView'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

function AppContent() {
  const { user, logout, getAuthToken, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Listen for auth state requests from micro frontends
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow same hostname (different ports) so micro-frontends can request auth state
      try {
        const eventHost = new URL(event.origin).hostname
        const thisHost = window.location.hostname
        if (eventHost !== thisHost) return // different domain entirely
      } catch {
        // If parsing fails, ignore message
        return
      }

      if (event.data?.type === 'REQUEST_AUTH_STATE') {
        // Use casting to satisfy strict TS libs where overload expects WindowPostMessageOptions second argument now
        (event.source as Window | null)?.postMessage({ type: 'AUTH_LOGIN', user }, '*')
      } else if (event.data?.type === 'LOGOUT_REQUEST') {
        logout()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [user, logout])

  // Share auth token with micro frontends
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      sessionStorage.setItem('accessToken', token)
    }
  }, [getAuthToken])

  const handleLogout = async () => {
    await logout()
  }

  // After login, if user is at root path, send them to their role dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role && location.pathname === '/') {
      let target = '/'
      switch (user.role) {
        case 'ADMIN':
        case 'STOCK_MANAGER':
          target = '/admin'; break
        case 'FRONT_DESK':
          target = '/frontdesk'; break
        case 'INSPECTOR':
          target = '/inspector'; break
        default:
          target = '/'
      }
      if (target !== location.pathname) {
        navigate(target, { replace: true })
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Hotel Inventory Management</h1>
              <div className="flex items-center gap-4">
                <nav className="flex gap-2">
                  <NavLink to="/" className={navLinkClass} end>
                    Dashboard
                  </NavLink>
                  {(user?.role === 'ADMIN' || user?.role === 'STOCK_MANAGER') && (
                    <NavLink to="/admin" className={navLinkClass}>
                      Admin
                    </NavLink>
                  )}
                  {(user?.role === 'ADMIN' || user?.role === 'FRONT_DESK') && (
                    <NavLink to="/frontdesk" className={navLinkClass}>
                      Front Desk
                    </NavLink>
                  )}
                  {(user?.role === 'ADMIN' || user?.role === 'INSPECTOR') && (
                    <NavLink to="/inspector" className={navLinkClass}>
                      Inspector
                    </NavLink>
                  )}
                  {user?.role === 'ADMIN' && (
                    <NavLink to="/users" className={navLinkClass}>
                      Users
                    </NavLink>
                  )}
                </nav>
                <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
                  <div className="text-sm text-gray-700">
                    Welcome, <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                    <div className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase().replace('_', ' ')}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <IframeView src="http://localhost:3001" title="Admin Service" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/frontdesk"
              element={
                <ProtectedRoute allowedRoles={['FRONT_DESK','ADMIN']}>
                  <IframeView src="http://localhost:3003" title="Front Desk Service" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspector"
              element={
                <ProtectedRoute allowedRoles={['INSPECTOR','ADMIN']}>
                  <IframeView src="http://localhost:3004" title="Inspector Service" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <IframeView src="http://localhost:3000" title="User Management" />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
