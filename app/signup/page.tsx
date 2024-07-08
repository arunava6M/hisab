'use client'
import React, { FormEvent } from "react";
import signUp from "../../firebase/auth/signup";
import { useRouter } from 'next/navigation'
import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F9F9FA;
  justify-content: center;
  align-items: center;
`

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: max-content;
;
`

export const Input = styled.input`
  width: 200px;
  height: 40px;
  border-radius: 5px;
  border: solid 1px black;
  background-color:inherit;
  margin-bottom: 10px;
  padding: 5px;
  color: black;
;
`

export const SignUp = styled.button`
  right: 0;
  padding: 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  background-color: cadetblue;
`

export const Redirect = styled(SignUp)`
  position: absolute;
  bottom: 0;
  margin: 0 20px 20px 0;
`
function Page() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const router = useRouter()

  const handleForm = async (event: FormEvent) => {
    event.preventDefault()

    const { result, error } = await signUp(email, password);

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
          <SignUp type="submit">Sign up</SignUp>
        </Form>
      <Redirect onClick={() => router.push("/signin")}> 👉  I have an account</Redirect>
    </PageWrapper>
);
}

export default Page;
