import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loginActions } from './action';
import { cookies } from 'next/headers';

const Page = () => {
  const authValue: { name: string; value: string } | undefined =
    cookies().get('authToken');
  console.log(
    'The sign in page is rendered and this is the cookie values: ',
    authValue
  );
  if (authValue?.value) {
    redirect('/dashboard');
  }
  const handleLogin = async (formData: any) => {
    'use server';
    const result = await loginActions(formData);
    if (result.success) {
      redirect('/dashboard');
    }
  };
  return (
    <div className="page-wrapper">
      <form action={handleLogin} className="form">
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="example@mail.com"
          required
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <button className="auth-button" type="submit">
          Sign in
        </button>
      </form>
      <Link className="auth-button redirect" href="/signup">
        👉 I don&apos;t have an account
      </Link>
    </div>
  );
};

export default Page;
