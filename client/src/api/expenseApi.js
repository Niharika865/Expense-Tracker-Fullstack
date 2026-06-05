import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getExpenses = () => axios.get(API);

export const getSummary = () => axios.get(`${API}/summary`);

export const addExpense = (data) => axios.post(API, data);

export const updateExpense = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteExpense = (id) => {
  return axios.delete(`${API}/${id}`);
};