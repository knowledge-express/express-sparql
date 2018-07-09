export declare type SPARQLQuery = string;
export declare type SPARQLUpdate = string;
export declare type SPARQLQueryResponse = any;
export declare type SPARQLUpdateResponse = any;
export declare type QueryFn = (query: SPARQLQuery) => Promise<SPARQLQueryResponse>;
export declare type UpdateFn = (query: SPARQLUpdate) => Promise<SPARQLUpdateResponse>;
export declare type Encoding = 'application/sparql-results+json';
export declare type EncodeFn = (result: SPARQLQueryResponse, encoding: Encoding) => Promise<string>;
export declare type SPARQLHandlerOptions = {
    queryFn: QueryFn;
    updateFn?: UpdateFn;
    encodeFn: EncodeFn;
};
export declare function createHandler({queryFn, updateFn, encodeFn}: SPARQLHandlerOptions): any;
export default createHandler;
