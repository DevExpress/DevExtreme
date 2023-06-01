
const gulp = require('gulp');
const path = require('path');
const glob = require('glob');
const del = require('del');
const rename = require('gulp-rename');
const lazyPipe = require('lazypipe');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const template = require('gulp-template');
const lazypipe = require('lazypipe');
const parseArguments = require('minimist');

function getPlaygroundName() {
    process.env.BABEL_ENV = 'development';
    const args = parseArguments(process.argv, { string: ['playgroundName'] });
    const playgroundName = args['playgroundName'];
    return playgroundName;
}

const cssLightFileName = 'css/dx.light.css';
const renovationRoot = 'testing/renovation/platforms/';
const platforms = {
    'react': {
        pattern: '*.jsx', entryName: (fn) => path.basename(fn, '.jsx'),
        getDeclarationFile: (basenameFilename) => basenameFilename + '.jsx'
    }
};

const declarationFiles = glob.sync(path.join(renovationRoot, 'declaration', '*.tsx'));
const templatePipe = (dest, data) => (
    lazyPipe()
        .pipe(template, data)
        .pipe(rename, (p) => {
            p.basename = path.basename(dest);
            p.extname = '';
        })()
);
function namedTask(name, task) {
    task.displayName = name;
    return task;
}

const tasks = ({ isWatch }) => Object.entries(platforms)
    .map(([platform, { pattern, getEntyPoint = (fn) => fn, entryName, getDeclarationFile }]) => {
        const platformRoot = path.join(renovationRoot, platform);
        const platformRootSrc = path.join(platformRoot, 'src');
        const platformDeclarationSrc = path.join(platformRootSrc, 'declaration');
        const platformRootDest = path.join(platformRoot, 'dist');
        const platformDeclarationDest = path.join(platformRootDest, 'declaration');
        const playgroundName = getPlaygroundName();
        const fileFilter = playgroundName ? (fn) => entryName(fn) === playgroundName : () => true;
        const platformDeclarationFiles = declarationFiles
            .map(fn => path.join(platformRootSrc, 'declaration', path.basename(fn, '.tsx')))
            .map(getDeclarationFile || ((basenameFilename) => basenameFilename + '.js'))
            .filter(fileFilter);
        const nativeFiles = glob.sync(path.join(platformRootSrc, pattern))
            .filter(fileFilter);

        const htmlFileGeneratorTask = destDir => fileName => {
            const dest = path.join(destDir, path.basename(entryName(fileName) + '.html'));
            const entryPointJS = entryName(fileName) + '.js';
            const pathToArtifacts = path.relative(destDir, 'artifacts').replace(/\\/g, '/');
            const style = path.join(pathToArtifacts, cssLightFileName);
            return namedTask(`${platform}-html`,
                () => gulp
                    .src('build/gulp/templates/playground-html-bootstrap.jst')
                    .pipe(templatePipe(dest, { style, entryPointJS }))
                    .pipe(gulp.dest(destDir)),
            );
        };

        let generateHtmlFiles = [
            ...nativeFiles.map(htmlFileGeneratorTask(platformRootDest)),
            ...platformDeclarationFiles.map(htmlFileGeneratorTask(platformDeclarationDest))
        ];
        if(platform == 'vue') {
            const vueAppFileGenerationTask = destDir => fileName => {
                const appComponentModule = './' + path.relative(destDir, fileName)
                    .slice(0, -4)
                    .replace(/\\/g, '/');
                const destFileName = path.basename(getEntyPoint(fileName));
                return namedTask(`${platform}-vue-app`,
                    () => gulp
                        .src('build/gulp/templates/playground-vue-application.jst')
                        .pipe(templatePipe(destFileName, { appComponentModule }))
                        .pipe(gulp.dest(destDir)),
                );
            };
            generateHtmlFiles = [
                ...generateHtmlFiles,
                ...nativeFiles.map(vueAppFileGenerationTask(platformRootSrc)),
                ...platformDeclarationFiles.map(vueAppFileGenerationTask(platformDeclarationSrc))
            ];
        }
        const declarationAppFileGeneratorTask = fileName => {
            const relativePathToDeclationComponent = path.relative(path.dirname(fileName), path.join(renovationRoot, 'declaration'));
            const componentModule = path.join(relativePathToDeclationComponent, entryName(fileName))
                .replace(/\\/g, '/');
            return namedTask(`${platform}-declaration-app`,
                () => gulp
                    .src(`build/gulp/templates/playground-${platform}-declaration-application.jst`)
                    .pipe(templatePipe(path.basename(fileName), { componentModule }))
                    .pipe(gulp.dest(path.dirname(fileName)))
            );
        };
        const generateDeclarationFiles = platformDeclarationFiles.map(declarationAppFileGeneratorTask);
        const compileSourceGeneratorTask = (fileEntries, dest) => {
            const getConfig = () => {
                const webpackConfig = require(path.resolve(path.join(platformRoot, './webpack.config')))(path.resolve(platformRoot));
                const entries = fileEntries
                    .reduce((result, fn) => {
                        result[entryName(fn)] = path.resolve(getEntyPoint(fn))
                        return result;
                    }, {});
                const _config = {
                    ...webpackConfig,
                    ...{
                        watch: isWatch,
                        entry: entries,
                        output: {
                            path: path.resolve(dest),
                            publicPath: '/',
                            filename: '[name].js',
                            chunkFilename: '[id].chunk.js',
                        },
                        resolveLoader: {
                            modules: [path.resolve('testing/renovation/node_modules'), 'node_modules'],
                        },
                    },
                };
                return _config;
            };
            // use lazypipe to prevent resolve webpack require dependencies
            const webpackPipe = (config) => lazypipe().pipe(webpackStream, config, webpack)();
            return namedTask(`${platform}-compile-source`,
                () => gulp
                    .src(path.resolve(platformRootSrc))
                    .pipe(webpackPipe(getConfig()))
                    .pipe(gulp.dest(dest))
            );
        }
        const compileSourceFiles = [
            compileSourceGeneratorTask(nativeFiles, platformRootDest),
            compileSourceGeneratorTask(platformDeclarationFiles, platformDeclarationDest)
        ]
        return gulp.series(
            gulp.parallel([...generateHtmlFiles, ...generateDeclarationFiles]),
            gulp.parallel(compileSourceFiles)
        );
    });

gulp.task('build-renovation-testing', gulp.series(
    (done) => { process.env.BABEL_ENV = 'development'; done(); },
    gulp.parallel(tasks({ iswatch: false }))
));

gulp.task('build-renovation-testing:watch', gulp.series(
    (done) => {
        const playgroundName = getPlaygroundName();
        if(!playgroundName) {
            console.log('\x1b[1mYou can use task with playground name for speedup: \x1b[32mnpm run build-renovation-testing -- playgroundName\x1b[0m')
        }
        done();
    },
    gulp.parallel(tasks({ isWatch: true }))
));

const foldersToCleanup = [
    ...(glob.sync(renovationRoot + '/**/dist')),
    ...(glob.sync(renovationRoot + '/**/src/declaration')),
    ...(glob.sync(renovationRoot + '/vue/src/**/*-app.js')),
]
    .map(f => () => del(f));
gulp.task('clean-renovation-testing',
    gulp.parallel([...foldersToCleanup, (cb) => { cb(); }])
);
