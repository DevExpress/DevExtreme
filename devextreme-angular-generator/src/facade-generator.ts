import fs = require('fs');
import path = require('path');
import logger from './logger';

export default class FacadeGenerator {
    private _encoding = 'utf8';
    generate(config) {
        Object.keys(config.facades).forEach(facadeFilePath => {
            logger('Generate facade: ' + facadeFilePath);
            let facadeConfig = config.facades[facadeFilePath],
                resultContent = '';

            resultContent += `export * from 'devextreme-angular/core'\n`;
            resultContent += `export * from './ui/all'\n`;
            fs.readdirSync(facadeConfig.sourceDirectories[0])
                .filter(fileName => fs.lstatSync(path.join(facadeConfig.sourceDirectories[0], fileName)).isFile())
                .forEach(fileName => {
                    const { name } = path.parse(path.join(facadeConfig.sourceDirectories[0], fileName));
                    resultContent += `export * from 'devextreme-angular/ui/${name}'\n`;
                });

            logger('Write result to ' + facadeFilePath);
            fs.writeFileSync(facadeFilePath, resultContent, { encoding: this._encoding });
        });
    }
}
