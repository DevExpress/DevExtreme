import errors from '@js/core/errors';

export interface Lock {
  obtain: (lockName: string) => void;
  release: (lockName: string) => void;
  locked: (lockName: string) => boolean;
}

export function Locker(): Lock {
  const info: Record<string, number> = {};

  const currentCount = (lockName: string): number => info[lockName] || 0;

  return {
    obtain(lockName: string): void {
      info[lockName] = currentCount(lockName) + 1;
    },

    release(lockName: string): void {
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

    locked(lockName: string): boolean {
      return currentCount(lockName) > 0;
    },
  };
}
