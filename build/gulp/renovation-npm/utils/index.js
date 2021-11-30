const { spawnSync } = require('child_process');

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

module.exports = {
    camelCase,
    run
}
