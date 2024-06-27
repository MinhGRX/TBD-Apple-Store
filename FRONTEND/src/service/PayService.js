import axios from '../custommize-axios';

const pay = (id) => {
  return axios.get(`/api/pay/${id}`);
};

const payOnline = (tien, urlReturn) => {
  return axios.get(`/api/pay?tien=${tien}&urlReturn=${urlReturn}`);
};

export { pay, payOnline };