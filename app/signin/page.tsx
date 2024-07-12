'use client'
import React, { FormEvent, useState } from "react";
import signIn from "../../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import {PageWrapper, Form, Input, SignUp, Redirect} from '../signup/page'
import {ToastContainer, Bounce} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loading";
import {toaster} from '../../helper/helperFunc'

function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const router = useRouter()

  const handleForm = async (event: FormEvent) => {
    event.preventDefault()
    setShowLoader(true)

    const { result, error } = await signIn(email, password);

    if (error) {
      if(error.code === 'auth/invalid-credential'){
        toaster('Your email or password is wrong')
      } else {
        toaster('Something went wrong ! Try again ')
      }
    } else {
      return router.push("/")
    }

    setShowLoader(false)
  }

  return (
    <PageWrapper>
      <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
      />
      {showLoader && <Loading />}
      <Form onSubmit={handleForm} className="form">
        <Input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
        <Input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
        <SignUp type="submit">Sign in</SignUp>
      </Form>
      <Redirect onClick={() => router.push("/signup")}>👉 I don&apos;t have an account</Redirect>
    </PageWrapper>
  );
}

export default Page;
