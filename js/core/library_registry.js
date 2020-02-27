import Errors from '../ui/widget/ui.errors';
import { logger } from './utils/console';
import { isString } from './utils/type';

const registry = {};

function handleName(name) {
    if(!isString(name)) {
        logger.warn('Incorrect "name" argument type');
        return {};
    }

    return {
        libName: name,
        libKey: name.toLowerCase()
    };
}

export function addLibrary(name, library, overwrite = false) {
    const { libName, libKey } = handleName(name);

    if(!libName) {
        return;
    }

    if(registry[libKey] && !overwrite) {
        logger.warn(`${libName} is already defined`);
        return;
    }

    registry[libKey] = library;
}

export function getLibrary(name) {
    const { libName, libKey } = handleName(name);

    if(!libName) {
        return;
    }

    const library = registry[libKey];

    if(!library) {
        throw Errors.Error('E1041', libName);
    }

    return library;
}

export function resetLibraryRegistry() {
    for(const lib in registry) {
        delete registry[lib];
    }
}
