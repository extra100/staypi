import React, { useContext } from 'react'
import { UserInfoContextType } from '../types/UserInfoContext'

const UserContext = React.createContext<UserInfoContextType | undefined>(
  undefined
)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext
