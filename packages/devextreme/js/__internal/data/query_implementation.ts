import arrayQueryImpl from './m_array_query';
import remoteQueryImpl from './m_remote_query';

export const queryImpl = {
  array: arrayQueryImpl,
  remote: remoteQueryImpl,
};
