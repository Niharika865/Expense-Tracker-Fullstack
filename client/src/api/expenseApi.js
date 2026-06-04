import axios from "axios";

const API = "http://localhost:5000/api/expenses";

export const getExpenses = () => axios.get(API);

export const getSummary = () => axios.get(`${API}/summary`);

export const addExpense = (data) => axios.post(API, data);

export const updateExpense = (id, data) =>
  axios.put(`${API}/${id}`, data);

export const deleteExpense = (id) => {
  return axios.delete(`${API}/${id}`);
};