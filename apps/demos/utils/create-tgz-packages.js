const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const { rollup } = require('rollup');

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');

const execAsync = util.promisify(exec);
const outDir = './bundles/externals/';

async function buildAndPack(packageName, inputFile) {
  const packageJsonContent = fs.readFileSync(path.resolve(`./node_modules/${packageName}/package.json`), 'utf-8');
  const packageJSON = JSON.parse(packageJsonContent);
  const outPackageDir = `${outDir}${packageName}/`;
  const outputFile = `${outPackageDir}${packageName}.bundle.mjs`;

  fs.mkdirSync(outPackageDir, { recursive: true });

  const bundle = await rollup({
    input: inputFile,
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            targets: {
              chrome: '58',
              ie: '11',
            },
          }],
        ],
      }),
    ],
  });

  await bundle.write({
    file: outputFile,
    format: 'esm',
    name: packageName,
    globals: { },
  });

  const packageJson = {
    name: packageName,
    version: packageJSON.version,
    exports: `./${packageName}.bundle.mjs`,
    type: 'module',
    license: packageJSON.license,
  };

  fs.writeFileSync(
    path.join(outPackageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  const { stdout, stderr } = await execAsync('npm pack', { cwd: outPackageDir });
  const filename = `${packageName}-${packageJSON.version}.tgz`;

  if (stdout.trim('\n') === filename) {
    fs.renameSync(
      path.join(outPackageDir, filename),
      path.join(outDir, filename),
    );
    fs.rmSync(outPackageDir, { recursive: true, force: true });
  } else {
    console.error('stderr:\n', stderr);
  }
}

[
  {
    packageName: 'openai',
    inputFile: './node_modules/openai/index.mjs',
  },
].forEach(({ packageName, inputFile }) => {
  buildAndPack(packageName, inputFile).catch((err) => {
    console.error('Build failed:', err);
  });
});
