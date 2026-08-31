/* global sinon */

export function installSeam(module, name, replacement) {
    const original = module[name];

    replacement.restore = () => module[`DEBUG_set_${name}`](original);
    module[`DEBUG_set_${name}`](replacement);

    return replacement;
}

export function spySeam(module, name) {
    return installSeam(module, name, sinon.spy(module[name]));
}

export function stubSeam(module, name) {
    return installSeam(module, name, sinon.stub());
}
