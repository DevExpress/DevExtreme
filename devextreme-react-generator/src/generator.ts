import {
  writeFileSync as writeFile, existsSync, mkdirSync,
} from 'fs';

import {
  dirname as getDirName,
  join as joinPaths,
  relative as getRelativePath,
  sep as pathSeparator,
} from 'path';

import {
  IArrayDescr,
  IComplexProp,
  ICustomType,
  IFunctionDescr,
  IModel,
  IObjectDescr,
  IProp,
  ITypeDescr,
  IWidget,
} from 'devextreme-internal-tools/integration-data-model';

import * as defaultImportOverridesMetadata from './import-overrides.json';

import { convertTypes } from './converter';
import generateIndex, { IReExport } from './index-generator';
import generateCommonReexports from './common-reexports-generator';

import generateComponent, {
  IComponent,
  IIndependentEvents,
  INestedComponent,
  IOption,
  IPropTyping,
  ISubscribableOption,
} from './component-generator';

import {
  isEmptyArray,
  isNotEmptyArray,
  removeExtension,
  removePrefix,
  toKebabCase,
  uppercaseFirst,
} from './helpers';

enum BaseTypes {
  Any = 'any',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Object = 'object',
  Null = 'null',
  True = 'true',
  False = 'false',
}

export type ImportOverridesMetadata = {
  importOverrides?: Record<string, string>,
  genericTypes?: Record<string, unknown>,
  defaultImports?: Record<string, string>,
  nameConflictsResolutionNamespaces?: Record<string, string>,
  typeResolutions?: Record<string, string>,
};

type TypeResolver = (typeDescriptor: ITypeDescr) => string;

type TypeGenerationOptions = {
  generateReexports?: boolean,
  generateCustomTypes?: boolean
  importOverridesMetadata?: ImportOverridesMetadata,
};

function isFunctionDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IFunctionDescr {
  return typeDescriptor.type === 'Function';
}

function isArrayDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IArrayDescr {
  return typeDescriptor.type === 'Array';
}

function isObjectDescriptor(typeDescriptor: ITypeDescr): typeDescriptor is IObjectDescr {
  return typeDescriptor.type === 'Object' && (typeDescriptor as IObjectDescr).fields !== undefined;
}

export function convertToBaseType(type: string): BaseTypes {
  return BaseTypes[type];
}

export function createCustomTypeResolver(
  importOverridesMetadata: ImportOverridesMetadata,
  widgetCustomTypesCollector: Set<string>,
  resolveNameConflicts: (string) => string = (typeName) => typeName,
): TypeResolver {
  return (typeDescriptor: ITypeDescr) => {
    const resolvedType = importOverridesMetadata.typeResolutions?.[typeDescriptor.type]
      || typeDescriptor.type;
    widgetCustomTypesCollector.add(resolvedType);
    const resultingType = resolveNameConflicts(
      importOverridesMetadata.nameConflictsResolutionNamespaces?.[resolvedType]
        ? `${importOverridesMetadata.nameConflictsResolutionNamespaces[resolvedType]}.${resolvedType}` : resolvedType,
    );
    return importOverridesMetadata.genericTypes?.[resultingType] ? `${resultingType}<any>` : resultingType;
  };
}

export function getComplexOptionType(
  types: ITypeDescr[], resolveCustomType?: TypeResolver,
): string | undefined {
  function formatTypeDescriptor(typeDescriptor: ITypeDescr): string {
    function formatArrayDescriptor(arrayDescriptor: IArrayDescr): string {
      const filteredDescriptors = arrayDescriptor.itemTypes?.map((t) => formatTypeDescriptor(t))
        .filter((t) => t !== undefined);
      const itemTypes = filteredDescriptors && filteredDescriptors.length
        ? Array.from(new Set(filteredDescriptors)).join(' | ')
        : BaseTypes.Any;
      return `Array<${itemTypes}>`;
    }

    function formatFunctionDescriptor(functionDescriptor: IFunctionDescr): string {
      const parameters = functionDescriptor.params?.map((p) => `${p.name}: ${getComplexOptionType(p.types, resolveCustomType) || BaseTypes.Any}`)
        .join(', ') || '';
      const returnType = (
        functionDescriptor.returnValueType && (formatTypeDescriptor(functionDescriptor.returnValueType) || (functionDescriptor.returnValueType.type === 'void' && 'void'))
      ) || BaseTypes.Any;
      return `(${parameters}) => ${returnType}`;
    }

    function formatObjectDescriptor(objectDescriptor: IObjectDescr): string {
      const fields = objectDescriptor.fields.map((f) => `${f.name}: ${getComplexOptionType(f.types, resolveCustomType) || BaseTypes.Any}`);
      return fields ? `{ ${fields.join(', ')} }` : BaseTypes.Object;
    }

    if (isArrayDescriptor(typeDescriptor)) {
      return formatArrayDescriptor(typeDescriptor);
    }
    if (isFunctionDescriptor(typeDescriptor)) {
      const result = formatFunctionDescriptor(typeDescriptor);
      // TS1385
      return `(${result})`;
    }
    if (isObjectDescriptor(typeDescriptor)) {
      return formatObjectDescriptor(typeDescriptor);
    }
    if (typeDescriptor.acceptableValues !== undefined
       && typeDescriptor.acceptableValues.length > 0) {
      return Array.from(new Set(typeDescriptor.acceptableValues)).join(' | ');
    }
    if (typeDescriptor.isCustomType && resolveCustomType) {
      return resolveCustomType(typeDescriptor);
    }
    return convertToBaseType(typeDescriptor.type);
  }

  return types && isNotEmptyArray(types) ? Array.from(new Set(types))
    .map((t) => formatTypeDescriptor(t))
    .filter((t) => t !== undefined)
    .join(' | ') : undefined;
}

export function mapSubscribableOption(
  prop: IProp, typeResolver?: TypeResolver,
): ISubscribableOption {
  return {
    name: prop.name,
    type: getComplexOptionType(prop.types, typeResolver) || BaseTypes.Any,
    isSubscribable: prop.isSubscribable || undefined,
  };
}

export function mapIndependentEvents(prop: IProp): IIndependentEvents {
  return {
    name: prop.name,
  };
}

export function isNestedOptionArray(prop: IProp): boolean {
  return isNotEmptyArray(prop.types) && (prop.types[0].type === 'Array');
}

export function mapOption(prop: IProp, typeResolver?: TypeResolver): IOption {
  return isEmptyArray(prop.props)
    ? {
      name: prop.name,
      type: getComplexOptionType(prop.types, typeResolver) || BaseTypes.Any,
      isSubscribable: prop.isSubscribable || undefined,

    } : {
      name: prop.name,
      isSubscribable: prop.isSubscribable || undefined,
      type: getComplexOptionType(prop.types, typeResolver),
      nested: (prop.props as IProp[]).map((p) => mapOption(p, typeResolver)),
      isArray: isNestedOptionArray(prop),
    };
}

function getWidgetComponentNames(rawWidgetName: string, widgetName: string, props: IComplexProp[]) {
  const nameClassMap: Record<string, string> = {};
  nameClassMap[rawWidgetName] = widgetName;
  props.forEach((p) => {
    nameClassMap[p.name] = uppercaseFirst(p.name);
  });
  return nameClassMap;
}

export function extractNestedComponents(
  props: IComplexProp[],
  rawWidgetName: string,
  widgetName: string,
  typeResolver?: TypeResolver,
): INestedComponent[] {
  const nameClassMap = getWidgetComponentNames(rawWidgetName, widgetName, props);
  return props.map((p) => ({
    className: nameClassMap[p.name],
    owners: p.owners.map((o) => nameClassMap[o]),
    optionName: p.optionName,
    options: p.props.map((prop) => mapOption(prop, typeResolver)),
    isCollectionItem: p.isCollectionItem,
    templates: p.templates,
    predefinedProps: p.predefinedProps,
    expectedChildren: p.nesteds,
  }));
}

export function createPropTyping(
  option: IProp,
  customTypes: Record<string, ICustomType>,
): IPropTyping | null {
  const isRestrictedType = (t: ITypeDescr): boolean => t.acceptableValues?.length > 0;

  const rawTypes = option.types.filter((t) => !isRestrictedType(t));
  const restrictedTypes = option.types.filter((t) => isRestrictedType(t));

  const types = convertTypes(rawTypes, customTypes);

  if (restrictedTypes.length > 0) {
    return {
      propName: option.name,
      types: types || [],
      acceptableType: restrictedTypes[0].type.toLowerCase(),
      acceptableValues: restrictedTypes[0].acceptableValues,
    };
  }

  if ((!types || types.length === 0)) {
    return null;
  }

  return {
    propName: option.name,
    types,
  };
}

export function extractPropTypings(
  options: IProp[],
  customTypes: Record<string, ICustomType>,
): (IPropTyping | null)[] {
  return options
    .map((o) => createPropTyping(o, customTypes))
    .filter((t) => t != null);
}

export function collectIndependentEvents(options: IProp[]): IProp[] {
  return options.reduce((acc, option) => {
    if (option.types.filter((type) => type.type === 'Function').length === 1
        && (!option.firedEvents || option.firedEvents.length === 0)
        && option.name.substr(0, 2) === 'on'
        && !option.name.match(/^(?!.*Value).*Changed/)
    ) {
      acc.push(option);
    }
    return acc;
  }, [] as IProp[]);
}

export function collectSubscribableRecursively(options: IProp[], prefix = ''): IProp[] {
  return options.reduce((acc, option) => {
    if (option.isSubscribable) {
      acc.push({
        ...option,
        name: `${prefix}${option.name}`,
      });
    }
    if (option.props?.length) {
      acc.push(...collectSubscribableRecursively(
        option.props,
        `${option.name}.`,
      ));
    }
    return acc;
  }, [] as IProp[]);
}

export function mapWidget(
  raw: IWidget,
  baseComponent: string,
  extensionComponent: string,
  configComponent: string,
  customTypes: ICustomType[],
  widgetPackage: string,
  typeGenerationOptions?: TypeGenerationOptions,
): {
    fileName: string;
    component: IComponent,
    customTypeImports?: Record<string, Array<string>>,
    defaultTypeImports?: Record<string, string>,
    wildcardTypeImports?: Record<string, string>,
  } {
  const name = removePrefix(raw.name, 'dx');

  const widgetCustomTypes = new Set<string>();
  const { importOverridesMetadata, generateCustomTypes } = typeGenerationOptions || {};

  const generatedComponentNames = Object.values(
    getWidgetComponentNames(raw.name, name, raw.complexOptions || []),
  );

  const typeAliases: Record<string, string> = {};
  const resolveGeneratedComponentNamesConflict = (typeName: string) => {
    if (generatedComponentNames.includes(typeName)) {
      const aliasedTypeName = `${typeName}Aliased`;
      typeAliases[typeName] = aliasedTypeName;
      return aliasedTypeName;
    }
    return typeName;
  };
  const getTypeImportStatement = (typeName: string) => (
    typeAliases[typeName] ? `${typeName} as ${typeAliases[typeName]}` : typeName
  );

  const typeResolver = generateCustomTypes
    ? createCustomTypeResolver(
      importOverridesMetadata || {},
      widgetCustomTypes,
      resolveGeneratedComponentNamesConflict,
    ) : undefined;

  const subscribableOptions: ISubscribableOption[] = collectSubscribableRecursively(raw.options)
    .map((option) => mapSubscribableOption(option, typeResolver));

  const independentEvents: IIndependentEvents[] = collectIndependentEvents(raw.options)
    .map(mapIndependentEvents);

  const nestedOptions = raw.complexOptions
    ? extractNestedComponents(raw.complexOptions, raw.name, name, typeResolver)
    : null;

  const customTypeHash = customTypes.reduce((result, type) => {
    result[type.name] = type;
    return result;
  }, {});
  const propTypings = extractPropTypings(raw.options, customTypeHash)
    .filter((propType) => propType !== null) as IPropTyping[];

  const customTypeImports: Record<string, Array<string>> = {};
  const defaultTypeImports: Record<string, string> = {};
  const wildcardTypeImports: Record<string, string> = {};

  widgetCustomTypes.forEach((t) => {
    if (importOverridesMetadata?.defaultImports?.[t]) {
      defaultTypeImports[t] = importOverridesMetadata.defaultImports[t];
      return;
    }
    const customType = customTypes.find((item) => item.name === t);

    const module = importOverridesMetadata?.importOverrides?.[t] || (customType && customType.module && `devextreme/${customType.module}`);
    if (module) {
      const moduleImportNamespace = importOverridesMetadata?.nameConflictsResolutionNamespaces?.[t];
      if (moduleImportNamespace) {
        wildcardTypeImports[module] = moduleImportNamespace;
      } else {
        customTypeImports[module] = [
          ...(customTypeImports[module] || []),
          getTypeImportStatement(t),
        ];
      }
    }
  });

  const dxExportPath = `${widgetPackage}/${raw.exportPath}`;
  return {
    fileName: `${toKebabCase(name)}.ts`,
    component: {
      name,
      baseComponentPath: baseComponent,
      extensionComponentPath: extensionComponent,
      configComponentPath: configComponent,
      dxExportPath,
      isExtension: raw.isExtension,
      templates: raw.templates,
      subscribableOptions: subscribableOptions.length > 0 ? subscribableOptions : undefined,
      independentEvents: independentEvents.length > 0 ? independentEvents : undefined,
      nestedComponents: nestedOptions && nestedOptions.length > 0 ? nestedOptions : undefined,
      expectedChildren: raw.nesteds,
      propTypings: propTypings.length > 0 ? propTypings : undefined,
      optionsTypeParams: raw.optionsTypeParams,
      containsReexports: !!raw.reexports.filter((r) => r !== 'default').length,
    },
    customTypeImports,
    defaultTypeImports,
    wildcardTypeImports,
  };
}

function generate({
  metaData: rawData,
  components: { baseComponent, extensionComponent, configComponent },
  out,
  widgetsPackage,
  typeGenerationOptions = {},
}: {
  metaData: IModel,
  components: {
    baseComponent: string,
    extensionComponent: string,
    configComponent: string,
  },
  out: {
    componentsDir: string,
    indexFileName: string
  },
  widgetsPackage: string,
  typeGenerationOptions?: TypeGenerationOptions,
}): void {
  const modulePaths: IReExport[] = [];
  const {
    generateReexports,
    generateCustomTypes,
    importOverridesMetadata,
  } = typeGenerationOptions;

  rawData.widgets.forEach((data) => {
    const widgetFile = mapWidget(
      data,
      baseComponent,
      extensionComponent,
      configComponent,
      rawData.customTypes,
      widgetsPackage,
      {
        generateCustomTypes,
        importOverridesMetadata: importOverridesMetadata || defaultImportOverridesMetadata,
      },
    );
    const widgetFilePath = joinPaths(out.componentsDir, widgetFile.fileName);
    const indexFileDir = getDirName(out.indexFileName);

    writeFile(widgetFilePath, generateComponent(widgetFile.component, generateReexports, widgetFile.customTypeImports, widgetFile.defaultTypeImports, widgetFile.wildcardTypeImports), { encoding: 'utf8' });
    modulePaths.push({
      name: widgetFile.component.name,
      path: `./${removeExtension(getRelativePath(indexFileDir, widgetFilePath)).replace(pathSeparator, '/')}`,
    });
  });

  writeFile(out.indexFileName, generateIndex(modulePaths), { encoding: 'utf8' });

  if (generateReexports && rawData.commonReexports) {
    const commonTargetFolderName = 'common';
    const commonPath = joinPaths(out.componentsDir, commonTargetFolderName);
    if (!existsSync(commonPath)) {
      mkdirSync(commonPath);
    }
    Object.keys(rawData.commonReexports).forEach((key) => {
      const targetFileName = key === commonTargetFolderName ? 'index.ts' : `${key.replace(`${commonTargetFolderName}/`, '')}.ts`;
      writeFile(
        joinPaths(commonPath, targetFileName),
        generateCommonReexports(key, rawData.commonReexports[key]),
        { encoding: 'utf8' },
      );
    });
  }
}

export default generate;
