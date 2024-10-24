import errors from '@js/core/errors';

const Locker = function () {
  const info = {};

  const currentCount = function (lockName) {
    return info[lockName] || 0;
  };

  return {
    obtain(lockName) {
      info[lockName] = currentCount(lockName) + 1;
    },

    release(lockName) {
      const count = currentCount(lockName);

      if (count < 1) {
        throw errors.Error('E0014');
      }

      if (count === 1) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete info[lockName];
      } else {
        info[lockName] = count - 1;
      }
    },

    locked(lockName) {
      return currentCount(lockName) > 0;
    },
  };
};

export { Locker };
