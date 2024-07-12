"use client"
import AuthContextProvider from "../context/authContext"
import StyledComponentsRegistry from "../lib/registry"
import { Suspense } from "react"
import Loading from "./loading"

const ClientProvider = ({children}) => {  
  return (
  <AuthContextProvider>
    <StyledComponentsRegistry>
      <Suspense fallback={<Loading/>}>
        {children}
      </Suspense>
    </StyledComponentsRegistry>
  </AuthContextProvider>
)
}

export default ClientProvider