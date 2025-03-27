import React, { createContext, useContext, useState } from 'react'

// Define the context type
interface ToggleContextType {
  showTable: boolean
  toggleTableVisibility: () => void
}

// Create context with undefined as initial state
const ToggleContext = createContext<ToggleContextType | undefined>(undefined)

// Custom hook to use the ToggleContext
export const useToggleContext = () => {
  const context = useContext(ToggleContext)
  if (!context) {
    throw new Error('useToggleContext must be used within a ToggleProvider')
  }
  return context
}

// Provider component that will wrap the part of your app where you need access to context
export const ToggleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showTable, setShowTable] = useState(true)

  // Toggle visibility of the table
  const toggleTableVisibility = () => {
    setShowTable((prev) => !prev)
  }

  return (
    <ToggleContext.Provider value={{ showTable, toggleTableVisibility }}>
      {children}
    </ToggleContext.Provider>
  )
}
