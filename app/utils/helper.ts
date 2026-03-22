import { toast, Bounce } from 'react-toastify';
import { ErrorType } from './commonTypes';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Cookies from 'js-cookie';

export const getRandomColor = (light = false) => {
  if (light) {
    // Generate a light color by keeping RGB values in the range (150-255)
    const r = Math.floor(Math.random() * 106) + 150; // 150-255
    const g = Math.floor(Math.random() * 106) + 150; // 150-255
    const b = Math.floor(Math.random() * 106) + 150; // 150-255
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Standard random hex color
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
};

export const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

export const getInitial = (str: string) => str[0];

export const getColorFromValue = (value: number) => {
  let finalColor;
  switch (true) {
    case value > 50 && value < 65:
      finalColor = '#e38424';
      break;
    case value > 65:
      finalColor = '#e32444';
      break;
    default:
      finalColor = 'green';
  }
  return finalColor;
};

export const showDateLine = (current: string, previous: string) => {
  const currDate = new Date(current);
  const prevDate = new Date(previous);
  return currDate.toDateString() !== prevDate.toDateString();
};

export const toaster = (message: string) => toast.error(message);

export const genericCatch = (
  error: ErrorType | any,
  router?: AppRouterInstance
) => {
  // alert(error.response.data.error);
  toaster(error.response.data.error);
  if (error.response.data.error === 'Token is invalid/expired') {
    Cookies.remove('authToken');
    router?.push('/signin');
  }
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getAuthToken = () => Cookies.get('authToken');

export const getMonthOptions = (): Array<{ name: string; number: Array<> }> => {
  const now = new Date();
  const options = [];

  // Generate past 6 months + current month
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const monthNumber = date.getMonth() + 1;
    const year = date.getFullYear();

    options.push({
      name: monthName,
      date: [monthNumber, year],
    });
  }

  // options.push(
  //   { name: 'Last 3 months', number: [3, 'months'] },
  //   { name: 'Last 6 months', number: [6, 'months'] },
  //   { name: 'Last year', number: [12, 'months'] }
  // );

  return options;
};
