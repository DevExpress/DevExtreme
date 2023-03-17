import fs = require('fs');
import path = require('path');
import logger from './logger';
import inflector = require('inflector-js');

export default class FacadeGenerator {
    private _encoding = 'utf8';
    generate(config) {
        Object.keys(config.facades).forEach(facadeFilePath => {
            logger('Generate facade: ' + facadeFilePath);
            let facadeConfig = config.facades[facadeFilePath],
                resultContent = '';

            resultContent += `export * from 'devextreme-angular/core';\n`;
            resultContent += `export * from './ui/all';\n`;

            config.commonImports.forEach(i => {
                resultContent += `import '${i}';\n`;
            });

            fs.readdirSync(facadeConfig.sourceDirectories[0])
                .filter(fileName => fs.lstatSync(path.join(facadeConfig.sourceDirectories[0], fileName)).isFile())
                .forEach(fileName => {
                    const { name } = path.parse(path.join(facadeConfig.sourceDirectories[0], fileName));
                    const formattedName = formatName(name);
                    const where = `'devextreme-angular/ui/${name}'`;
                    resultContent += `export { Dx${formattedName}Component, Dx${formattedName}Module } from ${where};\n`;
                });

            logger('Write result to ' + facadeFilePath);
            fs.writeFileSync(facadeFilePath, resultContent, { encoding: this._encoding });
        });
    }
}


function formatName(name: string): string {
    if (!name.includes('-')) {
        return inflector.camelize(name);
    }
    return name.split('-').map((n) => inflector.camelize(n)).join('');
}
