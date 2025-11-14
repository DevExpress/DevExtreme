import arrayQueryImpl from './array_query';
import remoteQueryImpl from './remote_query';

export const queryImpl = {
    array: arrayQueryImpl,
    remote: remoteQueryImpl
};
