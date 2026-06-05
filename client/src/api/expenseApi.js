import axios from "axios";

const API = "https://expense-tracker-api-ljzp.onrender.com";

export const getExpenses = () => axios.get(API);

export const getSummary = () => axios.get(`${API}/summary`);

export const addExpense = (data) => axios.post(API, data);

export const updateExpense = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteExpense = (id) => {
  return axios.delete(`${API}/${id}`);
};