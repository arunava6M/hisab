'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { LoginWrapper } from 'app/component/organisms/LoginWrapper/LoginWrapper';

const SignInPage = () => {
  const authValue: { name: string; value: string } | undefined =
    cookies().get('authToken');
  console.log(
    'The sign in page is rendered and this is the cookie values: ',
    authValue
  );
  if (authValue?.value) {
    redirect('/dashboard');
  }

  return <LoginWrapper />;
};

export default SignInPage;
