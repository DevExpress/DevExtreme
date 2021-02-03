import { Import, ImportName, Option } from './metadata-model';
import { getValues, byKeyComparer } from './helpers';

export interface FileImport {
    path: string;
    importString: string;
}

export function buildImports(options: Option[], widgetPackageName: string): FileImport[] {

    const importsByPath = extractImportsMeta(options).reduce(
        (paths, {Path, Name, Alias}) => {
            if (!paths[Path]) {
                paths[Path] = {};
            }

            paths[Path][`${Name}+${Alias}`] = { Name, Alias };

            return paths;
        }, {} as Record<string, Record<string, ImportName>>
    );

    return Object.keys(importsByPath)
        .map(path => {
            const {defaultImport, namedImports} = extractDefaultImport(getValues(importsByPath[path]));
            const parts = [];

            if (defaultImport) {
                parts.push(defaultImport);
            }

            if (namedImports.length) {
                const namedImportsString = namedImports
                    .sort(byKeyComparer(i => i.Name))
                    .map(({Name, Alias}) => Alias ? `${Name} as ${Alias}` : Name)
                    .join(', ');

                parts.push(`{ ${namedImportsString} }`);
            }

            return {
                path: `${widgetPackageName}/${path}`,
                importString: parts.join(', ')
            } as FileImport;
        })
        .sort(byKeyComparer(i => i.path));
}

function extractImportsMeta(options: Option[]): Import[] {
    if (!options || !options.length) {
        return [];
    }

    return options.reduce(
        (r, option) => {
            if (option) {
                r.push(...option.TypeImports);
                r.push(...extractImportsMeta(getValues(option.Options)));
            }
            return r;
        }, [] as Import[]
    );
}

function extractDefaultImport(imports: ImportName[]): { defaultImport?: string; namedImports: ImportName[] } {
    const result: ReturnType<typeof extractDefaultImport> = { defaultImport: undefined, namedImports: [] };

    for (const entry of imports) {
        if (isDefaultImport(entry)) {
            if (!entry.Alias) {
                throw new Error(`default export must have an alias: ${JSON.stringify(entry)}`);
            }
            result.defaultImport = entry.Alias;
        } else {
            result.namedImports.push(entry);
        }
    }

    return result;
}

function isDefaultImport(importName: ImportName): boolean {
    return importName.Name.toLowerCase() === 'default';
}
