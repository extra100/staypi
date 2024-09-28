// UserInfoContextType.tsx

import { UserInfo } from './UserInfo'
import React from 'react'

export type UserInfoContextType = {
  user: UserInfo | null
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>
}
