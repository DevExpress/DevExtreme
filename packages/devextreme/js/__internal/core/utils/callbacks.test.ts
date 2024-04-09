/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable @typescript-eslint/init-declarations */
import type { Callback } from './callbacks';
import Callbacks from './callbacks';

describe('Methods', () => {
  let myCallbacks: Callback<unknown[], unknown>;
  beforeEach(() => {
    myCallbacks = Callbacks();
  });
  afterEach(() => {
    myCallbacks.empty();
  });

  it('Call all of the Callbacks with the argument', () => {
    let callBack1;
    let callBack2;

    myCallbacks.add((param) => {
      callBack1 = true;

      expect(param).toEqual({ param: 'test' });
    });
    myCallbacks.add((param) => {
      callBack2 = true;

      expect(callBack1).toBeTruthy();
      expect(param).toEqual({ param: 'test' });
    });

    myCallbacks.fire({ param: 'test' });

    expect(callBack2).toBeTruthy();
  });

  it('Fired method', () => {
    myCallbacks.add(() => {});

    expect(myCallbacks.fired()).not.toBeTruthy();

    myCallbacks.fire();

    expect(myCallbacks.fired()).toBeTruthy();
  });

  it('Call all Callbacks in a list with the given context', () => {
    const context = {};
    let callBack1;
    let callBack2;

    myCallbacks.add(function (param) {
      callBack1 = true;

      expect(param).toEqual({ param: 'test' });
      expect(this).toBe(context);
    });
    myCallbacks.add(function (param) {
      callBack2 = true;

      expect(callBack1).toBeTruthy();
      expect(param).toEqual({ param: 'test' });
      expect(this).toBe(context);
    });

    myCallbacks.fireWith(context, [{ param: 'test' }]);

    expect(callBack2).toBeTruthy();
  });

  it('Determine whether callback is in a list', () => {
    const callBack1 = function () {};
    const callBack2 = function () {};

    myCallbacks.add(callBack1);

    expect(myCallbacks.has(callBack1)).toBeTruthy();
    expect(!myCallbacks.has(callBack2)).toBeTruthy();
  });

  it('Remove a callback from a callback list', () => {
    const callBack1 = function () { };
    const callBack2 = function () { };

    myCallbacks.add(callBack1);
    myCallbacks.add(callBack2);

    expect(myCallbacks.has(callBack1)).toBeTruthy();
    expect(myCallbacks.has(callBack2)).toBeTruthy();

    myCallbacks.remove(callBack1);

    expect(!myCallbacks.has(callBack1)).toBeTruthy();
    expect(myCallbacks.has(callBack2)).toBeTruthy();
  });

  it('Remove a callback from a callback list when firing', () => {
    let callOrder: number[] = [];

    const callBack1 = function () {
      callOrder.push(1);
    };
    const callBack3 = function () {
      callOrder.push(3);
    };
    const callBack2 = function () {
      callOrder.push(2);
      myCallbacks.remove(callBack3);
    };
    const callBack4 = function () {
      callOrder.push(4);
      myCallbacks.remove(callBack1);
    };
    const callBack5 = function () {
      callOrder.push(5);
      myCallbacks.remove(callBack5);
      myCallbacks.fire();
    };
    const callBack6 = function () {
      callOrder.push(6);
    };

    myCallbacks.add(callBack1);
    myCallbacks.add(callBack2);
    myCallbacks.add(callBack3);
    myCallbacks.add(callBack4);
    myCallbacks.add(callBack5);
    myCallbacks.add(callBack6);

    myCallbacks.fire();

    expect(callOrder).toEqual([1, 2, 4, 5, 6, 2, 4, 6]);

    callOrder = [];

    myCallbacks.fire();

    expect(callOrder).toEqual([2, 4, 6]);
  });

  it('Remove all of the Callbacks from a list', () => {
    const callBack1 = function () { };
    const callBack2 = function () { };

    myCallbacks.add(callBack1);
    myCallbacks.add(callBack2);

    expect(myCallbacks.has(callBack1)).toBeTruthy();
    expect(myCallbacks.has(callBack2)).toBeTruthy();

    myCallbacks.empty();

    expect(!myCallbacks.has(callBack1)).toBeTruthy();
    expect(!myCallbacks.has(callBack2)).toBeTruthy();
  });

  it('Base strategy', () => {
    let firstFire = true;
    const callOrder: { callback: number; params: unknown }[] = [];

    myCallbacks.add((param) => {
      callOrder.push({ callback: 1, params: param });
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 2, params: param });

      if (firstFire) {
        firstFire = false;
        myCallbacks.fire(2);
      }
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 3, params: param });
    });

    myCallbacks.fire(1);

    expect(callOrder).toEqual([
      { callback: 1, params: 1 },
      { callback: 2, params: 1 },
      { callback: 3, params: 1 },
      { callback: 1, params: 2 },
      { callback: 2, params: 2 },
      { callback: 3, params: 2 },
    ]);
  });
});

describe('Flags', () => {
  let myCallbacks: Callback<unknown[], unknown>;
  beforeEach(() => {
    myCallbacks = Callbacks();
  });
  afterEach(() => {
    myCallbacks.empty();
  });

  it('Sync strategy with one inner fire', () => {
    let firstFire = true;
    const callOrder: { callback: number; params: unknown }[] = [];

    myCallbacks = Callbacks({ syncStrategy: true });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 1, params: param });
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 2, params: param });

      if (firstFire) {
        firstFire = false;
        myCallbacks.fire(2);
      }
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 3, params: param });
    });

    myCallbacks.fire(1);

    expect(callOrder).toEqual([
      { callback: 1, params: 1 },
      { callback: 2, params: 1 },
      { callback: 1, params: 2 },
      { callback: 2, params: 2 },
      { callback: 3, params: 2 },
      { callback: 3, params: 1 },
    ]);
  });

  // T544647
  it('Sync strategy with one inner fire in first callback', () => {
    const callOrder: { callback: number; params: unknown }[] = [];

    myCallbacks = Callbacks({ syncStrategy: true });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 1, params: param });
      if (callOrder.length === 1) {
        myCallbacks.fire(2);
      }
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 2, params: param });
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 3, params: param });
    });

    myCallbacks.fire(1);

    expect(callOrder).toEqual([
      { callback: 1, params: 1 },
      { callback: 1, params: 2 },
      { callback: 2, params: 2 },
      { callback: 3, params: 2 },
      { callback: 2, params: 1 },
      { callback: 3, params: 1 },
    ]);
  });

  it('Sync strategy with two inner fires', () => {
    let fireCount = 1;
    const callOrder: { callback: number; params: unknown }[] = [];

    myCallbacks = Callbacks({ syncStrategy: true });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 1, params: param });
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 2, params: param });

      if (fireCount < 3) {
        fireCount += 1;
        myCallbacks.fire(fireCount);
      }
    });

    myCallbacks.add((param) => {
      callOrder.push({ callback: 3, params: param });
    });

    myCallbacks.fire(1);

    expect(callOrder).toEqual([
      { callback: 1, params: 1 },
      { callback: 2, params: 1 },
      { callback: 1, params: 2 },
      { callback: 2, params: 2 },
      { callback: 1, params: 3 },
      { callback: 2, params: 3 },
      { callback: 3, params: 3 },
      { callback: 3, params: 2 },
      { callback: 3, params: 1 },
    ]);
  });

  it('Remove a callback from a callback list when firing for sync strategy', () => {
    let callOrder: number[] = [];

    myCallbacks = Callbacks({ syncStrategy: true });

    const callBack1 = function () {
      callOrder.push(1);
    };
    const callBack3 = function () {
      callOrder.push(3);
    };
    const callBack2 = function () {
      callOrder.push(2);
      myCallbacks.remove(callBack3);
    };
    const callBack4 = function () {
      callOrder.push(4);
      myCallbacks.remove(callBack1);
    };
    const callBack5 = function () {
      callOrder.push(5);
      myCallbacks.remove(callBack5);
      myCallbacks.fire();
    };
    const callBack6 = function () {
      callOrder.push(6);
    };

    myCallbacks.add(callBack1);
    myCallbacks.add(callBack2);
    myCallbacks.add(callBack3);
    myCallbacks.add(callBack4);
    myCallbacks.add(callBack5);
    myCallbacks.add(callBack6);

    myCallbacks.fire();

    expect(callOrder).toEqual([1, 2, 4, 5, 2, 4, 6, 6]);

    callOrder = [];

    myCallbacks.fire();

    expect(callOrder).toEqual([2, 4, 6]);
  });

  it('StopOnFalse', () => {
    let fireCount = 0;

    myCallbacks = Callbacks({ stopOnFalse: true });

    myCallbacks.add(() => {
      fireCount += 1;

      return false;
    });

    myCallbacks.add(() => {
      fireCount += 1;
    });

    myCallbacks.fire();

    expect(fireCount).toStrictEqual(1);
  });

  it('Unique', () => {
    let fireCount = 0;

    myCallbacks = Callbacks({ unique: true });

    const func = function () {
      fireCount += 1;
    };

    myCallbacks.add(func);
    myCallbacks.add(func);

    myCallbacks.fire();

    expect(fireCount).toStrictEqual(1);
  });
});
