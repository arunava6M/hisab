'use client';

import Link from 'next/link';
import { loginActions } from './action';
import { Alert } from '@atoms/Alert/Alert';
import { useFormState } from 'react-dom';

const initialState = {
  message: null,
};

export const LoginWrapper = () => {
  const [state, formAction] = useFormState(loginActions, initialState);

  return (
    <div className="page-wrapper">
      {state.message && (
        <Alert message={state.message} type="error" timestamp={state.time} />
      )}
      <form action={formAction} className="form">
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
