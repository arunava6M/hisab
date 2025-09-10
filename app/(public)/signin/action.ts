'use server';

import { login } from '@utils/api';
import { cookies } from 'next/headers';

export const loginActions = async (formData: any) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const response = await login({ email, password });
    const { jwtToken } = response.data;

    cookies().set('authToken', jwtToken, {
      maxAge: 86400,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Invalid credentials' };
  }
};
