import errors from '../../core/errors';

const addNamespace = (eventNames, namespace) => {
    if(!namespace) {
        throw errors.Error('E0017');
    }

    if(typeof eventNames === 'string') {
        return eventNames.indexOf(' ') === -1 ?
            `${eventNames}.${namespace}` :
            addNamespace(eventNames.split(/\s+/g), namespace);
    }

    return eventNames
        .map(eventName => `${eventName}.${namespace}`)
        .join(' ');
};

export default addNamespace;
