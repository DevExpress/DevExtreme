import { Vue } from "vue/types/vue";
import { IComponentInfo } from "./configuration-component";
declare type UpdateFunc = (name: string, value: any) => void;
declare type EmitOptionChangedFunc = (name: string, value: any) => void;
interface ExpectedChild {
    isCollectionItem: boolean;
    optionName: string;
}
interface IOptionChangedArgs {
    fullName: string;
    value: any;
    previousValue: any;
    component: any;
}
declare class Configuration {
    private readonly _name;
    private readonly _isCollectionItem;
    private readonly _collectionItemIndex;
    private readonly _initialValues;
    private readonly _expectedChildren;
    private readonly _updateFunc;
    private readonly _ownerConfig;
    private _nestedConfigurations;
    private _prevNestedConfigOptions;
    private _emitOptionChanged;
    private _componentChanges;
    private _options;
    constructor(updateFunc: UpdateFunc, name: string | null, initialValues: Record<string, any>, expectedChildren?: Record<string, ExpectedChild>, isCollectionItem?: boolean, collectionItemIndex?: number, ownerConfig?: Pick<Configuration, "fullPath"> | undefined);
    get name(): string | null;
    get fullName(): string | null;
    get componentsCountChanged(): IComponentInfo[];
    cleanComponentsCountChanged(): void;
    get fullPath(): string | null;
    get ownerConfig(): Pick<Configuration, "fullPath"> | undefined;
    get options(): string[];
    get initialValues(): Record<string, any>;
    get expectedChildren(): Record<string, ExpectedChild>;
    get nested(): Configuration[];
    get prevNestedOptions(): any;
    get collectionItemIndex(): number | undefined;
    get isCollectionItem(): boolean;
    get updateFunc(): UpdateFunc;
    init(options: string[]): void;
    set emitOptionChanged(handler: EmitOptionChangedFunc);
    setPrevNestedOptions(value: any): void;
    onOptionChanged(args: IOptionChangedArgs): void;
    cleanNested(): void;
    createNested(name: string, initialValues: Record<string, any>, isCollectionItem?: boolean, expectedChildren?: Record<string, ExpectedChild>): Configuration;
    updateValue(nestedName: string, value: any): void;
    getNestedOptionValues(): Record<string, any> | undefined;
    getOptionsToWatch(): string[];
    private _onOptionChanged;
    private _getNestedConfig;
    private _tryEmitOptionChanged;
}
declare function bindOptionWatchers(config: Configuration, vueInstance: Pick<Vue, "$watch">, innerChanges: Record<string, any>): void;
declare function setEmitOptionChangedFunc(config: Configuration, vueInstance: Pick<Vue, "$emit" | "$props">, innerChanges: Record<string, any>): void;
export default Configuration;
export { bindOptionWatchers, setEmitOptionChangedFunc, UpdateFunc, ExpectedChild, IOptionChangedArgs };
