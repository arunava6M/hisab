'use client';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper, Form, Input, SignUp, Redirect } from '../signup/page';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@atoms/loading';
import { login } from '@utils/api';
import Cookies from 'js-cookie';
import { genericCatch } from '@utils/helper';

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();
  const handleForm = async (event: FormEvent) => {
    event.preventDefault();
    setShowLoader(true);

    try {
      const response = await login({ email, password });
      const { jwtToken } = response.data;
      localStorage.setItem('authToken', jwtToken);
      Cookies.set('authToken', jwtToken, { expires: 1 });
      router.push('/dashboard');
    } catch (error) {
      genericCatch(error, router);
    }

    setShowLoader(false);
  };

  return (
    <PageWrapper>
      {showLoader && <Loading />}
      <Form onSubmit={handleForm} className="form">
        <Input
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          name="email"
          id="email"
          placeholder="example@mail.com"
        />
        <Input
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <SignUp type="submit">Sign in</SignUp>
      </Form>
      <Redirect onClick={() => router.push('/signup')}>
        👉 I don&apos;t have an account
      </Redirect>
    </PageWrapper>
  );
}

export default Page;
