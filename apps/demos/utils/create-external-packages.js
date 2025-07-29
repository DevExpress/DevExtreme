const fs = require('fs');
const path = require('path');
const { exec} = require('child_process');
const util = require('util');
const { rollup } = require('rollup');

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');

const openaiPackageJsonContent = fs.readFileSync(path.resolve('./node_modules/openai/package.json'), 'utf-8');
const openaiPackageJSON = JSON.parse(openaiPackageJsonContent);

const execAsync = util.promisify(exec);

async function buildAndPack() {
    const outDir = './bundles/externals/';
    const outPackageDir = outDir + 'openai/';
    const inputFile = './node_modules/openai/index.mjs';
    const outputFile = outPackageDir +'openai.bundle.mjs';

    fs.mkdirSync(outPackageDir, { recursive: true });
    
    const bundle = await rollup({
        input: inputFile,
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                presets: [
                    ['@babel/preset-env', { targets: {
                            chrome: '58',
                            ie: '11'
                        } }]
                ],
            })
        ]
    });

    await bundle.write({
        file: outputFile,
        format: 'esm',
        name: 'openai',
        globals: { },
    });

    const packageJson = {
        name: 'openai',
        version: openaiPackageJSON.version,
        exports: './openai.bundle.mjs',
        type: 'module',
        license: openaiPackageJSON.license
    };

    await fs.writeFileSync(
      path.join(outPackageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

   const { stdout,  stderr } = await execAsync('npm pack', { cwd: outPackageDir });
   const filename = `openai-${openaiPackageJSON.version}.tgz`;
   
    if (stdout.trim('\n') === filename) {
        
        fs.renameSync(
          path.join(outPackageDir, filename),
          path.join(outDir, filename)
        );
        fs.rmSync(outPackageDir, { recursive: true, force: true });
    } else {
        console.error('stderr:\n', stderr);
    }
}

buildAndPack().catch(err => {
    console.error('Build failed:', err);
});
