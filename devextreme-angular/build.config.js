module.exports = {
    tools: {
        metadataGenerator: {
            importFrom: 'devextreme-angular-generator/dist/metadata-generator',
            sourceMetadataFilePath: './metadata/NGMetaData.json',
            deprecatedMetadataFilePath: './metadata/DeprecatedComponentsMetadata.json',
            outputFolderPath: './metadata/generated',
            nestedPathPart: 'nested',
            basePathPart: 'base',
            widgetPackageName: "devextreme",
            wrapperPackageName: 'devextreme-angular'
        },
        componentGenerator: {
            importFrom: 'devextreme-angular-generator/dist/dot-generator',
            metadataFolderPath: './metadata/generated/',
            outputFolderPath: './src/ui/',
            nestedPathPart: 'nested',
            basePathPart: 'base'
        },
        facadeGenerator: {
            importFrom: 'devextreme-angular-generator/dist/facade-generator',
            facades: {
                './src/index.ts': {
                    sourceDirectories: [
                        './metadata/generated'
                    ]
                }
            }
        },
        moduleFacadeGenerator: {
            importFrom: 'devextreme-angular-generator/dist/module.facade-generator',
            moduleFacades: {
                './src/ui/all.ts': {
                    sourceComponentDirectories: [
                        './src/ui'
                    ],
                    additionalImports: {
                        'DxTemplateModule': 'import { DxTemplateModule } from \'devextreme-angular/core\''
                    }
                }
            }
        },
        componentNamesGenerator: {
            importFrom: 'devextreme-angular-generator/dist/component-names-generator',
            componentFilesPath: './src/ui/',
            excludedFileNames: [
                'nested',
                'validation-group',
                'validation-summary',
                'validator',
                'button-group',
                'drop-down-button',
                'file-manager' ],
            outputFileName: 'tests/src/server/component-names.ts'
        },
        commonReexportsGenerator: {
            importFrom: 'devextreme-angular-generator/dist/common-reexports-generator',
            metadataPath: './metadata/NGMetaData.json',
            outputPath: './src/'
        },

    },
    components: {
        srcFilesPattern: '**/*.ts',
        tsTestSrc: ['tests/src/**/*.spec.ts', 'tests/src/**/component-names.ts'],
        testsPath: 'tests/dist',
        sourcesGlobs: ['src/**/*.*', './package.json'],
        tsSourcesGlob: 'src/**/*.ts',
        outputPath: 'dist'
    },
    tests: {
        tsConfigPath: "tsconfig.json"
    },
    npm: {
        distPath: "npm/dist",
        content: [ "../../LICENSE", "../../README.md" ]
    }
};
