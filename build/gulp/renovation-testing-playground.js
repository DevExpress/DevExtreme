
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

const cssLightFileName = 'css/dx.light.css';
const renovationRoot = 'testing/renovation/platforms/';
const platforms = {
    'react': {
        pattern: '*.jsx', entryName: (fn) => path.basename(fn, '.jsx'),
        getDeclarationFile: (basenameFilename) => basenameFilename + '.jsx'
    },
    'angular': {
        pattern: '!(declaration)**/app.component.ts', entryName: (fn) => path.basename(path.dirname(fn)),
        getDeclarationFile: (basenameFilename) => path.join(basenameFilename, 'app.component.ts')
    },
    'vue': {
        pattern: '*.vue', entryName: (fn) => path.basename(fn, '.vue'),
        getEntyPoint: (fn) => path.join(path.dirname(fn), path.basename(fn, '.vue') + '-app.js'),
        getDeclarationFile: (basenameFilename) => basenameFilename + '.vue',
    },
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
function namedTask(task, name) {
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
        const platformDeclarationFiles = declarationFiles
            .map(fn => path.join(platformRootSrc, 'declaration', path.basename(fn, '.tsx')))
            .map(getDeclarationFile || ((basenameFilename) => basenameFilename + '.js'));
        const nativeFiles = glob.sync(path.join(platformRootSrc, pattern));

        const htmlFileGeneratorTask = destDir => fileName => {
            const dest = path.join(destDir, path.basename(entryName(fileName) + '.html'));
            const entryPointJS = entryName(fileName) + '.js';
            const pathToArtifacts = path.relative(destDir, 'artifacts').replace(/\\/g, '/');
            const style = path.join(pathToArtifacts, cssLightFileName);
            return namedTask(() => gulp
                .src('build/gulp/templates/playground-html-bootstrap.jst')
                .pipe(templatePipe(dest, {
                    style,
                    entryPointJS
                }))
                .pipe(gulp.dest(destDir)), `${platform}-html`);
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
                return namedTask(() => gulp
                    .src('build/gulp/templates/playground-vue-application.jst')
                    .pipe(templatePipe(destFileName, { appComponentModule }))
                    .pipe(gulp.dest(destDir)), `${platform}-vue-app`)
            };
            generateHtmlFiles = [
                ...generateHtmlFiles,
                ...nativeFiles.map(vueAppFileGenerationTask(platformRootSrc)),
                ...platformDeclarationFiles.map(vueAppFileGenerationTask(platformDeclarationSrc))
            ];
        }
        if(platform == 'angular') {
            const angularTemplateGenerationTask = fileName => {
                const destFileName = path.basename(fileName, '.ts') + '.html';
                const destDir = path.join(platformDeclarationSrc, entryName(fileName))
                return namedTask(() => gulp
                    .src('build/gulp/templates/playground-angular-declaration-template.jst')
                    .pipe(templatePipe(destFileName, {}))
                    .pipe(gulp.dest(destDir)), `${platform}-angular-app`)
            };
            generateHtmlFiles = [
                ...generateHtmlFiles,
                ...platformDeclarationFiles.map(angularTemplateGenerationTask)
            ];
        }
        const declarationAppFileGeneratorTask = fileName => {
            const relativePathToDeclationComponent = path.relative(path.dirname(fileName), path.join(renovationRoot, 'declaration'));
            const componentModule = path.join(relativePathToDeclationComponent, entryName(fileName))
                .replace(/\\/g, '/');
            return namedTask(() => gulp
                .src(`build/gulp/templates/playground-${platform}-declaration-application.jst`)
                .pipe(templatePipe(path.basename(fileName), { componentModule }))
                .pipe(gulp.dest(path.dirname(fileName))), `${platform}-declaration-app`);
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
            return namedTask(() => gulp
                .src(path.resolve(platformRootSrc))
                .pipe(webpackPipe(getConfig()))
                .pipe(gulp.dest(dest)), `${platform}-compile-source`);
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
    (done) => { process.env.BABEL_ENV = 'development'; done(); },
    gulp.parallel(tasks({ iswatch: true }))
));

const foldersToCleanup = [
    ...(glob.sync(renovationRoot + '/**/dist')),
    ...(glob.sync(renovationRoot + '/**/src/declaration')),
    ...(glob.sync(renovationRoot + '/vue/src/**/*-app.js')),
]
    .map(f => {
        return () => {
            return del(f)
        }
    });
gulp.task('clean-renovation-testing',
    gulp.parallel([...foldersToCleanup, (cb) => { cb(); }])
);
