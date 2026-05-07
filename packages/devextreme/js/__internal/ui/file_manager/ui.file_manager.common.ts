/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isFunction } from '@js/core/utils/type';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const whenSome = (arg, onSuccess?, onError?) => {
  // eslint-disable-next-line no-param-reassign
  onSuccess = onSuccess || noop;
  // eslint-disable-next-line no-param-reassign
  onError = onError || noop;

  if (!Array.isArray(arg)) {
    // eslint-disable-next-line no-param-reassign
    arg = [arg];
  }

  const deferreds = arg.map((item, index) => when(item).then(
    (result) => {
      if (isFunction(onSuccess)) {
        onSuccess({ item, index, result });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    },
    (error?) => {
      if (!error) {
        // eslint-disable-next-line no-param-reassign
        error = {};
      }
      error.index = index;
      if (isFunction(onError)) {
        onError(error);
      }
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve().promise();
    },
  ));

  // eslint-disable-next-line prefer-spread
  return when.apply(null, deferreds);
};

export const getDisplayFileSize = (byteSize): string => {
  const sizesTitles = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let displaySize = byteSize;
  while (displaySize >= 1024 && index <= sizesTitles.length - 1) {
    displaySize /= 1024;
    index += 1;
  }
  displaySize = Math.round(displaySize * 10) / 10;
  return `${displaySize} ${sizesTitles[index]}`;
};

export const extendAttributes = (
  targetObject,
  sourceObject,
  objectKeysArray,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  objectKeysArray.forEach((objectKey) => {
    extend(
      true,
      targetObject,
      isDefined(sourceObject[objectKey])
        ? { [objectKey]: sourceObject[objectKey] }
        : {},
    );
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return targetObject;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findItemsByKeys = (itemInfos, keys) => {
  const itemMap = {};
  keys.forEach((key): void => {
    itemMap[key] = null;
  });

  itemInfos.forEach((itemInfo): void => {
    const { key } = itemInfo.fileItem;
    if (Object.prototype.hasOwnProperty.call(itemMap, key)) {
      itemMap[key] = itemInfo;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = [];
  keys.forEach((key): void => {
    const itemInfo = itemMap[key];
    if (itemInfo) {
      result.push(itemInfo);
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getMapFromObject = (object) => {
  const keys = Object.keys(object);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any[] = [];
  keys.forEach((key) => values.push(object[key]));
  return { keys, values };
};
