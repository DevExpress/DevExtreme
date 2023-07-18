function getReadmeNote(framework) {
    return `# NOT FOR PRODUCTION USE

This package contains a preview subset of components. We do not recommend deploying this package to a production environment because this may cause unexpected application behavior.

Please use the [devextreme-${framework}](https://www.npmjs.com/package/devextreme-${framework}) package for production.

`
}

module.exports = {
    getReadmeNote: getReadmeNote,
}
