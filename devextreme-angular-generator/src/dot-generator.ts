import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import logger from './logger';
let doT = require('dot');

doT.templateSettings = {
  evaluate:    /\<#([\s\S]+?)#\>/g,
  interpolate: /\<#=([\s\S]+?)#\>/g,
  encode:      /\<#!([\s\S]+?)#\>/g,
  use:         /\<##([\s\S]+?)#\>/g,
  define:      /\<###\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)##\>/g,
  conditional: /\<#\?(\?)?\s*([\s\S]*?)\s*#\>/g,
  iterate:     /\<#~\s*(?:#\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*#\>)/g,
  varname: 'it',
  strip: false,
  append: true,
  selfcontained: false
};

export function createTemplateFromString(templateString: string) {
    return doT.template(templateString);
}

export default class DoTGenerator {
    private _encoding = 'utf8';
    createTemplate(templateFilePath: string) {
        logger('Create doT template from ' + templateFilePath);
        let templateString = fs.readFileSync(templateFilePath, this._encoding);
        return createTemplateFromString(templateString);
    }
    generate(config) {
        this.generateTemplate(config.templateFilePath || path.join(__dirname, './templates/component.tst'),
            config.metadataFolderPath,
            config.outputFolderPath,
            true);

        this.generateTemplate(config.nestedTemplateFilePath || path.join(__dirname, './templates/nested-component.tst'),
            path.join(config.metadataFolderPath, config.nestedPathPart),
            path.join(config.outputFolderPath, config.nestedPathPart));

        this.generateTemplate(config.baseNestedTemplateFilePath || path.join(__dirname, './templates/base-nested-component.tst'),
            path.join(config.metadataFolderPath, config.nestedPathPart, config.basePathPart),
            path.join(config.outputFolderPath, config.nestedPathPart, config.basePathPart));

        this.createEntryPoint(config.outputFolderPath, 'nested');
    }

    private generateTemplate(
        templateFilePath: string,
        metadataFolderPath: string,
        outputFolderPath: string,
        isSecondaryEntryPoint = false
    ) {
        let template = this.createTemplate(templateFilePath);
        mkdirp.sync(outputFolderPath);

        logger('List directory: ' + metadataFolderPath);
        const names = [];
        fs.readdirSync(metadataFolderPath)
            .filter(fileName => fs.lstatSync(path.join(metadataFolderPath, fileName)).isFile())
            .forEach(fileName => {
                let filePath = path.join(metadataFolderPath, fileName);

                logger('Read data from ' + filePath);
                let data = fs.readFileSync(filePath, this._encoding);
                logger('Apply template');
                let result = template(JSON.parse(data));
                const widgetName = path.parse(filePath).name;
                names.push(widgetName);
                let resultFilePath;
                if (isSecondaryEntryPoint) {
                    fs.mkdirSync(path.join(outputFolderPath, widgetName));
                    resultFilePath = path.join(outputFolderPath, widgetName + '/index.ts');

                    this.createEntryPoint(outputFolderPath, widgetName);
                } else {
                    resultFilePath = path.join(outputFolderPath, widgetName + '.ts');
                }

                logger('Write result to ' + resultFilePath);
                fs.writeFileSync(resultFilePath, result, { encoding: this._encoding });
            });

        if (!isSecondaryEntryPoint) {
            fs.writeFileSync(
                outputFolderPath + '/index.ts',
                names.map(name => `export * from './${name}';\n`).join('') + '\n',
                { encoding: this._encoding }
            );
        }
    }

    private createEntryPoint(outputFolderPath: string, entryPoint: string) {
        fs.writeFileSync(path.join(outputFolderPath, entryPoint + '/package.json'),
            JSON.stringify({
                ngPackage: {
                    lib: {
                        entryFile: 'index.ts'
                    }
                }
            }, null, '  '), { encoding: this._encoding });
    }
}
