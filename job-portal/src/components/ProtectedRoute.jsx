import { Navigate } from 'react-router-dom'
import { useAuth, homeRouteForRoles } from '../context/AuthContext'

// allowedRole = 'ADMIN' | 'COMPANY_ADMIN' | 'CUSTOMER'
export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, roles } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && !roles.includes(allowedRole)) {
    // Logged in but wrong portal — send them to the one they belong to
    return <Navigate to={homeRouteForRoles(roles)} replace />
  }

  return children
}
