import { isNumeric, isObject, isPlainObject } from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';

type Dictionary = Record<PropertyKey, unknown>;

type CollectionLike = Set<unknown>
  | Map<unknown, unknown>
  | WeakSet<object>
  | WeakMap<object, unknown>;

type EmptyTarget = Record<string, never>;

type AssignFunction = (
  target: Dictionary,
  property: string,
  value: unknown,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
) => void;

const clone = (function createClone() {
  function Clone(): void { }

  return function cloneObject<T extends object>(obj: T): T {
    Clone.prototype = obj;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- obj is its prototype
    return new Clone();
  };
}());

const isBlobLike = function isBlobLike(value: unknown): value is Blob {
  return typeof Blob !== 'undefined' && value instanceof Blob;
};

const isCollectionLike = function isCollectionLike(value: unknown): value is CollectionLike {
  return value instanceof Set || value instanceof Map
    || value instanceof WeakSet || value instanceof WeakMap;
};

const orderEach = function orderEach<TValue>(
  map: Record<string, TValue>,
  func: (key: string, value: TValue) => void,
): void {
  const keys: string[] = [];

  // eslint-disable-next-line no-restricted-syntax -- the own keys are checked in the loop
  for (const key in map) {
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      keys.push(key);
    }
  }

  keys.sort((x, y) => {
    const isNumberX = isNumeric(x);
    const isNumberY = isNumeric(y);

    if (isNumberX && isNumberY) return x - y;
    if (isNumberX && !isNumberY) return -1;
    if (!isNumberX && isNumberY) return 1;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  });

  for (const key of keys) {
    func(key, map[key]);
  }
};

const getDeepCopyTarget = (item: unknown): unknown => {
  if (isObject(item)) {
    if (Array.isArray(item)) {
      return [];
    }
    if (isCollectionLike(item)) {
      return item;
    }
    if (!isPlainObject(item)) {
      return Object.create(Object.getPrototypeOf(item));
    }
    return {};
  }
  return item;
};

const legacyAssign = function legacyAssign(
  target: Dictionary,
  property: string,
  value: unknown,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the signature of newAssign
  shouldCopyUndefined?: boolean,
): void {
  if (!assignByReference && variableWrapper.isWrapped(target[property])) {
    variableWrapper.assign(target[property], value);
  } else {
    target[property] = value;
  }
};

function deepExtendArraySafe<TChanges extends Blob | CollectionLike>(
  target: unknown,
  changes: TChanges,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
  useNewAssign?: boolean | AssignFunction,
): TChanges;
function deepExtendArraySafe<TChanges extends object>(
  target: EmptyTarget,
  changes: TChanges,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
  useNewAssign?: boolean | AssignFunction,
): TChanges;
function deepExtendArraySafe<TTarget>(
  target: TTarget,
  changes: unknown,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
  useNewAssign?: boolean | AssignFunction,
): TTarget;
// B239679, http://bugs.jquery.com/ticket/9477
function deepExtendArraySafe(
  target: unknown,
  changes: unknown,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
  useNewAssign?: boolean | AssignFunction,
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define -- newAssign calls it back
  const assignFunc = useNewAssign ? newAssign : legacyAssign;

  if (isBlobLike(changes) || isCollectionLike(changes)) {
    return changes;
  }

  const targetObject = target as Dictionary;
  const changesObject = changes as Dictionary;

  // eslint-disable-next-line no-restricted-syntax, guard-for-in -- inherited keys are copied too
  for (const name in changesObject) {
    const prevValue = targetObject[name];
    let newValue = changesObject[name];

    if (name === '__proto__' || name === 'constructor' || target === newValue) {
      // eslint-disable-next-line no-continue -- the keys that are not copied are skipped
      continue;
    }

    if (isPlainObject(newValue)) {
      const goDeeper = extendComplexObject ? isObject(prevValue) : isPlainObject(prevValue);
      newValue = deepExtendArraySafe(
        goDeeper ? prevValue : {},
        newValue,
        extendComplexObject,
        assignByReference,
        shouldCopyUndefined,
      );
    }

    const isDeepCopyArray = Array.isArray(newValue)
      && !assignByReference
      && prevValue !== newValue;
    const hasDifferentNewValue = (
      (!!shouldCopyUndefined || newValue !== undefined) && prevValue !== newValue
    ) || (shouldCopyUndefined && prevValue === undefined);

    if (isDeepCopyArray || hasDifferentNewValue) {
      assignFunc(
        targetObject,
        name,
        newValue,
        extendComplexObject,
        assignByReference,
        shouldCopyUndefined,
      );
    }
  }

  return target;
}

const newAssign = function newAssign(
  target: Dictionary,
  property: string,
  value: unknown,
  extendComplexObject?: boolean,
  assignByReference?: boolean,
  shouldCopyUndefined?: boolean,
): void {
  const goDeeper = extendComplexObject ? isObject(target) : isPlainObject(target);
  if (!assignByReference && variableWrapper.isWrapped(target[property])) {
    variableWrapper.assign(target[property], value);
  } else if (!assignByReference && Array.isArray(value)) {
    target[property] = value.map((item: unknown) => deepExtendArraySafe(
      getDeepCopyTarget(item),
      item,
      extendComplexObject,
      assignByReference,
      shouldCopyUndefined,
    ));
  } else if (!assignByReference && goDeeper) {
    target[property] = deepExtendArraySafe(
      getDeepCopyTarget(value),
      value,
      extendComplexObject,
      assignByReference,
      shouldCopyUndefined,
      newAssign,
    );
  } else {
    target[property] = value;
  }
};

export {
  clone,
  deepExtendArraySafe,
  isCollectionLike,
  legacyAssign,
  newAssign,
  orderEach,
};
