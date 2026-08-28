import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [roles, setRoles] = useState(() => {
    const stored = localStorage.getItem('roles')
    return stored ? JSON.parse(stored) : []
  })

  // Called after a successful /auth/login response
  const loginSuccess = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('roles', JSON.stringify(data.roles))
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    setRoles(data.roles)
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    setRoles([])
  }

  const isAdmin = roles.includes('ADMIN')
  const isCompanyAdmin = roles.includes('COMPANY_ADMIN')
  const isCustomer = roles.includes('CUSTOMER')
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        roles,
        loginSuccess,
        logout,
        isAdmin,
        isCompanyAdmin,
        isCustomer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// Shared by Login and ProtectedRoute so "which portal does this role belong to" lives in one place
export const homeRouteForRoles = (roles = []) => {
  if (roles.includes('ADMIN')) return '/admin/dashboard'
  if (roles.includes('COMPANY_ADMIN')) return '/company/dashboard'
  return '/customer/dashboard'
}
