import axios from '../custommize-axios';

const getAllPageHL = (page) => {
  return axios.get(`/api/hang-loi/getAll?page=${page}`);
};
const search = (key, tuNgay, denNgay, page) => {
  return axios.get(`/api/hang-loi/search?key=${key}&tuNgay=${tuNgay}&denNgay=${denNgay}&page=${page}`);
};

export { getAllPageHL, search };