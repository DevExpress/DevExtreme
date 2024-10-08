const { getProjects } = require("@nx/devkit");

function updatePackageJsons(tree, schema) {

}

function updateVersionJS(tree, schema) {
  const {version, build} = schema;
  const fullVersion = build ? `${version}.${build}` : validatedVersion;
  
  const content =
    `export const version = '${version}';\n` +
    `export const fullVersion = '${fullVersion}';\n`

  tree.write('packages/devextreme/js/core/version.js', content);
}

module.exports = async function (tree, schema) {
  updatePackageJsons();
  updateVersionJS();
};

