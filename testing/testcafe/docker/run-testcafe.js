const { spawnSync } = require('child_process');
const parseArgs = require('minimist');

const matrix = [
    { componentFolder: 'treeList', name: 'treeList', concurrency: 1 },
    { componentFolder: 'dataGrid', name: 'dataGrid (1/2)', indices: '1/2' },
    { componentFolder: 'dataGrid', name: 'dataGrid (2/2)', indices: '2/2' },
    { componentFolder: 'scheduler', name: 'scheduler (1/5)', indices: '1/5' },
    { componentFolder: 'scheduler', name: 'scheduler (2/5)', indices: '2/5' },
    { componentFolder: 'scheduler', name: 'scheduler (3/5)', indices: '3/5' },
    { componentFolder: 'scheduler', name: 'scheduler (4/5)', indices: '4/5' },
    { componentFolder: 'scheduler', name: 'scheduler (5/5)', indices: '5/5' },
    { componentFolder: 'form', name: 'form' },
    { componentFolder: 'form', name: 'form - material', theme: 'material.blue.light' },
    { componentFolder: 'editors', name: 'editors' },
    { componentFolder: 'editors', name: 'editors - material', theme: 'material.blue.light' },
    { componentFolder: 'navigation', name: 'navigation' },
    { componentFolder: 'navigation', name: 'navigation - material', theme: 'material.blue.light' },
    { componentFolder: 'pivotGrid', name: 'pivotGrid', concurrency: 1 },
    { componentFolder: 'pivotGrid', name: 'pivotGrid - material', theme: 'material.blue.light', concurrency: 1 },
    { componentFolder: 'htmlEditor', name: 'htmlEditor', concurrency: 1 },
    { componentFolder: 'htmlEditor', name: 'htmlEditor - material', theme: 'material.blue.light', concurrency: 1 },
    { componentFolder: 'renovation', name: 'renovation (jquery)', platform: 'jquery' },
    { componentFolder: 'renovation', name: 'renovation (react)', platform: 'react' },
];

(async() => {
    // eslint-disable-next-line no-undef
    const parsedArgs = parseArgs(process.argv);
    const componentFolderName = parsedArgs.componentFolder;
    let testParts = matrix;

    if(componentFolderName != null) {
        testParts = testParts.filter(({ componentFolder }) => componentFolder === componentFolderName);
    }

    if(testParts.length === 0) {
        const variants = [...new Set(matrix.map(({ componentFolder }) => componentFolder))];
        throw new Error(`componentFolder "${componentFolderName}" was not found. Use one of next variants: ${variants}`);
    }

    // eslint-disable-next-line no-restricted-syntax
    for(const { name, ...args } of testParts) {
        // eslint-disable-next-line no-console,no-undef
        console.log(`Started test: ${name}`);

        const startupParams = Object.entries(args).map(([key, value]) => `--${key}=${value}`);

        spawnSync('npm', ['run', 'test-testcafe', '--', '--browsers=chrome:docker', ...startupParams], {
            shell: true,
            stdio: 'inherit'
        });
    }
})();
