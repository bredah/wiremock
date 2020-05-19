import axios from 'axios';

export const UrlBase = `http://localhost:${process.env.WIREMOCK_PORT || 9999}`;

axios.defaults.baseURL = UrlBase;

export async function auth(data = {}, headers = {}) {
  return await axios({
    method: 'post',
    url: '/api/users/auth',
    data: data,
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export async function getProducts(headers = {}) {
  return await axios({
    method: 'get',
    url: '/api/products',
    header: {
      ...headers,
    },
  });
}

export async function getProduct(id, headers = {}) {
  return await axios({
    method: 'get',
    url: `/api/products/${id}`,
    header: {
      ...headers,
    },
  });
}

export async function addProduct(data, headers = {}) {
  return await axios({
    method: 'post',
    url: '/api/products',
    data: data,
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export async function updateProduct(id = 0, data = {}, headers = {}) {
  return await axios({
    method: 'put',
    url: `/api/products/${id}`,
    data: data,
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export async function deleteProduct(id, headers = {}) {
  return await axios({
    method: 'delete',
    url: `/api/products/${id}`,
    header: {
      ...headers,
    },
  });
}
