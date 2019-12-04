import errors from '../../core/errors';

const addNamespace = (eventNames, namespace) => {
    if(!namespace) {
        throw errors.Error('E0017');
    }

    if(Array.isArray(eventNames)) {
        return eventNames
            .map(eventName => `${eventName}.${namespace}`)
            .join(' ');
    } else if(eventNames.indexOf(' ') !== -1) {
        return addNamespace(eventNames.split(/\s+/g), namespace);
    }

    return `${eventNames}.${namespace}`;
};

export default addNamespace;
