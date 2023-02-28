import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { createTemplateFromString } from './dot-generator';

const render: (model: { module: string, reexports: string[] }) => string = createTemplateFromString(`
export {<#~ it.reexports :reExport #>
    <#= reExport #>,<#~#>
} from "devextreme/<#= it.module #>";
`.trimLeft());

export default class CommonReexportsGenerator {
  generate(config) {
    let metadata = JSON.parse(readFileSync(config.metadataPath).toString());

    if (!metadata.CommonReexports) {
      return;
    }

    const commonPath = joinPaths(config.outputPath, 'common');
    if (!existsSync(commonPath)) {
      mkdirSync(commonPath);
    }
    Object.keys(metadata.CommonReexports).forEach((key) => {
      writeFileSync(
        joinPaths(commonPath, `${key.replace('common/', '')}.ts`),
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
