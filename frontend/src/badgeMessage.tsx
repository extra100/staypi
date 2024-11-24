import React, { createContext, useContext, useState, useEffect } from 'react'

const RedDataContext = createContext<{
  hasRedData: boolean
  setHasRedData: React.Dispatch<React.SetStateAction<boolean>>
}>({
  hasRedData: true,
  setHasRedData: () => {},
})

export const RedDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [hasRedData, setHasRedData] = useState(false)

  return (
    <RedDataContext.Provider value={{ hasRedData, setHasRedData }}>
      {children}
    </RedDataContext.Provider>
  )
}

export const useRedData = () => {
  return useContext(RedDataContext)
}
