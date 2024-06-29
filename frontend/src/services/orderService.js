import axios from "axios";

export const createOrder = async (order) => {
  try {
    const { data } = axios.post("/api/orders/create", order);
    return data;
  } catch (error) {}
};

export const getNewOrderForCurrentUser = async () => {
  const { data } = await axios.get("/api/orders/newOrderForCurrentUser");
  return data;
};

export const trackOrderById = async (orderId) => {
  const { data } = await axios.get("/api/orders/track/" + orderId);
  return data;
};

export const getAll = async (state) => {
  const { data } = await axios.get(`/api/orders/${state ?? ""}`);
  return data;
};

export const getAllStatus = async () => {
  const { data } = await axios.get(`/api/orders/allstatus`);
  return data;
};
//create cancel order which changes status of existing order to cancelled
export const cancelOrder = async (orderId) => {
  try {
    const { data } = await axios.put(`/api/orders/cancel/${orderId}`);
    return data; // Assuming the server responds with the updated order data
  } catch (error) {
    throw error; // Rethrow the error to be caught by the caller
  }
};

export const acceptOrder = async (orderId) => {
  try {
    const { data } = await axios.put(`/api/orders/accept/${orderId}`);
    return data; // Assuming the server responds with the updated order data
  } catch (error) {
    throw error; // Rethrow the error to be caught by the caller
  }
};