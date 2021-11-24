const createVinyl = require('./utils/create-gulp-file');
const { camelCase } = require('./utils')
const path = require('path');
const gulp = require('gulp');

function createReactEntryPoint(context) {
    const components = require(path.resolve(process.cwd(), path.join(context.destination, 'components.js')));
    const contents = components
        .map(x => x.pathInRenovationFolder.slice(0, -2))
        .map(x => `    ${camelCase(x.split('/').splice(-1)[0])}: require('./${x}')`)
        .join(',\n');
    const entryPointTemplate =
        `const modules = {
${contents}
}
module.exports = modules;
`
    
    return createVinyl('entrypoint.js', entryPointTemplate)
        .pipe(gulp.dest(context.destination));
}


module.exports = {
    createReactEntryPoint,
}
