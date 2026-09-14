/* global sinon */

export function installSeam(module, name, replacement, setterName = `DEBUG_set_${name}`) {
    const original = module[name];

    replacement.restore = () => module[setterName](original);
    module[setterName](replacement);

    return replacement;
}

export function spySeam(module, name, setterName) {
    return installSeam(module, name, sinon.spy(module[name]), setterName);
}

export function stubSeam(module, name, setterName) {
    return installSeam(module, name, sinon.stub(), setterName);
}
