"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function createHandler({ queryFn, updateFn, encodeFn }) {
    const handleQuery = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { method, headers: { 'content-type': contentType, accept: acceptType }, query: queryParams, body, } = req;
            let query, update;
            if (method.toUpperCase() === 'GET') {
                if (!('query' in queryParams))
                    throw new Error(`queryParam 'query' is required.`);
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
                else
                    throw new Error(`The following content-types are supported: 'application/x-www-form-urlencoded', 'application/sparql-query'`);
            }
            else
                throw new Error('Only GET and POST requests are supported.');
            if (query) {
                const result = yield queryFn(query);
                const encoded = yield encodeFn(result, acceptType);
                res.status(200).set({ 'content-type': acceptType }).send(encoded).end();
            }
            if (update) {
                const result = yield updateFn(update);
                if (result)
                    return res.status(204).end();
                res.status(500).json({ error: 'Update failed.' }).end();
            }
        }
        catch (e) {
            return next(e);
        }
    });
    return handleQuery;
}
exports.createHandler = createHandler;
exports.default = createHandler;
