import Link from 'next/link';
import { redirect } from 'next/navigation';
import { loginActions } from './action';

const Page = () => {
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
