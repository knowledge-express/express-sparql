# express-sparql

Easy SPARQL server with express.js.

## Installation

```
npm install express-sparql
```

## Example

```javascript
import * as express from 'express';
import * as bodyParser from 'body-parser';
import handleSPARQL from 'express-sparql';

const PORT = '3000';
const server = express();

server.all('/sparql',
  bodyParser.urlencoded(),
  bodyParser.text({ type: [ 'application/sparql-query', 'application/sparql-update' ]}),
  handleSPARQL({
    queryFn: async (query) => {
      const json = await DB.query(query);
      return json;
    },
    updateFn: async (update) => {
      const json = await DB.update(update);
      return json;
    },
    encodeFn: async (result, encoding) => JSON.stringify(result),
  })
);

server.listen(PORT);
```

See also: [https://github.com/knowledge-express/poseidon](https://github.com/knowledge-express/poseidon).

## TODO
- [ ] Encoding logic (i.e. content-negotiation)
- [ ] Better error handling
