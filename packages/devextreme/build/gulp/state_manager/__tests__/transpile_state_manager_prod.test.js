const fs = require('fs');
const path = require('path');
const through2 = require('through2');
const transpileStateManagerProd = require('../transpile_state_manager_prod');

const SETUP_STATE_MANAGER_PRODUCTION_CONTENT = `export const setupStateManager = () => {
    // this function body is empty for production build
}
`;

const SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT = `export const setupStateManager = () => {
    const isDevelopment = true;
}`;

const UTILS_FILE_CONTENT = 'console.log("utils file");';

const FILE_OUTSIDE_STATE_MANGER_CONTENT = 'console.log("file outside of state manager");';

describe('transpileStateManagerProd', () => {
    let tempDir;
    let stateManagerDir;
    let setupFilePath;
    let productionFilePath;
    let utilsFilePath;
    let fileOutsideStateMangerPath;
    let originalConsoleError;
    let consoleErrorSpy;

    beforeEach(() => {
        const testDir = __dirname;
        const tempDirName = `temp`;
        tempDir = path.join(testDir, tempDirName);

        stateManagerDir = path.join(tempDir, 'devextreme', 'src', '__internal', 'core', 'state_manager');
        fs.mkdirSync(stateManagerDir, { recursive: true });

        setupFilePath = path.join(stateManagerDir, 'setup_state_manager.js');
        productionFilePath = path.join(stateManagerDir, 'production.js');
        utilsFilePath = path.join(stateManagerDir, 'utils.js');
        fileOutsideStateMangerPath = path.join(tempDir, 'other_file.js');

        fs.writeFileSync(setupFilePath, SETUP_STATE_MANAGER_DEVELOPMENT_CONTENT);
        fs.writeFileSync(productionFilePath, SETUP_STATE_MANAGER_PRODUCTION_CONTENT);
        fs.writeFileSync(utilsFilePath, UTILS_FILE_CONTENT);
        fs.writeFileSync(fileOutsideStateMangerPath, FILE_OUTSIDE_STATE_MANGER_CONTENT);

        originalConsoleError = console.error;
        consoleErrorSpy = jest.fn();
        console.error = consoleErrorSpy;
    });

    afterEach(() => {
        console.error = originalConsoleError;

        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    test('should replace setup_state_manager.js content with production.js content in ESM mode', (done) => {
        const stream = transpileStateManagerProd(true);

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
            }
        ];

        const results = [];

        stream.on('data', (file) => {
            results.push({
                path: file.path,
                content: file.contents.toString()
            });
        });

        stream.on('end', () => {
            try {
                const regularFile = results.find(r => r.path === fileOutsideStateMangerPath);
                const setupFile = results.find(r => r.path === setupFilePath);
                const utilsFile = results.find(r => r.path === utilsFilePath);

                expect(regularFile).toBeDefined();
                expect(regularFile.content).toBe(FILE_OUTSIDE_STATE_MANGER_CONTENT);

                expect(setupFile).toBeDefined();
                expect(setupFile.content).toBe(SETUP_STATE_MANAGER_PRODUCTION_CONTENT);

                expect(utilsFile).toBeDefined();
                expect(utilsFile.content).toBe(UTILS_FILE_CONTENT);

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

    test('should replace setup_state_manager.js content with production.js content in CJS mode', (done) => {
        const stream = transpileStateManagerProd(false);

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
            }
        ];

        const results = [];

        stream.on('data', (file) => {
            results.push({
                path: file.path,
                content: file.contents.toString()
            });
        });

        stream.on('end', () => {
            try {
                const regularFile = results.find(r => r.path === fileOutsideStateMangerPath);
                const setupFile = results.find(r => r.path === setupFilePath);
                const utilsFile = results.find(r => r.path === utilsFilePath);

                expect(regularFile).toBeDefined();
                expect(regularFile.content).toBe(FILE_OUTSIDE_STATE_MANGER_CONTENT);

                expect(setupFile).toBeDefined();
                expect(setupFile.content).toMatch(/(exports|module\.exports)/);

                expect(utilsFile).toBeDefined();
                expect(utilsFile.content).toBe(UTILS_FILE_CONTENT);

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
