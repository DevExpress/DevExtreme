const callOnce = function (handler) {
  let result;

  let wrappedHandler = function () {
    result = handler.apply(this, arguments);
    wrappedHandler = function () {
      return result;
    };
    return result;
  };

  return function () {
    // @ts-expect-error Iarguments not assignable to []
    return wrappedHandler.apply(this, arguments);
  };
};

export { callOnce };
