import { queryImpl } from '@js/common/data/query_implementation';

const query = function () {
  const impl = Array.isArray(arguments[0]) ? 'array' : 'remote';
  // @ts-expect-error
  return queryImpl[impl].apply(this, arguments);
};

export default query;
