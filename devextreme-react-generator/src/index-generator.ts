import { createTemplate } from './template';

interface IReExport {
  name: string;
  path: string;
}

const constParts = `export { Template } from "./core/template";
`;

const render: (model: IReExport[]) => string = createTemplate(`
<#~ it :reExport #>export { <#= reExport.name #> } from "<#= reExport.path #>";
<#~#>
`.trim());

function generate(paths: IReExport[]): string {
  return constParts.concat(render(paths));
}

export default generate;
export {
  IReExport,
};
