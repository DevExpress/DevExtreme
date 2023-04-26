import { createTemplate } from './template';

const render: (model: { module: string, reexports: string[] }) => string = createTemplate(`
export {<#~ it.reexports :reExport #>
    <#= reExport #>,<#~#>
} from "devextreme/<#= it.module #>";
`.trimStart());

function generate(module: string, reexports: string[]): string {
  const result = render({ module, reexports });
  return result;
}

export default generate;
