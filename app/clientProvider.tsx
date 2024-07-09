"use client"
import AuthContextProvider from "../context/authContext"
import StyledComponentsRegistry from "../lib/registry"
const ClientProvider = ({children}) => (
  <AuthContextProvider>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </AuthContextProvider>
)

export default ClientProvider