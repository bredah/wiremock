const api = require('../src/api');
import Wiremock from '../src/wiremock';
const uuid = require('uuid');

describe('Wiremock', () => {
  describe('Use mapping file', () => {
    it('AUTH TOKEN', async () => {
      let data = {
        username: 'bob',
        password: 'abc123',
      };
      let response = await api.auth(data);
      expect(response.status).toBe(200);
      expect(response.data.token_type).toBe('Bearer');
      expect(response.data.access_token).toMatch(/^[a-zA-Z0-9]{20}$/);
    });

    it('GET ALL', async () => {
      let response = await api.getProducts();
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.total).toBe(3);
      expect(response.data.content.length).toBe(3);
    });

    it('GET Single', async () => {
      let expectedResponseObject = {
        id: 1,
        description: 'Product 01',
        price: 2.55,
      };
      let response = await api.getProduct(1);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.total).toBe(1);
      expect(response.data.content).toEqual(expectedResponseObject);
    });

    it('POST', async () => {
      let data = {
        description: 'Add a new fake product',
        price: 7.5,
      };
      let response = await api.addProduct(data);
      expect(response.status).toBe(201);
      expect(response.data.success).toBeTruthy();
      expect(typeof response.data.content.id).toBe('number');
      expect(response.data.content.id).toBe(4);
      expect(typeof response.data.content.description).toBe('string');
      expect(response.data.content.description).toBe(data.description);
      expect(typeof response.data.content.price).toBe('number');
      expect(response.data.content.price).toBe(data.price);
    });

    it('PUT', async () => {
      let data = {
        description: 'Update the fake product 01',
        price: 2.3,
      };
      let response = await api.updateProduct(1, data);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.content.id).toBe(4);
      expect(response.data.content.description).toBe(data.description);
      expect(response.data.content.price).toBe(data.price);
    });

    it('DELETE', async () => {
      let response = await api.deleteProduct(1);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
    });
  });

  describe('Add mapping by request', () => {
    it('GET ALL', async () => {
      let mappingBody = {
        id: uuid.v1(),
        success: true,
        total: 3,
        content: [
          {
            id: 1,
            description: 'Fake product 01',
            price: 1.5,
          },
          {
            id: 2,
            description: 'Fake product 02',
            price: 2.0,
          },
          {
            id: 3,
            description: 'Fake product 03',
            price: 3.5,
          },
        ],
      };
      let mapping = {
        request: {
          method: 'GET',
          url: '/api/products/2',
        },
        response: {
          status: 200,
          body: JSON.stringify(mappingBody),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      };
      await Wiremock.mapping(JSON.stringify(mapping));
      let response = await api.getProducts();
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.total).toBe(3);
      expect(response.data.content.length).toBe(3);
    });
    it('GET', async () => {
      let mappingBody = {
        id: uuid.v1(),
        success: true,
        total: 1,
        content: {
          id: 2,
          description: 'Fake product 2',
          price: 4.5,
        },
      };
      let mapping = {
        request: {
          method: 'GET',
          url: '/api/products/2',
        },
        response: {
          status: 200,
          body: JSON.stringify(mappingBody),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      };
      await Wiremock.mapping(JSON.stringify(mapping));
      let response = await api.getProduct(2);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.total).toBe(1);
      expect(response.data.content).toEqual(mappingBody.content);
    });

    it('POST', async () => {
      let mapping = {
        id: uuid.v1(),
        request: {
          method: 'POST',
          url: '/api/products',
        },
        response: {
          status: 201,
          body:
            '{"success": true, "content": { "id": 6, "description": "{{jsonPath request.body \'$.description\'}}", "price": {{jsonPath request.body \'$.price\'}} } }',
          transformers: ['response-template'],
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      };
      await Wiremock.mapping(JSON.stringify(mapping));
      let data = {
        description: 'Add a new fake product',
        price: 7.5,
      };
      let response = await api.addProduct(data);
      expect(response.status).toBe(201);
      expect(response.data.success).toBeTruthy();
      expect(typeof response.data.content.id).toBe('number');
      expect(response.data.content.id).toBe(6);
      expect(typeof response.data.content.description).toBe('string');
      expect(response.data.content.description).toBe(data.description);
      expect(typeof response.data.content.price).toBe('number');
      expect(response.data.content.price).toBe(data.price);
    });

    it('PUT', async () => {
      let mapping = {
        id: uuid.v1(),
        request: {
          method: 'PUT',
          url: '/api/products/2',
        },
        response: {
          status: 200,
          body:
            '{ "success": true, "content": { "id": {{request.requestLine.pathSegments.[2]}}, "description": "{{jsonPath request.body \'$.description\'}}", "price": {{jsonPath request.body \'$.price\'}} }}',
          transformers: ['response-template'],
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      };
      await Wiremock.mapping(JSON.stringify(mapping));
      let data = {
        description: 'Update the fake product 02',
        price: 6.5,
      };
      let response = await api.updateProduct(2, data);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
      expect(response.data.content.id).toBe(2);
      expect(response.data.content.description).toBe(data.description);
      expect(response.data.content.price).toBe(data.price);
    });

    it('DELETE', async () => {
      let mapping = {
        id: uuid.v1(),
        request: {
          method: 'DELETE',
          url: '/api/products/3',
        },
        response: {
          status: 200,
          body: JSON.stringify({
            success: true,
          }),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        },
      };
      await Wiremock.mapping(JSON.stringify(mapping));
      let response = await api.deleteProduct(3);
      expect(response.status).toBe(200);
      expect(response.data.success).toBeTruthy();
    });
  });
});
