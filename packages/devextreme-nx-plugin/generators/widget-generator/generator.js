const { updateJson } = require("@nx/devkit");

module.exports = async function (tree, schema) {
  const { name } = schema;
  updateJson(
    tree,
    "packages/devextreme/build/gulp/modules_metadata.json",
    (json) => {
      return json.concat({
        name: `ui/${name}`,
        exports: {
          default: { path: `ui.dx${name.charAt(0).toUpperCase() + name.slice(1)}`, isWidget: true },
        },
      });
    }
  );
};
