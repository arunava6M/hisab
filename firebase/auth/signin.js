import firebase_app from '../config';
import {
  signInWithEmailAndPassword,
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

const auth = getAuth(firebase_app);

export default async function signIn(email, password) {
  let result = null,
    error = null;

  await setPersistence(auth, browserLocalPersistence);
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
    // console.log('user result: ', result.user, auth);
    // const tokenResult = await auth.verifyIdToken(result.user.accessToken);
    // if (tokenResult) {
    //   console.log('User is still authenticated');
    //   return userData;
    // } else {
    //   console.log('nope');
    // }
  } catch (e) {
    error = e;
  }

  return { result, error };
}
