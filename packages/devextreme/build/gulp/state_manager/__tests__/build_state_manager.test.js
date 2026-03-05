const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const Vinyl = require('vinyl');
const replaceStateManagerModulesForProduction = require('../replace_state_manager_modules_for_production');
const { removeDevelopmentStateManagerModules } = require('../remove_development_state_manager_modules');

const createEnvContent = (env) => ({
    index: [
        `export { setupStateManager } from './setup_state_manager';`,
        `export { signal } from './reactive_primitives/index';`
    ].join('\n'),
    setupStateManager: `export const setupStateManager = () => {
        // this setupStateManager function body is for ${env} build
    }`,
    reactivePrimitivesIndex: `export const signal = () => {
        // this signal function body is for ${env} build
    }`,
});

const PROD_DIR_CONTENT = createEnvContent('prod');
const DEV_DIR_CONTENT = createEnvContent('dev');

const INDEX_DEV_CONTENT = `export { setupStateManager, signal } from './dev/index';`;
const INDEX_PROD_CONTENT = `export * from './prod/index';`;

const FILE_OUTSIDE_OF_ENV_SPECIFIC_FOLDER_CONTENT = 'test content';
const FILE_OUTSIDE_STATE_MANGER_CONTENT = 'console.log("file outside of state manager");';

describe('Build the state manager', () => {
    let testsContext;
    let originalConsoleError;
    let consoleErrorSpy;

    const createEnvPaths = (baseDir, env) => ({
        reactivePrimitivesDir: path.join(baseDir, env, 'reactive_primitives'),
        reactivePrimitivesIndex: path.join(baseDir, env, 'reactive_primitives', 'index.js'),
        setupStateManager: path.join(baseDir, env, 'setup_state_manager.js'),
        index: path.join(baseDir, env, 'index.js'),
    });

    const createEnvFiles = (paths, content) => {
        Object.entries(paths).forEach(([key, filePath]) => {
            if (filePath.endsWith('.js') && content[key]) {
                fs.writeFileSync(filePath, content[key]);
            }
        });
    };

    const createEnvSpecificStreamFileObjects = (paths, content) => {
        return Object.entries(paths)
            .filter(([key, filePath]) => filePath.endsWith('.js') && content[key])
            .map(([key, filePath]) => new Vinyl({
                path: filePath,
                contents: Buffer.from(content[key])
            }));
    };

    beforeEach(() => {
        const stream = replaceStateManagerModulesForProduction();
        const tempDir = path.join(__dirname, '__test-artifacts__');

        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }

        const devextremeDir = path.join(tempDir, 'devextreme');
        const stateManagerDir = path.join(devextremeDir, 'esm', '__internal', 'core', 'state_manager');
        const cjsStateManagerDir = path.join(devextremeDir, 'cjs', '__internal', 'core', 'state_manager');
        const devDir = path.join(stateManagerDir, 'dev');
        const prodDir = path.join(stateManagerDir, 'prod');
        const cjsProdDir = path.join(cjsStateManagerDir, 'prod');

        const devPaths = createEnvPaths(stateManagerDir, 'dev');
        const prodPaths = createEnvPaths(stateManagerDir, 'prod');
        const cjsProdPaths = createEnvPaths(cjsStateManagerDir, 'prod');

        const indexFilePath = path.join(stateManagerDir, 'index.js');
        const cjsIndexFilePath = path.join(cjsStateManagerDir, 'index.js');
        const fileOutsideOfEnvSpecificFolderFilePath = path.join(stateManagerDir, 'state_manager.test.js');
        const fileOutsideStateMangerPath = path.join(tempDir, 'other_file.js');

        fs.mkdirSync(stateManagerDir, { recursive: true });
        fs.mkdirSync(cjsStateManagerDir, { recursive: true });
        fs.mkdirSync(devDir, { recursive: true });
        fs.mkdirSync(prodDir, { recursive: true });
        fs.mkdirSync(cjsProdDir, { recursive: true });
        fs.mkdirSync(devPaths.reactivePrimitivesDir, { recursive: true });
        fs.mkdirSync(prodPaths.reactivePrimitivesDir, { recursive: true });
        fs.mkdirSync(cjsProdPaths.reactivePrimitivesDir, { recursive: true });

        fs.writeFileSync(indexFilePath, INDEX_DEV_CONTENT);
        fs.writeFileSync(cjsIndexFilePath, INDEX_DEV_CONTENT);
        fs.writeFileSync(fileOutsideOfEnvSpecificFolderFilePath, FILE_OUTSIDE_OF_ENV_SPECIFIC_FOLDER_CONTENT);
        fs.writeFileSync(fileOutsideStateMangerPath, FILE_OUTSIDE_STATE_MANGER_CONTENT);

        createEnvFiles(devPaths, DEV_DIR_CONTENT);
        createEnvFiles(prodPaths, PROD_DIR_CONTENT);
        createEnvFiles(cjsProdPaths, PROD_DIR_CONTENT);

        originalConsoleError = console.error;
        consoleErrorSpy = jest.fn();
        console.error = consoleErrorSpy;

        const files = [
            ...createEnvSpecificStreamFileObjects(prodPaths, PROD_DIR_CONTENT),
            ...createEnvSpecificStreamFileObjects(cjsProdPaths, PROD_DIR_CONTENT),
            ...createEnvSpecificStreamFileObjects(devPaths, DEV_DIR_CONTENT),
            new Vinyl({
                path: fileOutsideStateMangerPath,
                contents: Buffer.from(FILE_OUTSIDE_STATE_MANGER_CONTENT)
            }),
            new Vinyl({
                path: fileOutsideOfEnvSpecificFolderFilePath,
                contents: Buffer.from(FILE_OUTSIDE_OF_ENV_SPECIFIC_FOLDER_CONTENT)
            }),
            new Vinyl({
                path: indexFilePath,
                contents: Buffer.from(INDEX_DEV_CONTENT)
            }),
            new Vinyl({
                path: cjsIndexFilePath,
                contents: Buffer.from(INDEX_DEV_CONTENT)
            }),
        ];

        stream.on('data', (file) => {
            fs.writeFileSync(file.path, file.contents.toString());
        });

        files.forEach(file => stream.write(file));
        stream.end();

        testsContext = {
            stream,
            devextremeDir,
            devDir,
            prodPaths,
            indexFilePath,
            cjsIndexFilePath,
            fileOutsideOfEnvSpecificFolderFilePath,
            fileOutsideStateMangerPath
        };
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    const runTestWithStream = (testFn) => {
        return (done) => {
            testsContext.stream.on('end', () => {
                try {
                    testFn();
                    done();
                } catch (error) {
                    done(error);
                }
            });
            testsContext.stream.on('error', done);
        };
    };

    it('should remove development modules', runTestWithStream(() => {
        removeDevelopmentStateManagerModules(testsContext.devextremeDir);

        expect(fs.existsSync(testsContext.devDir)).toBe(false);
        expect(fs.existsSync(testsContext.fileOutsideOfEnvSpecificFolderFilePath)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    }));

    it('should not remove modules that are unrelated to the state manager', runTestWithStream(() => {
        removeDevelopmentStateManagerModules(testsContext.devextremeDir);

        const fileOutsideStateMangerPathContent = fs.readFileSync(testsContext.fileOutsideStateMangerPath, 'utf8');
        expect(fileOutsideStateMangerPathContent).toBe(FILE_OUTSIDE_STATE_MANGER_CONTENT);
    }));

    it('should replace `index.js` content by `prod/index.js` content', runTestWithStream(() => {
        removeDevelopmentStateManagerModules(testsContext.devextremeDir);

        const esmIndexContent = fs.readFileSync(testsContext.indexFilePath, 'utf8');
        expect(esmIndexContent).toBe(INDEX_PROD_CONTENT);
        expect(fs.existsSync(testsContext.prodPaths.index)).toBe(true);

        const cjsIndexContent = fs.readFileSync(testsContext.cjsIndexFilePath, 'utf8');
        expect(cjsIndexContent).toContain('require("./prod/index")');
        expect(cjsIndexContent).not.toContain('export *');

        expect(consoleErrorSpy).not.toHaveBeenCalled();
    }));
});
