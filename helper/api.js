import axios from 'axios';
const basePath = 'https://hisab-backend-k9rj.onrender.com';
// const basePath = 'http://localhost:3001';

export const registerUser = (reqBody) =>
  axios.post(`${basePath}/auth/register`, { ...reqBody });

export const login = (reqBody) =>
  axios.post(`${basePath}/auth/login`, { ...reqBody });

export const getUserDetails = (authToken) =>
  axios.get(`${basePath}/user`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const getExpenses = (authToken, page = 1) =>
  axios.get(`${basePath}/expense?page=${page}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const getCategories = (authToken) =>
  axios.get(`${basePath}/category`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const addExpense = (authToken, reqBody) =>
  axios.post(`${basePath}/expense`, reqBody, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const addCategory = (authToken, reqBody) =>
  axios.post(`${basePath}/category`, reqBody, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const getAggregatedExpenses = (authToken) =>
  axios.get(`${basePath}/expense/aggregated`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const editCategory = (authToken, id, reqBody) =>
  axios.put(`${basePath}/category/${id}`, reqBody, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

export const shareCategory = (authToken, id, reqBody) =>
  axios.put(`${basePath}/category/${id}/share`, reqBody, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
