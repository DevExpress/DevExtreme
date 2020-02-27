import Errors from '../ui/widget/ui.errors';
import { isString } from './utils/type';

const registry = {};

function handleName(name) {
    if(!isString(name)) {
        Errors.log('W0017');
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
        Errors.log('W0018', libName);
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
