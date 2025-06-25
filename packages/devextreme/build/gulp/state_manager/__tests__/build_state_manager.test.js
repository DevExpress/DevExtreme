const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const replaceStateManagerModulesForProduction = require('../replace_state_manager_modules_for_production');

const SETUP_STATE_MANAGER_PRODUCTION_CONTENT = `export const setupStateManager = () => {
    // this function body is empty for production build
}
`;

const INDEX_PRODUCTION_CONTENT = SETUP_STATE_MANAGER_PRODUCTION_CONTENT;

const INDEX_DEVELOPMENT_CONTENT = `export { setupStateManager } from './setup_state_manager';`;

const SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT = `export const setupStateManager = () => {
    // this function body is for development build
}`;

const UTILS_FILE_CONTENT = 'console.log("utils file");';

const FILE_OUTSIDE_STATE_MANGER_CONTENT = 'console.log("file outside of state manager");';

describe('Build the state manager', () => {
    let tempDir;
    let stateManagerDir;
    let setupFilePath;
    let indexProductionFilePath;
    let indexFilePath;
    let utilsFilePath;
    let fileOutsideStateMangerPath;
    let originalConsoleError;
    let consoleErrorSpy;

    beforeEach(() => {
        const testDir = __dirname;
        const tempDirName = `temp`;
        tempDir = path.join(testDir, tempDirName);

        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }

        stateManagerDir = path.join(tempDir, 'devextreme', 'src', '__internal', 'core', 'state_manager');
        fs.mkdirSync(stateManagerDir, { recursive: true });

        setupFilePath = path.join(stateManagerDir, 'setup_state_manager.js');
        indexFilePath = path.join(stateManagerDir, 'index.js');
        indexProductionFilePath = path.join(stateManagerDir, 'index.prod.js');
        utilsFilePath = path.join(stateManagerDir, 'utils.js');
        fileOutsideStateMangerPath = path.join(tempDir, 'other_file.js');

        fs.writeFileSync(setupFilePath, SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT);
        fs.writeFileSync(indexFilePath, INDEX_DEVELOPMENT_CONTENT);
        fs.writeFileSync(indexProductionFilePath, INDEX_PRODUCTION_CONTENT);
        fs.writeFileSync(utilsFilePath, UTILS_FILE_CONTENT);
        fs.writeFileSync(fileOutsideStateMangerPath, FILE_OUTSIDE_STATE_MANGER_CONTENT);

        originalConsoleError = console.error;
        consoleErrorSpy = jest.fn();
        console.error = consoleErrorSpy;
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    test('should replace index.js content with index.prod.js content', (done) => {
        const stream = replaceStateManagerModulesForProduction();

        const files = [
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
        ];

        stream.on('data', (file) => {
            fs.writeFileSync(file.path, file.contents.toString());
        });

        stream.on('end', () => {
            try {
                const fileOutsideStateMangerPathContent = fs.readFileSync(fileOutsideStateMangerPath, 'utf8');
                const setupFileContent = fs.readFileSync(setupFilePath, 'utf8');
                const utilsFileContent = fs.readFileSync(utilsFilePath, 'utf8');
                const indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
                const indexProductionFileContent = fs.readFileSync(indexProductionFilePath, 'utf8');

                expect(fileOutsideStateMangerPathContent).toBe(FILE_OUTSIDE_STATE_MANGER_CONTENT);
                expect(setupFileContent).toBe(SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT);
                expect(utilsFileContent).toBe(UTILS_FILE_CONTENT);
                expect(indexProductionFileContent).toBe(INDEX_PRODUCTION_CONTENT);
                expect(indexFileContent).toBe(INDEX_PRODUCTION_CONTENT);

                expect(consoleErrorSpy).not.toHaveBeenCalled();
                done();
            } catch (error) {
                done(error);
            }
        });

        stream.on('error', done);

        files.forEach(file => stream.write(file));

        stream.end();
    });
});
