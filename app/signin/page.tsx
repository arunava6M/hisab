'use client'
import React from "react";
import signIn from "../../firebase/auth/signin";
import { useRouter } from 'next/navigation'
import {PageWrapper, Form, Input, SignUp, Redirect} from '../signup/page'

function Page() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const router = useRouter()

  const handleForm = async (event) => {
    event.preventDefault()

    const { result, error } = await signIn(email, password);

    if (error) {
      return console.log(error)
    }

    // else successful
    console.log(result)
    return router.push("/")
  }
  return (
    <PageWrapper>
      <Form onSubmit={handleForm} className="form">
        <Input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
        <Input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
        <SignUp type="submit">Sign in</SignUp>
      </Form>
      <Redirect onClick={() => router.push("/signup")}>👉 I don't have an account</Redirect>
    </PageWrapper>
  );
}

export default Page;
