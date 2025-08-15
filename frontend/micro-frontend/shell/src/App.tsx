import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import IframeView from './components/IframeView'
import Home from './pages/Home'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  }`

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Hotel Inventory Shell</h1>
            <nav className="flex gap-2">
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
              <NavLink to="/frontdesk" className={navLinkClass}>
                Frontdesk
              </NavLink>
              <NavLink to="/inspector" className={navLinkClass}>
                Inspector
              </NavLink>
              <NavLink to="/users" className={navLinkClass}>
                Users
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={<IframeView src="http://localhost:3001" title="Admin Service" />}
          />
          <Route
            path="/frontdesk"
            element={<IframeView src="http://localhost:3003" title="Frontdesk Service" />}
          />
          <Route
            path="/inspector"
            element={<IframeView src="http://localhost:3004" title="Inspector Service" />}
          />
          <Route
            path="/users"
            element={<IframeView src="http://localhost:3000" title="User Service" />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
