// src/services/customerService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/customers';

const createCustomer = (customer) => {
  return axios.post(API_URL, customer);
};

const getAllCustomers = () => {
  return axios.get(API_URL);
};

const getCustomerByID = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const getCustomerByName = (name) => {
  return axios.get(`${API_URL}/search?name=${name}`);
};

const updateCustomerByID = (id, customer) => {
  return axios.put(`${API_URL}/${id}`, customer);
};

const deleteCustomerByID = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

export {
  createCustomer,
  getAllCustomers,
  getCustomerByID,
  getCustomerByName,
  updateCustomerByID,
  deleteCustomerByID,
};
