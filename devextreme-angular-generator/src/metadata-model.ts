export interface ImportName {
    Name: string;
    Alias?: string;
}

export interface Import extends ImportName {
    Path: string;
}

export interface NestedOptions{
    [optionName: string]: Option;
}

export interface Option {
    PrimitiveTypes?: string[];
    ItemPrimitiveTypes: string[];
    TypeImports?: Import[];
    IsDataSource?: boolean;
    IsPromise?: boolean;
    IsDeprecated?: boolean;
    IsCollection?: boolean;
    IsChangeable?: boolean;
    IsTemplate?: boolean;
    IsReadonly?: boolean;
    SingularName?: string;
    IsEvent?: boolean;
    IsFunc?: boolean;
    DocID: string;
    TsType: {
        Name: string;
        File: string;
    },
    Options: NestedOptions
}

export interface Metadata {
    Widgets: {
        [widgetName: string]: {
            DocID: string;
            Module: string;
            IsTranscludedContent?: boolean;
            IsExtensionComponent?: boolean;
            IsDeprecated?: boolean;
            Options: {
                [optionName: string]: Option;
            };
            OptionsTypeParams: string[];
            Reexports: string[];
        }
    };
    ExtraObjects: any[];
}