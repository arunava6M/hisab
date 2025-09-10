import Link from 'next/link';
import { signUpActions } from './actions';
import { redirect } from 'next/navigation';

function Page() {
  const handleRegistration = async (formData: any) => {
    'use server';
    const resp = await signUpActions(formData);
    if (resp.success) {
      redirect('/signin');
    }
  };

  return (
    <div className="page-wrapper">
      <form action={handleRegistration} className="form">
        <input
          className="form-input"
          type="text"
          name="firstName"
          placeholder="First name"
          required
        />
        <input
          className="form-input"
          type="text"
          name="lastName"
          placeholder="Last name"
          required
        />
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
          Sign up
        </button>
      </form>
      <Link className="auth-button redirect" href="/signin">
        👉 I have an account
      </Link>
    </div>
  );
}

export default Page;
