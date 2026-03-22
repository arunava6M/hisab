'use server';

import { login } from '@utils/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const loginActions = async (prevState: any, formData: any) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await login({ email, password });
    const { jwtToken } = response.data;

    cookies().set('authToken', jwtToken, {
      maxAge: 86400,
    });
  } catch (error) {
    console.error('The error is:', error);
    // redirect(`/signin?error=${error.response.data.error}`);
    return {
      message: error.response.data.error || 'Something went wrong. Try again !',
      time: Date.now(),
    };
  }

  redirect('/dashboard');
};
