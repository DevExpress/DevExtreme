const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const replaceStateManagerModulesForProduction = require('../replace_state_manager_modules_for_production');
const { removeDevelopmentStateManagerModules } = require('../remove_development_state_manager_modules');

const SETUP_STATE_MANAGER_PRODUCTION_CONTENT = `export const setupStateManager = () => {
    // this setupStateManager function body is empty for production build
}
`;

const REACTIVE_PRIMITIVES_PRODUCTION_CONTENT = `export const signal = () => {
    // this signal function body is for production build
}`

const INDEX_PRODUCTION_CONTENT = [
    SETUP_STATE_MANAGER_PRODUCTION_CONTENT,
    REACTIVE_PRIMITIVES_PRODUCTION_CONTENT
].join('\n');

const INDEX_DEVELOPMENT_CONTENT = [
    `export { setupStateManager } from './setup_state_manager';`,
    `export { signal } from './reactive_primitives/index`
].join('\n');

const SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT = `export const setupStateManager = () => {
    // this setupStateManager function body is for development build
}`;

const REACTIVE_PRIMITIVES_DEVELOPMENT_CONTENT = `export const signal = () => {
    // this signal function body is for development build
}`;

const UTILS_FILE_CONTENT = 'console.log("utils file");';

const FILE_OUTSIDE_STATE_MANGER_CONTENT = 'console.log("file outside of state manager");';

describe('Build the state manager', () => {
    let tempDir;
    let devextremeDir;
    let stateManagerDir;
    let setupFilePath;
    let indexProductionFilePath;
    let indexFilePath;
    let utilsFilePath;
    let fileOutsideStateMangerPath;
    let originalConsoleError;
    let consoleErrorSpy;
    let reactivePrimitivesIndexFilePath;
    let reactivePrimitivesIndexProductionFilePath;
    let files;
    let stream;

    beforeEach(() => {
        stream = replaceStateManagerModulesForProduction();
        const testDir = __dirname;
        const tempDirName = `temp`;
        tempDir = path.join(testDir, tempDirName);

        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }

        devextremeDir = path.join(tempDir, 'devextreme');
        stateManagerDir = path.join(devextremeDir, 'esm', '__internal', 'core', 'state_manager');
        reactivePrimitivesDir = path.join(stateManagerDir, 'reactive_primitives');
        fs.mkdirSync(stateManagerDir, { recursive: true });
        fs.mkdirSync(reactivePrimitivesDir, { recursive: true });


        setupFilePath = path.join(stateManagerDir, 'setup_state_manager.js');
        indexFilePath = path.join(stateManagerDir, 'index.js');
        indexProductionFilePath = path.join(stateManagerDir, 'index.prod.js');

        reactivePrimitivesIndexFilePath = path.join(stateManagerDir, 'reactive_primitives', 'index.js');
        reactivePrimitivesIndexProductionFilePath = path.join(stateManagerDir, 'reactive_primitives', 'index.prod.js');

        utilsFilePath = path.join(stateManagerDir, 'utils.js');
        fileOutsideStateMangerPath = path.join(tempDir, 'other_file.js');

        fs.writeFileSync(setupFilePath, SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT);
        fs.writeFileSync(indexFilePath, INDEX_DEVELOPMENT_CONTENT);
        fs.writeFileSync(indexProductionFilePath, INDEX_PRODUCTION_CONTENT);
        fs.writeFileSync(utilsFilePath, UTILS_FILE_CONTENT);
        fs.writeFileSync(fileOutsideStateMangerPath, FILE_OUTSIDE_STATE_MANGER_CONTENT);

        fs.writeFileSync(reactivePrimitivesIndexFilePath, REACTIVE_PRIMITIVES_DEVELOPMENT_CONTENT);
        fs.writeFileSync(reactivePrimitivesIndexProductionFilePath, REACTIVE_PRIMITIVES_PRODUCTION_CONTENT);

        originalConsoleError = console.error;
        consoleErrorSpy = jest.fn();
        console.error = consoleErrorSpy;

        files = [
            {
                path: fileOutsideStateMangerPath,
                contents: Buffer.from(FILE_OUTSIDE_STATE_MANGER_CONTENT)
            },
            {
                path: setupFilePath,
                contents: Buffer.from(SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT)
            },
            {
                path: utilsFilePath,
                contents: Buffer.from(UTILS_FILE_CONTENT)
            },
            {
                path: indexFilePath,
                contents: Buffer.from(INDEX_DEVELOPMENT_CONTENT)
            },
            {
                path: indexProductionFilePath,
                contents: Buffer.from(INDEX_PRODUCTION_CONTENT)
            },
            {
                path: reactivePrimitivesIndexFilePath,
                contents: Buffer.from(REACTIVE_PRIMITIVES_DEVELOPMENT_CONTENT)
            },
            {
                path: reactivePrimitivesIndexProductionFilePath,
                contents: Buffer.from(REACTIVE_PRIMITIVES_PRODUCTION_CONTENT)
            },
        ];

        stream.on('data', (file) => {
            fs.writeFileSync(file.path, file.contents.toString());
        });

        files.forEach(file => stream.write(file));

        stream.end();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it('should remove development modules', (done) => {
        stream.on('end', () => {
            try {
                removeDevelopmentStateManagerModules(devextremeDir);

                expect(fs.existsSync(indexFilePath)).toBe(true);
                expect(fs.existsSync(indexProductionFilePath)).not.toBe(true);
                expect(fs.existsSync(reactivePrimitivesIndexFilePath)).toBe(true);
                expect(fs.existsSync(reactivePrimitivesIndexProductionFilePath)).not.toBe(true);
                expect(fs.existsSync(setupFilePath)).not.toBe(true);
                expect(fs.existsSync(utilsFilePath)).not.toBe(true);

                expect(consoleErrorSpy).not.toHaveBeenCalled();

                done();
            } catch (error) {
                done(error);
            }
        });

        stream.on('error', done);
    });

    it('should not remove modules that are unrelated to the state manager', (done) => {
        stream.on('end', () => {
            try {
                removeDevelopmentStateManagerModules(devextremeDir);

                const fileOutsideStateMangerPathContent = fs.readFileSync(fileOutsideStateMangerPath, 'utf8');

                expect(fileOutsideStateMangerPathContent).toBe(FILE_OUTSIDE_STATE_MANGER_CONTENT);
                done();
            } catch (error) {
                done(error);
            }
        });

        stream.on('error', done);
    });

    it('should replace index.js content by production content', (done) => {
        stream.on('end', () => {
            try {
                removeDevelopmentStateManagerModules(devextremeDir);
                const indexFileContent = fs.readFileSync(indexFilePath, 'utf8');

                const reactivePrimitivesIndexFileContent = fs.readFileSync(reactivePrimitivesIndexFilePath, 'utf8');

                expect(indexFileContent).toBe(INDEX_PRODUCTION_CONTENT);
                expect(reactivePrimitivesIndexFileContent).toBe(REACTIVE_PRIMITIVES_PRODUCTION_CONTENT);

                expect(consoleErrorSpy).not.toHaveBeenCalled();

                done();
            } catch (error) {
                done(error);
            }
        });

        stream.on('error', done);
    });
});
