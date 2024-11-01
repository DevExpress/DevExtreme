module.exports = {
    tools: {
        metadataGenerator: {
            sourceMetadataFilePath: './metadata/NGMetaData.json',
            imdMetadataFilePath: './metadata/integration-data.json',
            outputFolderPath: './metadata/generated',
            nestedPathPart: 'nested',
            basePathPart: 'base',
            widgetPackageName: "devextreme",
            wrapperPackageName: 'devextreme-angular',
            generateReexports: true,
        },
        componentGenerator: {
            metadataFolderPath: './metadata/generated/',
            outputFolderPath: './src/ui/',
            nestedPathPart: 'nested',
            basePathPart: 'base'
        },
        facadeGenerator: {
            facades: {
                './src/index.ts': {
                    sourceDirectories: [
                        './metadata/generated'
                    ]
                }
            },
            commonImports: [
                './common',
                './common/grids',
                './common/charts',
            ]
        },
        moduleFacadeGenerator: {
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
            imdMetadataFilePath: './metadata/integration-data.json',
            outputPath: './src/'
        },
    },
    afterGenerate: {
        preserveComponentFiles: ['popup/service', 'popup/index.ts'],
        renameGeneratedFiles: [{ path: 'popup/index.ts', newName: 'component.ts' }],
        temporaryFolderForPreserved: './tmp-preserved/'
    },
    components: {
        srcFilesPattern: '**/*.ts',
        tsTestSrc: ['tests/src/**/*.spec.ts', 'tests/src/**/component-names.ts'],
        testsPath: 'tests/dist',
        sourcesGlobs: ['src/**/*.*', './package.json', './ng-package.json'],
        tsSourcesGlob: 'src/**/*.ts',
        outputPath: 'dist'
    },
    tests: {
        tsConfigPath: "tsconfig.tests.json"
    },
    npm: {
        distPath: "npm/dist",
        content: [ "./LICENSE", "./README.md" ]
    }
};
