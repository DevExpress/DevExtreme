const { spawnSync } = require('child_process');

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

module.exports = {
    camelCase,
    run
}
