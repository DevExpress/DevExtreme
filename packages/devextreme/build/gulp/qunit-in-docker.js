const gulp = require('gulp');
const shell = require('gulp-shell');
const parseArguments = require('minimist');

gulp.task('qunit-in-docker', (d) => {
    const variants = ['export', 'misc', 'ui', 'ui.widgets', 'ui.editors', 'ui.grid', 'ui.scheduler', 'viz', 'renovation'];
    const args = parseArguments(process.argv);
    const constellation = args['constel'];
    if(variants.includes(constellation)) {
        return shell.task('docker run --rm -ti -e TARGET=test -e JQUERY=true -e CONSTEL=' + constellation +
            ' -e BROWSER=chrome -e LOCAL=true -p 9222:9222 -v ' + process.cwd() + ':/devextreme devexpress/devextreme-build:21_1 ./docker-ci.sh')();
    } else {
        console.log('Use one of next variants:');
        variants.forEach(v => console.log(`npm run qunit-in-docker -- ${v}`));
        d();
    }
});
