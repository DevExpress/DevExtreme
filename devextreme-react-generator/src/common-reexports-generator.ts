import { createTempate } from './template';

const render: (model: { module: string, reexports: string[] }) => string = createTempate(`
export {<#~ it.reexports :reExport #>
    <#= reExport #>,<#~#>
} from "devextreme/<#= it.module #>";
`.trimStart());

function generate(module: string, reexports: string[]): string {
  const result = render({ module, reexports });
  return result;
}

export default generate;
