const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

function createVectorMapService({
    packageRoot,
    testingRoot,
    vectorDataDirectory,
    vectorMapTesterPort,
    pathToNode,
}) {
    const vectorMapNodeServer = {
        process: null,
        refs: 0,
        killTimer: null,
    };

    function readThemeCssFiles() {
        const bundlesPath = path.join(packageRoot, 'scss', 'bundles');
        const result = [];

        if(!fs.existsSync(bundlesPath)) {
            return result;
        }

        fs.readdirSync(bundlesPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .forEach((entry) => {
                const bundleDirectory = path.join(bundlesPath, entry.name);
                fs.readdirSync(bundleDirectory, { withFileTypes: true })
                    .filter((file) => file.isFile() && file.name.endsWith('.scss'))
                    .forEach((file) => {
                        result.push(`${path.basename(file.name, '.scss')}.css`);
                    });
            });

        return result;
    }

    function readVectorMapTestData() {
        if(!fs.existsSync(vectorDataDirectory)) {
            return [];
        }

        return fs.readdirSync(vectorDataDirectory, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
            .map((entry) => {
                const filePath = path.join(vectorDataDirectory, entry.name);
                return {
                    name: path.basename(entry.name, '.txt'),
                    expected: fs.readFileSync(filePath, 'utf8'),
                };
            });
    }

    async function redirectRequestToVectorMapNodeServer(action, arg) {
        acquireVectorMapNodeServer();

        try {
            const startTime = Date.now();

            while(true) {
                try {
                    const text = await httpGetText(`http://127.0.0.1:${vectorMapTesterPort}/${action}/${arg}`);
                    return text;
                } catch(error) {
                    if(Date.now() - startTime > 5000) {
                        throw error;
                    }

                    await wait(50);
                }
            }
        } finally {
            releaseVectorMapNodeServer();
        }
    }

    function executeVectorMapConsoleApp(arg, searchParams) {
        const inputDirectory = `${path.join(packageRoot, 'testing', 'content', 'VectorMapData')}${path.sep}`;
        const outputDirectory = path.join(inputDirectory, '__Output');
        const settingsPath = path.join(inputDirectory, '_settings.js');
        const processFileContentPath = path.join(inputDirectory, '_processFileContent.js');
        const vectorMapUtilsNodePath = path.resolve(path.join(packageRoot, 'artifacts/js/vectormap-utils/dx.vectormaputils.node.js'));

        const args = [vectorMapUtilsNodePath, inputDirectory];

        if(searchParams.has('file')) {
            args[1] += searchParams.get('file');
        }

        args.push('--quiet', '--output', outputDirectory, '--settings', settingsPath, '--process-file-content', processFileContentPath);

        const isJson = searchParams.has('json');

        if(isJson) {
            args.push('--json');
        }

        fs.mkdirSync(outputDirectory, { recursive: true });

        try {
            const spawnResult = spawnSync(pathToNode, args, {
                timeout: 15000,
                stdio: 'ignore',
            });

            if(spawnResult.error) {
                if(spawnResult.error.code === 'ETIMEDOUT') {
                    // Intentionally ignored to match legacy behavior.
                } else {
                    throw spawnResult.error;
                }
            }

            const extension = isJson ? '.json' : '.js';

            return fs.readdirSync(outputDirectory, { withFileTypes: true })
                .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
                .map((entry) => {
                    const filePath = path.join(outputDirectory, entry.name);
                    let text = fs.readFileSync(filePath, 'utf8');
                    let variable = null;

                    if(!isJson) {
                        const index = text.indexOf('=');
                        if(index > 0) {
                            variable = text.substring(0, index).trim();
                            text = text.substring(index + 1).trim();

                            if(text.endsWith(';')) {
                                text = text.slice(0, -1).trim();
                            }
                        }
                    }

                    return {
                        file: `${path.basename(entry.name, extension)}${extension}`,
                        variable,
                        content: JSON.parse(text),
                    };
                });
        } finally {
            try {
                fs.rmSync(outputDirectory, { recursive: true, force: true });
            } catch(_) {
                // Ignore cleanup errors.
            }
        }
    }

    function acquireVectorMapNodeServer() {
        if(vectorMapNodeServer.killTimer) {
            clearTimeout(vectorMapNodeServer.killTimer);
            vectorMapNodeServer.killTimer = null;
        }

        if(!vectorMapNodeServer.process || vectorMapNodeServer.process.killed) {
            const scriptPath = path.join(testingRoot, 'helpers', 'vectormaputils-tester.js');

            vectorMapNodeServer.process = spawn(
                pathToNode,
                [scriptPath, `${vectorDataDirectory}${path.sep}`],
                {
                    stdio: 'ignore',
                },
            );

            vectorMapNodeServer.process.on('exit', () => {
                if(vectorMapNodeServer.process && vectorMapNodeServer.process.exitCode !== null) {
                    vectorMapNodeServer.process = null;
                }
            });
        }

        vectorMapNodeServer.refs += 1;
    }

    function releaseVectorMapNodeServer() {
        vectorMapNodeServer.refs -= 1;

        if(vectorMapNodeServer.refs <= 0) {
            vectorMapNodeServer.refs = 0;

            vectorMapNodeServer.killTimer = setTimeout(() => {
                if(vectorMapNodeServer.refs === 0 && vectorMapNodeServer.process) {
                    try {
                        vectorMapNodeServer.process.kill();
                    } catch(_) {
                        // Ignore process kill failures.
                    }
                    vectorMapNodeServer.process = null;
                }
                vectorMapNodeServer.killTimer = null;
            }, 200);
        }
    }

    return {
        executeVectorMapConsoleApp,
        readThemeCssFiles,
        readVectorMapTestData,
        redirectRequestToVectorMapNodeServer,
    };
}

function httpGetText(targetUrl) {
    return new Promise((resolve, reject) => {
        const request = http.get(targetUrl, (response) => {
            const chunks = [];

            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf8'));
            });
        });

        request.on('error', reject);
    });
}

function wait(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

module.exports = {
    createVectorMapService,
};
