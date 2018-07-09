import test from 'ava';
import createHandler from '../lib';

test('createHandler: it exists', t => {
  return t.not(createHandler, undefined);
});
