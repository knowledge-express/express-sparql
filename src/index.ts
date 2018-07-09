import * as express from 'express';

export type SPARQLQuery = string;
export type SPARQLUpdate = string;
export type SPARQLQueryResponse = any;
export type SPARQLUpdateResponse = any;
export type QueryFn = (query: SPARQLQuery) => Promise<SPARQLQueryResponse>;
export type UpdateFn = (query: SPARQLUpdate) => Promise<SPARQLUpdateResponse>;
export type Encoding = 'application/sparql-results+json';
export type EncodeFn = (result: SPARQLQueryResponse, encoding: Encoding) => Promise<string>;

export type SPARQLHandlerOptions = {
  queryFn: QueryFn,
  updateFn?: UpdateFn,
  encodeFn: EncodeFn,
}

export function createHandler({ queryFn, updateFn, encodeFn }: SPARQLHandlerOptions) {
  const handleQuery: express.Handler = async (req, res, next) => {
    try {
      const {
        method,
        headers: { 'content-type': contentType, accept: acceptType = 'application/sparql-results+json' },
        query: queryParams,
        body,
      } = req;

      // Extract SPARQL query from request
      let query: SPARQLQuery, update: SPARQLUpdate;
      if (method.toUpperCase() === 'GET') {
        if (!('query' in queryParams)) throw new Error(`queryParam 'query' is required.`);
        query = queryParams.query;
      }
      else if (method.toUpperCase() === 'POST') {
        if (contentType === 'application/x-www-form-urlencoded') {
          query = body.query;
          update = body.update;
        }
        else if (contentType === 'application/sparql-query') {
          query = body;
        }
        else if (contentType === 'application/sparql-update') {
          update = body;
        }
        else throw new Error(`The following content-types are supported: 'application/x-www-form-urlencoded', 'application/sparql-query'`)
      }
      else throw new Error('Only GET and POST requests are supported.');

      if (query) {
        // Execute query
        const result = await queryFn(query);

        // Encode result
        const encoded = await encodeFn(result, acceptType as Encoding);

        // Send encoded result
        res.status(200).set({ 'content-type': acceptType }).send(encoded).end();
      }

      if (update) {
        // Execute update
        const result = await updateFn(update);
        if (result) return res.status(204).end();
        res.status(500).json({ error: 'Update failed.' }).end();
      }
    } catch(e) {
      return next(e);
    }
  }

  return handleQuery;
}

export default createHandler;
