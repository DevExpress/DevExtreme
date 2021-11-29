const { spawnSync } = require('child_process');
const path = require('path');

function camelCase(str) {
    return str
        .split('_')
        .map(x => `${x[0].toUpperCase()}${x.slice(1)}`)
        .join('');
}
function run(cmd, args, options) {
    return function run(cb) {
        const proc = spawnSync(cmd, args, { stdio: 'inherit', ...options });
        cb();
    }
}
function getComponentsSpecification(specDest, componentsList) {
    const components = require(path.resolve(process.cwd(), path.join(specDest, 'components.js')));
    return componentsList === 'all' ? components : components.filter(x => componentsList.includes(x.name));
}

module.exports = {
    camelCase,
    run,
    getComponentsSpecification
}
