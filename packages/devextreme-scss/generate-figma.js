const variables = require('./variables.json');
const figmaMapping = {}

const themeToFigmaCollectionName = {
  generic: 'Generic (Colors)',
  material: 'Material (Colors)',
  fluent: 'Fluent (Colors)',
}

function setFigmaVarAlias(figmaName, scssName, collection) {
  console.log('setFigmaVarAlias', figmaName, scssName, collection)
  figmaMapping[collection] ??= {};
  figmaMapping[collection][figmaName] = scssName;
}

function getFigmaVarValue(figmaName, collectionName, modeNameMapping) {
  const modeName = modeNameMapping[collectionName];
  console.log('getFigmaVarValue', figmaName, collectionName, modeName);

  const collection = variables.collections.find(
    (collection) => collection.name === collectionName,
  );

  const mode = collection.modes.find(
    (mode) => mode.name === modeName,
  );

  const variable = mode.variables.find(
    (variable) => variable.name === figmaName
  )

  if (variable.isAlias) {
    if (figmaMapping?.[variable.value.collection]?.[variable.value.name] === undefined) {
      console.warn(`${variable.value.name} for ${variable.value.collection} is undefined`)
      return getFigmaVarValue(variable.value.name, variable.value.collection, modeNameMapping);
    }
    return figmaMapping[variable.value.collection][variable.value.name];
  } else {
    return variable.value;
  }
}

module.exports = {
  getFigmaVarValue,
  setFigmaVarAlias,
}

// function getComponentFigmaVarValue(figmaName, theme) {
//   return getFigmaVarValue(figmaName, 'Components', theme);
// }

// for (let theme of ['generic', 'material', 'fluent']) {
//   for (let [figmaName, scssName] of Object.entries(figmaMapping['Components'])) {
//     const value = getComponentFigmaVarValue(figmaName, theme);
//     console.log(scssName, value);
//   }
// }