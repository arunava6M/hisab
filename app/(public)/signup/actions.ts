import { registerUser } from '@utils/api';

export const signUpActions = async (formData: any) => {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const reponse = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
