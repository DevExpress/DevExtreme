const { updateJson, file, generateFiles, joinPathFragments } = require("@nx/devkit");

function addToModulesMetadata(tree, schema) {
  updateJson(
    tree,
    "packages/devextreme/build/gulp/modules_metadata.json",
    (json) => {
      return json.concat({
        name: `ui/${schema.name_snake}`,
        exports: {
          default: {
            path: `ui.dx${schema.name_pascal}`,
            isWidget: true
          },
        },
      });
    }
  );
}

function addToBundle(tree, schema) {
  
}

function createInternalFiles(tree, schema) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, './template/ts-folder'),
    'packages/devextreme/js/__internal',
    schema
  )
}

function createPublicFiles(tree, schema) {
  generateFiles(
    tree,
    joinPathFragments(__dirname, './template/js-folder'),
    'packages/devextreme/js/ui',
    schema
  )
}

function createTestcafe(tree, schema) {

}

function createTestcafeModel(tree, schema) {
  
}

function createScss(tree, schema) {

}


module.exports = async function (tree, schema) {
  createInternalFiles(tree, schema);
  createPublicFiles(tree, schema);
  createTestcafe(tree, schema);
  createTestcafeModel(tree, schema);
  createScss(tree, schema);
  addToModulesMetadata(tree, schema);
  addToBundle(tree, schema);

  // regenerate
};
