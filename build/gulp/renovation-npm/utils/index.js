const { spawnSync } = require('child_process');
const path = require('path');
const minimatch = require("minimatch");
const { platform } = require('os');

function camelCase(str) {
    return str
        .split('_')
        .map(x => `${x[0].toUpperCase()}${x.slice(1)}`)
        .join('');
}
function run(cmd, options) {
    const info = {};
    return function run(cb) {
        if (platform() === 'win32') {
            info.command = 'cmd';
            info.args = [`/c ${cmd}`];
        } else {
            info.command = 'bash';
            info.args = ['-c', cmd];
        }
        spawnSync(info.command, info.args, { stdio: 'inherit', ...options });
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
