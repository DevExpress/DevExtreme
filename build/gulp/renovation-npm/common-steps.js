const gulp = require('gulp');
const createVinyl = require('./utils/create-gulp-file');
const { camelCase, getComponentsSpecification } = require('./utils');

function createEntryPoint(context, fileName) {
    return () => {
        const contents = getComponentsSpecification(context.destination, context.components)
            .map(x => x.pathInRenovationFolder.slice(0, -2))
            .map(x => `export * as ${camelCase(x.split('/').splice(-1)[0])} from './${x}';`)
            .join('\n');
    
        return createVinyl(fileName, contents)
            .pipe(gulp.dest(context.destination));
    };
}

module.exports = {
    createEntryPoint
}
