import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';

import express from 'express';

import createHandler from '../lib';

const route = '/sparql';
const model = {
  queryFn: sinon.stub().returns(Promise.resolve({})),
  updateFn: sinon.stub().returns(Promise.resolve({})),
  encodeFn: sinon.stub().returns(Promise.resolve('{}')),
};

function createServer() {
  const server = express();

  server.all(route, createHandler(model))

  return server;
}

const expectedQueryResult = '{}';

test('createHandler: it exists', t => {
  return t.not(createHandler, undefined);
});

test('/sparql: it responds to GET requests with a query in the query parameters', async t => {
  const app = createServer();

  const query = `
    SELECT *
    WHERE {
      ?subject ?predicate ?object
    }`;

  // const url = `${poseidonHost}/sparql?query=${encodeURIComponent(query)}`;

    const result = await supertest(app)
      .get(route)
      .query({ query: query })
      .expect('Content-Type', 'application/sparql-results+json; charset=utf-8')
      .expect(200);

  // Test stubs

  return t.deepEqual(result.text, expectedQueryResult);
});
