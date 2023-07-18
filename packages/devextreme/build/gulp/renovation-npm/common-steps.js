const gulp = require('gulp');
const createVinyl = require('./utils/create-gulp-file');
const { getComponentsSpecification } = require('./utils');

function createEntryPoint(context, fileName) {
    return () => {
        const contents = getComponentsSpecification(context.destination, context.components)
            .map(x => `export * as ${x.name} from './${x.pathInRenovationFolder.slice(0, -2)}';`)
            .join('\n');
    
        return createVinyl(fileName, contents)
            .pipe(gulp.dest(context.destination));
    };
}

module.exports = {
    createEntryPoint
}
