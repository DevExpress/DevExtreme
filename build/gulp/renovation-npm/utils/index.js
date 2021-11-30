const { spawnSync } = require('child_process');
const path = require('path');
const minimatch = require("minimatch");

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
    let pattern = componentsList ?? '';
    if(Array.isArray(pattern)) {
        if(pattern.length === 1) {
            pattern = pattern[0];
        } else {
            pattern = `{${componentsList.join(',')}}`
        }
    }

    return !pattern ? components : components.filter(x => minimatch(x.name, pattern, { nocase: true }));
}

module.exports = {
    camelCase,
    run,
    getComponentsSpecification
}
