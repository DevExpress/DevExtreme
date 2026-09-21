import errors from '@js/core/errors';

const addNamespace = (eventNames: string | string[], namespace: string): string => {
  if (!namespace) {
    throw errors.Error('E0017');
  }

  if (Array.isArray(eventNames)) {
    return eventNames
      .map((eventName) => addNamespace(eventName, namespace))
      .join(' ');
  }

  if (eventNames.includes(' ')) {
    return addNamespace(eventNames.split(/\s+/g), namespace);
  }

  return `${eventNames}.${namespace}`;
};

export default addNamespace;
