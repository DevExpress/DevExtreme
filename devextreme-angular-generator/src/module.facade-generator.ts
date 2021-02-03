import fs = require('fs');
import path = require('path');
import logger from './logger';
let inflector = require('inflector-js');

export default class FacadeGenerator {
    private _encoding = 'utf8';

    prepareModuleName(fileName: string) {
        fileName = fileName.replace(/-/g, '_');
        fileName = inflector.camelize(fileName);
        fileName = 'Dx' + fileName + 'Module';

        return fileName;
    }

    generate(config) {
        Object.keys(config.moduleFacades).forEach(moduleFilePath => {
            logger('Generate facade: ' + moduleFilePath);
            let facadeConfig = config.moduleFacades[moduleFilePath],
                moduleNamesString = '',
                importModuleString = '';

            facadeConfig.sourceComponentDirectories.forEach(directoryPath => {
                logger('List directory: ' + directoryPath);
                let files = fs.readdirSync(directoryPath);

                files
                    .filter(fileName => !fs.lstatSync(path.join(directoryPath, fileName)).isFile() && fileName !== 'nested')
                    .forEach(fileName => {
                        let moduleName = this.prepareModuleName(fileName);

                        moduleNamesString += `\n    ${moduleName},`;
                        importModuleString += `import { ${moduleName} } from 'devextreme-angular/ui/${fileName}';\n`;
                    });
            });

            Object.keys(facadeConfig.additionalImports).forEach(importName => {
                moduleNamesString += '\n    ' + importName + ',';
                importModuleString += facadeConfig.additionalImports[importName] + ';\n';
            });

            moduleNamesString = moduleNamesString.slice(0, -1);
            importModuleString = importModuleString.slice(0, -1);

            let resultContent = `import { NgModule } from '@angular/core';
` + importModuleString + `

@NgModule({
    imports: [` + moduleNamesString + `\n    ],
    exports: [` + moduleNamesString + `\n    ]
})
export class DevExtremeModule {}
`;

            logger('Write result to ' + moduleFilePath);
            fs.writeFileSync(moduleFilePath, resultContent, { encoding: this._encoding });
        });
    }
}
