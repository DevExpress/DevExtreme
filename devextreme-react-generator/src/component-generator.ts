import {
  createTemplate, L1, L2, L3,
} from './template';

import {
  createKeyComparator,
  isNotEmptyArray,
  lowercaseFirst,
  uppercaseFirst,
} from './helpers';

type IComponent = {
  name: string;
  baseComponentPath: string;
  extensionComponentPath: string;
  dxExportPath: string;
  expectedChildren?: IExpectedChild[];
  isExtension?: boolean;
  subscribableOptions?: ISubscribableOption[];
  independentEvents?: IIndependentEvents[],
  templates?: string[];
  propTypings?: IPropTyping[];
  optionsTypeParams?: string[];
} & {
  nestedComponents?: INestedComponent[];
  configComponentPath?: string;
  containsReexports?: boolean
};

interface INestedComponent {
  className: string;
  optionName: string;
  owners: string[];
  options: IOption[];
  templates?: string[];
  expectedChildren?: IExpectedChild[];
  predefinedProps?: Record<string, string>;
  isCollectionItem?: boolean;
}

interface ISubscribableOption {
  name: string;
  type: string;
  isSubscribable?: true;
}

interface IIndependentEvents {
  name: string;
}

type IOption = {
  name: string;
  isSubscribable?: true;
  isArray?: boolean;
  type?: any
} & ({
  type: string;
  nested?: undefined;
} | {
  type?: undefined;
  nested: IOption[];
});

interface IPropTyping {
  propName: string;
  types: string[];
  acceptableType?: string;
  acceptableValues?: string[];
}

interface IExpectedChild {
  componentName: string;
  optionName: string;
  isCollectionItem?: boolean;
}

interface IRenderedPropTyping {
  propName: string;
  renderedTypes: string[];
}

const TYPE_KEY_FN = '(data: any) => string';
const TYPE_RENDER = '(...params: any) => React.ReactNode';
const TYPE_COMPONENT = 'React.ComponentType<any>';
const PORTAL_COMPONENTS: Set<string> = new Set([
  'dxLoadPanel',
  'dxOverlay',
  'dxPopover',
  'dxPopup',
  'dxToast',
  'dxTooltip',
  'dxValidationMessage',
]);

// TODO: remove it as soon widgets support requestAnimationFrame
const USE_REQUEST_ANIMATION_FRAME: Set<string> = new Set([
  'dxChart',
  'dxDateBox',
  'dxDataGrid',
  'dxFilterBuilder',
]);

function getIndent(indent: number) {
  return Array(indent * 2 + 1).join(' ');
}

const renderObjectEntry: (model: {
  key: string;
  value: string;
}) => string = createTemplate(`
    <#= it.key #>: "<#= it.value #>"
`.trimRight());

function renderObject(props: IOption[], indent: number): string {
  let result = '{';

  indent += 1;

  props.forEach((opt) => {
    result += `\n${getIndent(indent)}${opt.name}?: `;
    if (opt.nested && isNotEmptyArray(opt.nested)) {
      const type = opt.type ? `${opt.type} | ` : '';
      result += `${type}${renderObject(opt.nested, indent)}`;
      if (opt.isArray) { result += '[]'; }
    } else {
      result += opt.type;
    }
    result += ';';
  });

  indent -= 1;
  result += `\n${getIndent(indent)}}`;
  return result;
}

const renderTemplateOption: (model: {
  actualOptionName: string;
  render: string;
  component: string;
}) => string = createTemplate(`
  {
    tmplOption: "<#= it.actualOptionName #>",
    render: "<#= it.render #>",
    component: "<#= it.component #>",
    keyFn: "<#= it.keyFn #>"
  }
`.trim());

const renderStringEntry: (value: string) => string = createTemplate('"<#= it #>"');

const renderPropTyping: (model: IRenderedPropTyping) => string = createTemplate(
  '  <#= it.propName #>: '

+ '<#? it.renderedTypes.length === 1 #>'
    + '<#= it.renderedTypes[0] #>'

+ '<#??#>'

    + 'PropTypes.oneOfType([\n'
    + '    <#= it.renderedTypes.join(\',\\n    \') #>\n'
    + '  ])'
+ '<#?#>',
);

const renderModule: (model: {
  renderedImports: string;
  renderedOptionsInterface?: string;
  renderedComponent: string;
  renderedNestedComponents?: string[];
  defaultExport: string;
  renderedExports: string;
  renderedReExports?: string;
}) => string = createTemplate(
  '<#= it.renderedImports #>\n'

+ '<#? it.renderedOptionsInterface #>'
    + '<#= it.renderedOptionsInterface #>\n\n'
+ '<#?#>'

+ '<#= it.renderedComponent #>'

+ '<#? it.renderedNestedComponents #>'
    + '<#~ it.renderedNestedComponents :nestedComponent #>\n\n'
        + '<#= nestedComponent #>'
    + '<#~#>\n\n'
+ '<#?#>'

+ 'export default <#= it.defaultExport #>;\n'
+ `export {
<#= it.renderedExports #>
};
`
+ '<#? it.renderedReExports #>'
    + '<#= it.renderedReExports #>\n\n'
+ '<#?#>',
);

const renderImports: (model: {
  dxExportPath: string;
  baseComponentPath: string;
  baseComponentName: string;
  widgetName: string;
  optionsAliasName?: string;
  hasExtraOptions: boolean;
  hasPropTypings: boolean;
  hasExplicitTypes: boolean;
  configComponentPath?: string;
  customTypeImports?: Record<string, Array<string>>;
  defaultTypeImports?: Record<string, string>;
  wildcardTypeImports?: Record<string, string>;
}) => string = createTemplate(
  '<#? it.hasExplicitTypes #>'
    + 'export { ExplicitTypes } from "<#= it.dxExportPath #>";\n'
+ '<#?#>'

+ 'import <#= it.widgetName #>, {\n'
+ '    Properties<#? it.optionsAliasName #> as <#= it.optionsAliasName #><#?#>\n'
+ '} from "<#= it.dxExportPath #>";\n\n'

+ '<#? it.hasPropTypings #>'
    + 'import * as PropTypes from "prop-types";\n'
+ '<#?#>'

+ 'import { <#= it.baseComponentName #> as BaseComponent'
    + '<#? it.hasExtraOptions #>'
        + ', IHtmlOptions'
    + '<#?#>'
+ ' } from "<#= it.baseComponentPath #>";\n'

+ '<#? it.configComponentPath #>'
    + 'import NestedOption from "<#= it.configComponentPath #>";\n'
+ '<#?#>'

+ '<#? it.customTypeImports && Object.keys(it.customTypeImports).length #>\n'
  + '<#~ Object.keys(it.customTypeImports) : module #>'
  + 'import type { <#= it.customTypeImports[module].join(", ")#> } from "<#= module #>";\n'
  + '<#~#>'
+ '<#?#>'

+ '<#? it.defaultTypeImports && Object.keys(it.defaultTypeImports).length #>\n'
  + '<#~ Object.keys(it.defaultTypeImports) : defaultImport #>'
    + '<#? defaultImport !== it.widgetName #>'
      + 'import type <#= defaultImport #> from "<#= it.defaultTypeImports[defaultImport] #>";\n'
    + '<#?#>'
  + '<#~#>'
+ '<#?#>'

+ '<#? it.wildcardTypeImports && Object.keys(it.wildcardTypeImports).length #>\n'
  + '<#~ Object.keys(it.wildcardTypeImports) : wildcardImportModule #>'
    + 'import type * as <#= it.wildcardTypeImports[wildcardImportModule] #> from "<#= wildcardImportModule #>";\n'
  + '<#~#>'
+ '<#?#>',
);

const renderNestedComponent: (model: {
  className: string;
  propsType: string;
  optionName: string;
  isCollectionItem?: boolean;
  predefinedProps?: Array<{
    name: string;
    value: any;
  }>;
  expectedChildren?: IExpectedChild[];
  renderedType: string;
  renderedSubscribableOptions?: string[];
  renderedTemplateProps?: string[];
  owners: string[];
}) => string = createTemplate(
  `${'// owners:\n'
+ '<#~ it.owners : owner #>'
    + '// <#= owner #>\n'
+ '<#~#>'

+ 'type <#= it.propsType #> = React.PropsWithChildren<<#= it.renderedType #>>\n'

+ 'class <#= it.className #> extends NestedOption<<#= it.propsType #>> {'}${
    L1}public static OptionName = "<#= it.optionName #>";`

+ `<#? it.isCollectionItem #>${
  L1}public static IsCollectionItem = true;`
+ '<#?#>'

+ `<#? it.renderedSubscribableOptions #>${
  L1}public static DefaultsProps = {<#= it.renderedSubscribableOptions.join(',') #>${
  L1}};`
+ '<#?#>'

+ `<#? it.expectedChildren #>${
  L1}public static ExpectedChildren = {`

    + `<#~ it.expectedChildren : child #>${
      L2}<#= child.componentName #>:`
        + ' { optionName: "<#= child.optionName #>", isCollectionItem: <#= !!child.isCollectionItem #> },'
    + `<#~#>\b${

      L1}};`
+ '<#?#>'

+ `<#? it.renderedTemplateProps #>${
  L1}public static TemplateProps = [<#= it.renderedTemplateProps.join(', ') #>];`
+ '<#?#>'

+ `<#? it.predefinedProps #>${
  L1}public static PredefinedProps = {`
        + `<#~ it.predefinedProps : prop #>${
          L2}<#= prop.name #>: "<#= prop.value #>",`
        + `<#~#>\b${
          L1}};`
+ '<#?#>'

+ '\n}',
);

const TYPE_PARAMS = '<#? it.typeParams #>'
    + '<<#= it.typeParams.join(", ") #>>'
+ '<#?#>';

const TYPE_PARAMS_WITH_DEFAULTS = '<#? it.typeParams #>'
    // eslint-disable-next-line no-template-curly-in-string
    + '<<#= it.typeParams.map(p => `${p} = any`).join(", ") #>>'
+ '<#?#>';

const renderOptionsInterface: (model: {
  optionsName: string;
  typeParams: string[] | undefined;
  templates: Array<{
    render: string;
    component: string;
  }>;
  defaultProps: Array<{
    name: string;
    type: string;
  }>;
  onChangeEvents: Array<{
    name: string;
    type: string;
  }>;
}) => string = createTemplate(
  `type <#= it.optionsName #>${TYPE_PARAMS_WITH_DEFAULTS} = React.PropsWithChildren<Properties${TYPE_PARAMS} & IHtmlOptions & {\n`

+ '<#? it.typeParams #>'
    + `  dataSource?: Properties${TYPE_PARAMS}["dataSource"];\n`
+ '<#?#>'

+ '<#~ it.templates :template #>'
    + `  <#= template.render #>?: ${TYPE_RENDER};\n`
    + `  <#= template.component #>?: ${TYPE_COMPONENT};\n`
    + `  <#= template.keyFn #>?: ${TYPE_KEY_FN};\n`
+ '<#~#>'

+ '<#~ it.defaultProps :prop #>'
    + '  <#= prop.name #>?: <#= prop.type #>;\n'
+ '<#~#>'

+ '<#~ it.onChangeEvents :prop #>'
    + '  <#= prop.name #>?: <#= prop.type #>;\n'
+ '<#~#>'

+ '}>',
);

const renderComponent: (model: {
  className: string;
  widgetName: string;
  optionsName: string;
  subscribableOptions?: string[];
  independentEvents?: string[];
  expectedChildren?: IExpectedChild[];
  renderedDefaultProps?: string[];
  renderedTemplateProps?: string[];
  renderedPropTypings?: string[];
  isPortalComponent?: boolean;
  useRequestAnimationFrameFlag?: boolean;
  typeParams: string[] | undefined;
}) => string = createTemplate(
  `class <#= it.className #>${TYPE_PARAMS_WITH_DEFAULTS} extends BaseComponent<React.PropsWithChildren<<#= it.optionsName #>${TYPE_PARAMS}>> {

  public get instance(): <#= it.widgetName #>${TYPE_PARAMS} {
    return this._instance;
  }

  protected _WidgetClass = <#= it.widgetName #>;\n`

+ `<#? it.useRequestAnimationFrameFlag #>${
  L1}protected useRequestAnimationFrameFlag = true;\n`
+ '<#?#>'

+ `<#? it.isPortalComponent #>${
  L1}protected isPortalComponent = true;\n`
+ '<#?#>'

+ `<#? it.subscribableOptions #>${
  L1}protected subscribableOptions = [<#= it.subscribableOptions.join(',') #>];\n`
+ '<#?#>'

+ `<#? it.independentEvents #>${
  L1}protected independentEvents = [<#= it.independentEvents.join(',') #>];\n`
+ '<#?#>'

+ `<#? it.renderedDefaultProps #>${
  L1}protected _defaults = {<#= it.renderedDefaultProps.join(',') #>${
  L1}};\n`
+ '<#?#>'

+ `<#? it.expectedChildren #>${
  L1}protected _expectedChildren = {`

+ `<#~ it.expectedChildren : child #>${
  L2}<#= child.componentName #>:`
    + ' { optionName: "<#= child.optionName #>", isCollectionItem: <#= !!child.isCollectionItem #> },'
+ `<#~#>\b${

  L1}};\n`
+ '<#?#>'

+ `<#? it.renderedTemplateProps #>
  protected _templateProps = [<#= it.renderedTemplateProps.join(', ') #>];
<#?#>}\n`

+ '<#? it.renderedPropTypings #>'
    + '(<#= it.className #> as any).propTypes = {\n'
        + '<#= it.renderedPropTypings.join(\',\\n\') #>\n'
    + '};\n'
+ '<#?#>',
);

function renderExports(exportsNames: string[]) {
  return exportsNames
    .map((exportName) => getIndent(1) + exportName)
    .join(',\n');
}

function renderReExports(componentName: string, exportPath: string) {
  return `import type * as ${componentName}Types from '${exportPath}_types';\n`
  + `export { ${componentName}Types };`;
}

function formatTemplatePropName(name: string, suffix: string): string {
  return lowercaseFirst(name.replace(/template$/i, suffix));
}

function createTemplateDto(templates: string[] | undefined) {
  return templates
    ? templates.map((actualOptionName) => ({
      actualOptionName,
      render: formatTemplatePropName(actualOptionName, 'Render'),
      component: formatTemplatePropName(actualOptionName, 'Component'),
      keyFn: formatTemplatePropName(actualOptionName, 'KeyFn'),
    }))
    : undefined;
}

function buildPropsTypeName(className: string) {
  return `I${className}Props`;
}

function acceptableTypes(acceptableType: string | undefined, acceptableValues: string[]): string {
  const indent = acceptableType ? L3 : L2;
  const acceptableTemplate = `PropTypes.oneOf([${indent}${acceptableValues.join(`,${indent}`)}])`;
  return acceptableType ? `PropTypes.oneOfType([
    PropTypes.${acceptableType},
    ${acceptableTemplate}
  ])` : acceptableTemplate;
}

function createPropTypingModel(typing: IPropTyping): IRenderedPropTyping {
  const types = typing.types.map((t) => `PropTypes.${t}`);
  if (typing.acceptableValues && isNotEmptyArray(typing.acceptableValues)) {
    types.push(acceptableTypes(typing.acceptableType, typing.acceptableValues));
  }
  return {
    propName: typing.propName,
    renderedTypes: types,
  };
}

function generate(
  component: IComponent,
  generateReexports = false,
  customTypeImports?: Record<string, Array<string>>,
  defaultTypeImports?: Record<string, string>,
  wildcardTypeImports?: Record<string, string>,
): string {
  const nestedComponents = component.nestedComponents
    ? component.nestedComponents
      .sort(createKeyComparator<INestedComponent>((o) => o.className))
      .map((c) => {
        const options = [...c.options];
        const nestedSubscribableOptions = options.filter((o) => o.isSubscribable);
        let renderedSubscribableOptions: string[] | undefined;
        if (isNotEmptyArray(nestedSubscribableOptions)) {
          nestedSubscribableOptions.forEach((o) => {
            options.push({
              ...o,
              name: `default${uppercaseFirst(o.name)}`,
            }, {
              name: `on${uppercaseFirst(o.name)}Change`,
              type: `(value: ${o.type}) => void`,
            });
          });

          renderedSubscribableOptions = nestedSubscribableOptions.map((o) => renderObjectEntry({
            key: `default${uppercaseFirst(o.name)}`,
            value: o.name,
          }));
        }
        const nestedTemplates = createTemplateDto(c.templates);
        if (nestedTemplates) {
          nestedTemplates.forEach((t) => {
            options.push({
              name: t.render,
              type: TYPE_RENDER,
            }, {
              name: t.component,
              type: TYPE_COMPONENT,
            }, {
              name: t.keyFn,
              type: TYPE_KEY_FN,
            });
          });
        }

        let predefinedProps: Array<{ name: string; value: string }> | undefined;
        if (c.predefinedProps) {
          predefinedProps = [];
          if (c.predefinedProps) {
            predefinedProps = [];
            Object.entries(c.predefinedProps).forEach((prop) => {
              const [name, value] = prop;
              predefinedProps?.push({ name, value });
            });
          }
        }

        return {
          className: c.className,
          propsType: buildPropsTypeName(c.className),
          optionName: c.optionName,
          ownerName: c.owners,
          renderedType: renderObject(options, 0),
          renderedSubscribableOptions,
          renderedTemplateProps: nestedTemplates && nestedTemplates.map(renderTemplateOption),
          isCollectionItem: c.isCollectionItem,
          predefinedProps,
          expectedChildren: c.expectedChildren,
          owners: c.owners,
        };
      })
    : undefined;

  const optionsName = `I${component.name}Options`;
  const exportNames: string[] = [
    component.name,
    optionsName,
  ];

  if (component.nestedComponents && isNotEmptyArray(component.nestedComponents)) {
    component.nestedComponents.forEach((c) => {
      exportNames.push(c.className);
      exportNames.push(buildPropsTypeName(c.className));
    });
  }

  const templates = createTemplateDto(component.templates);
  const firstLevelSubscribableOptions = component.subscribableOptions
    ?.filter(({ name }) => !name.includes('.'));
  const defaultProps = firstLevelSubscribableOptions
    ? firstLevelSubscribableOptions.map((o) => ({
      name: `default${uppercaseFirst(o.name)}`,
      type: o.type,
      actualOptionName: o.name,
    }))
    : undefined;
  const onChangeEvents = firstLevelSubscribableOptions
    ? firstLevelSubscribableOptions.map((o) => ({
      name: `on${uppercaseFirst(o.name)}Change`,
      type: `(value: ${o.type}) => void`,
      actualOptionName: o.name,
    }))
    : undefined;

  const hasExtraOptions = !component.isExtension;
  const widgetName = `dx${uppercaseFirst(component.name)}`;

  const renderedPropTypings = component.propTypings
    ? component.propTypings
      .sort(createKeyComparator<IPropTyping>((p) => p.propName))
      .map((t) => renderPropTyping(createPropTypingModel(t)))
    : undefined;

  const hasExplicitTypes = !!component.optionsTypeParams?.length;

  return renderModule({

    renderedImports: renderImports({
      dxExportPath: component.dxExportPath,
      baseComponentPath: component.isExtension
        ? component.extensionComponentPath
        : component.baseComponentPath,
      baseComponentName: component.isExtension ? 'ExtensionComponent' : 'Component',
      widgetName,
      optionsAliasName: hasExtraOptions ? undefined : optionsName,
      hasExtraOptions,
      hasPropTypings: isNotEmptyArray(renderedPropTypings),
      hasExplicitTypes,
      configComponentPath: isNotEmptyArray(nestedComponents)
        ? component.configComponentPath
        : undefined,
      customTypeImports,
      defaultTypeImports,
      wildcardTypeImports,
    }),

    renderedOptionsInterface: !hasExtraOptions ? undefined : renderOptionsInterface({
      optionsName,
      defaultProps: defaultProps || [],
      onChangeEvents: onChangeEvents || [],
      templates: templates || [],
      typeParams: component.optionsTypeParams?.length ? component.optionsTypeParams : undefined,
    }),

    renderedComponent: renderComponent({
      className: component.name,
      widgetName,
      optionsName,
      subscribableOptions: component.subscribableOptions
        ?.map((o) => renderStringEntry(o.name)),
      independentEvents: component.independentEvents?.map((f) => renderStringEntry(f.name)),
      renderedTemplateProps: templates && templates.map(renderTemplateOption),
      renderedDefaultProps: defaultProps && defaultProps.map((o) => renderObjectEntry({
        key: o.name,
        value: o.actualOptionName,
      })),
      renderedPropTypings,
      expectedChildren: component.expectedChildren,
      useRequestAnimationFrameFlag: USE_REQUEST_ANIMATION_FRAME.has(widgetName),
      isPortalComponent: PORTAL_COMPONENTS.has(widgetName),
      typeParams: component.optionsTypeParams?.length ? component.optionsTypeParams : undefined,
    }),

    renderedNestedComponents: nestedComponents && nestedComponents.map(renderNestedComponent),

    defaultExport: component.name,
    renderedExports: renderExports(exportNames),
    renderedReExports: generateReexports && component.containsReexports
      ? renderReExports(component.name, component.dxExportPath)
      : undefined,
  });
}

export default generate;
export {
  IComponent,
  IIndependentEvents,
  INestedComponent,
  IOption,
  ISubscribableOption,
  IPropTyping,
};
