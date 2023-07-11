import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join as joinPaths, dirname as getDirName } from 'path';
import { createTemplateFromString } from './dot-generator';

const render: (model: { module: string, reexports: string[] }) => string = createTemplateFromString(`
export {<#~ it.reexports :reExport #>
    <#= reExport #>,<#~#>
} from 'devextreme/<#= it.module #>';
`.trimLeft());

export default class CommonReexportsGenerator {
  generate(config) {
    let metadata = JSON.parse(readFileSync(config.metadataPath).toString());

    if (!metadata.CommonReexports) {
      return;
    }

    const commonTargetFolderName = 'common';
    const commonPath = joinPaths(config.outputPath, commonTargetFolderName);
    if (!existsSync(commonPath)) {
      mkdirSync(commonPath);
    }
    Object.keys(metadata.CommonReexports).forEach((key) => {
      const targetFileName = key === commonTargetFolderName ? 'index.ts' : `${key.replace(`${commonTargetFolderName}/`, '')}.ts`;
      const fullPath = joinPaths(commonPath, targetFileName);
      mkdirSync(getDirName(fullPath), { recursive: true });
      writeFileSync(
        fullPath,
        this.generateReexports(key, metadata.CommonReexports[key]),
        { encoding: 'utf8' },
      );
    });
  }
  private generateReexports(module: string, reexports: string[]): string {
    const result = render({ module, reexports });
    return result;
  }
}
