/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-undef */

const gulp = require('gulp');
const { spawn } = require('child_process');
const glob = require('glob');
const path = require('path');
const argv = require('yargs').argv;
const del = require('del');
const { platform } = require('os');

const framework = argv.framework;
if(!framework || framework !== 'react' && framework !== 'angular') {
    throw new Error('command argument should be "react" or "angular"');
}

const dirname = () => path.join(__dirname, `${framework}-app`);

const run = (cmd, cb) => {
    const info = {};
    if(platform() === 'win32') {
        info.command = 'cmd';
        info.args = [`/c ${cmd}`];
    } else {
        info.command = 'bash';
        info.args = ['-c', cmd];
    }
    spawn(info.command, info.args, { stdio: 'inherit', cwd: dirname() })
        .on('close', () => cb());
};

gulp.task('build-devextreme', (cb) => {
    run('cd ../../../ && npm run build', cb);
});
gulp.task('build-devextreme-renovation', (cb) => {
    run(`cd ../../../ && npm run build-npm-renovation:${framework}`, cb);
});
gulp.task('build-all', gulp.series('build-devextreme', 'build-devextreme-renovation'));

gulp.task('pack-devextreme', (cb) => {
    run('npm pack ../../../artifacts/npm/devextreme', cb);
});
gulp.task('pack-devextreme-renovation', (cb) => {
    run(`npm pack ../../../artifacts/npm-${framework}`, cb);
});
gulp.task('pack-all', gulp.series('pack-devextreme', 'pack-devextreme-renovation'));

const installPackage = (packageName, cb) => {
    glob(path.join(dirname(), `${packageName}*.tgz`), (_, matches) => {
        const pkg = matches.filter(x => path.basename(x).match(new RegExp(`${packageName}-\\d.*`, 'g')))[0];
        if(!pkg) {
            cb(new Error(`Package does not exist: ${packageName}`));
        }
        const relativeFileName = path.relative(dirname(), pkg);
        run(`npm i --no-package-lock ./${relativeFileName}`, cb);
    });
};
gulp.task('install-devextreme', (cb) => {
    installPackage('devextreme', cb);
});
gulp.task('install-devextreme-renovation', (cb) => {
    installPackage(`devextreme-${framework}`, cb);
});
gulp.task('install-all', (cb)=>{
    glob(path.join(dirname(), 'devextreme*.tgz'), (_, matches) => {
        const packageNames = matches.map(pkg => path.relative(dirname(), pkg));
        if(packageNames.length !== 3) {
            cb(new Error(`Expected 3 packages but got ${packageNames.length}:\n ${JSON.stringify(packageNames, null, 2)}`));
            return;
        }
        run(`npm i --no-package-lock ./${packageNames.map(x => `./${x}`).join(' ')}`, cb);
    });
});

gulp.task('start', (cb) => {
    run('npm run start', cb);
});

gulp.task('cleanup', (cb) => {
    del.sync(`./${framework}-app/node_modules/**`, { force: true });
    del.sync(`./${framework}-app/devextreme-*.tgz`, { force: true });
    cb();
});

gulp.task('prepare-all', gulp.series('cleanup', 'build-all', 'pack-all', 'install-all'));
