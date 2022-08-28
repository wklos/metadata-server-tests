import supertest, { Response } from 'supertest';
import { BASE_URL } from '../config/baseUrl';

const request_handler = supertest(BASE_URL);

export const makeGETCall = async (endpoint: string): Promise<Response> => {
  return request_handler.get(endpoint).then(
    (resolved) => {
      return resolved;
    },
    (rejected) => {
      // Code adjusted to handle errors incorrectly returned as a string instead of JSON
      const response = {} as Response;
      response.body = rejected.rawResponse;
      response.statusCode = rejected.statusCode;
      return response;
    }
  );
};

export const makePOSTCall = async (
  endpoint: string,
  payload: string | object
): Promise<Response> => {
  return request_handler
    .post(endpoint)
    .send(payload)
    .then(
      (resolved) => {
        return resolved;
      },
      (rejected) => {
        // Code adjusted to handle errors incorrectly returned as a string instead of JSON
        const response = {} as Response;
        response.body = rejected.rawResponse;
        response.statusCode = rejected.statusCode;
        return response;
      }
    );
};
