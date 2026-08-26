function findElements(selector) {
  return [...document.querySelectorAll(selector)];
}

function postpone(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration || 5000));
}

function postponeUntilInternal(condition, interval = 100, timeout = 10000) {
  return new Promise((resolve) => {
    const start = performance.now();

    const check = () => {
      const result = condition();
      const elapsed = performance.now() - start;

      if (elapsed >= timeout || result) {
        return resolve();
      }

      setTimeout(() => requestAnimationFrame(check), interval);
    };

    check();
  });
}

function postponeUntil(condition, interval, timeout) {
  return postponeUntilInternal(condition, interval, timeout);
}

function ifAny(array) {
  return array.length && array;
}

function postponeUntilFoundInternal(selector, interval, timeout) {
  const condition = Array.isArray(selector)
    ? (() => ifAny(selector.flatMap(findElements)))
    : (() => ifAny(findElements(selector)));
  return postponeUntilInternal(condition, interval, timeout);
}
function postponeUntilFound(selector, interval, timeout) {
  return postponeUntilFoundInternal(selector, interval, timeout);
}

function getValues(getter) {
  const values = getter();
  return Array.isArray(values) ? values : [values];
}

function tryGetValues(getter) {
  try {
    const values = getValues(getter);
    return values.every((v) => v !== undefined) ? values : null;
  } catch {
    return null;
  }
}

// window.DevExpress (see test-globals-bundle.js) is assigned asynchronously after page load,
// so cjs() can throw or return undefined for a short window right after navigation.
function importAnd(es6, cjs, callback) {
  let values = null;
  return postponeUntilInternal(() => {
    values = tryGetValues(cjs);
    return values !== null;
  }, 50, 10000).then(() => callback(...(values || getValues(cjs))));
}

function mockOptionMethod(instance) {
  const { option } = instance;
  instance.option = function mock(name) {
    if (arguments.length === 0) {
      return option.call(this);
    }
    if (arguments.length === 1 && typeof name === 'string') {
      return option.call(this, name);
    }
    return undefined;
  };
}

const testUtils = {
  postpone,
  postponeUntil,
  postponeUntilFound,
  importAnd,
  findElements,
  mockOptionMethod,
};

window.testUtils = testUtils;
