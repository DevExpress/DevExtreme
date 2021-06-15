import { ComponentPublicInstance as IVue, VNode, VNodeProps } from "vue";
import { getOption } from "./config";
import { IComponentInfo } from "./configuration-component";
import { getOptionInfo, isEqual } from "./helpers";
import { VMODEL_NAME } from "./vue-helper";

type UpdateFunc = (name: string, value: any) => void;
type EmitOptionChangedFunc = (name: string, value: any) => void;

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

class Configuration {

    private readonly _name: string | null;
    private readonly _isCollectionItem: boolean;
    private readonly _collectionItemIndex: number | undefined;
    private readonly _initialValues: Record<string, any>;
    private readonly _expectedChildren: Record<string, ExpectedChild>;
    private readonly _updateFunc: UpdateFunc;
    private readonly _ownerConfig: Pick<Configuration, "fullPath"> | undefined;
    private _nestedConfigurations: Configuration[];
    private _prevNestedConfigOptions: any;
    private _emitOptionChanged: EmitOptionChangedFunc;
    private _componentChanges: IComponentInfo[];

    private _options: string[];

    constructor(
        updateFunc: UpdateFunc,
        name: string | null,
        initialValues: Record<string, any>,
        expectedChildren?: Record<string, ExpectedChild>,
        isCollectionItem?: boolean,
        collectionItemIndex?: number,
        ownerConfig?: Pick<Configuration, "fullPath"> | undefined
    ) {
        this._updateFunc = updateFunc;
        this._name = name;
        this._initialValues = initialValues ? initialValues : {};
        this._nestedConfigurations = [];
        this._isCollectionItem = !!isCollectionItem;
        this._collectionItemIndex = collectionItemIndex;
        this._expectedChildren = expectedChildren || {};
        this._ownerConfig = ownerConfig;
        this._componentChanges = [];

        this.updateValue = this.updateValue.bind(this);
    }

    public get name(): string | null {
        return this._name;
    }

    public get fullName(): string | null {
        return this._name && this._isCollectionItem
            ? `${this._name}[${this._collectionItemIndex}]`
            : this._name;
    }

    public get componentsCountChanged(): IComponentInfo[] {
        return this._componentChanges;
    }

    public cleanComponentsCountChanged() {
        this._componentChanges = [];
    }

    public get fullPath(): string | null {
        return this._ownerConfig && this._ownerConfig.fullPath
            ? `${this._ownerConfig.fullPath}.${this.fullName}`
            : this.fullName;
    }

    public get ownerConfig(): Pick<Configuration, "fullPath"> | undefined {
        return this._ownerConfig;
    }

    public get options(): string[] {
        return this._options;
    }

    public get initialValues(): Record<string, any> {
        return this._initialValues;
    }

    public get expectedChildren(): Record<string, ExpectedChild> {
        return this._expectedChildren;
    }

    public get nested(): Configuration[] {
        return this._nestedConfigurations;
    }

    public get prevNestedOptions(): any {
        return this._prevNestedConfigOptions;
    }

    public get collectionItemIndex(): number | undefined {
        return this._collectionItemIndex;
    }

    public get isCollectionItem(): boolean {
        return this._isCollectionItem;
    }

    public get updateFunc(): UpdateFunc {
        return this._updateFunc;
    }

    public init(options: string[]): void {
        this._options = options ? options : [];
    }

    public set emitOptionChanged(handler: EmitOptionChangedFunc) {
        this._emitOptionChanged = handler;
    }

    public setPrevNestedOptions(value: any) {
        this._prevNestedConfigOptions = value;
    }

    public onOptionChanged(args: IOptionChangedArgs) {
        if (isEqual(args.value, args.previousValue)) {
            return;
        }

        this._onOptionChanged(args.fullName.split("."), args);
    }
    public cleanNested() {
        this._nestedConfigurations = [];
    }

    public createNested(
        name: string,
        initialValues: Record<string, any>,
        isCollectionItem?: boolean,
        expectedChildren?: Record<string, ExpectedChild>
    ): Configuration {

        const expected = this._expectedChildren[name];
        let actualName = name;
        let actualIsCollectionItem = isCollectionItem;
        if (expected) {
            actualIsCollectionItem = expected.isCollectionItem;
            if (expected.optionName) {
                actualName = expected.optionName;
            }
        }

        let collectionItemIndex = -1;
        if (actualIsCollectionItem && actualName) {
            collectionItemIndex = this._nestedConfigurations.filter((c) => c._name && c._name === actualName).length;
        }

        const configuration = new Configuration(
            this._updateFunc,
            actualName,
            initialValues,
            expectedChildren,
            actualIsCollectionItem,
            collectionItemIndex,
            this
        );

        this._nestedConfigurations.push(configuration);

        return configuration;
    }

    public updateValue(nestedName: string, value: any): void {
        const fullName = [this.fullPath, nestedName].filter((n) => n).join(".");
        this._updateFunc(fullName, value);
    }

    public getNestedOptionValues(): Record<string, any> | undefined {
        const values = {};

        this._nestedConfigurations.forEach((o) => {
            if (!o._name) { return; }

            const nestedValue = {...o.initialValues, ...o.getNestedOptionValues()};
            if (!nestedValue) { return; }

            if (!o._isCollectionItem) {
                values[o._name] = nestedValue;
            } else {
                let arr = values[o._name];
                if (!arr || !Array.isArray(arr)) {
                    arr = [];
                    values[o._name] = arr;
                }

                arr.push(nestedValue);
            }
        });

        return values;
    }

    public getOptionsToWatch(): string[] {
        const blackList = {};
        this._nestedConfigurations.forEach((c) => c._name && (blackList[c._name] = true));

        return this._options.filter((o) => !blackList[o]);
    }

    private _onOptionChanged(
        optionRelPath: string[],
        args: { value: any, component: any }
    ): void {
        if (optionRelPath.length === 0) {
            return;
        }

        const optionInfo = getOptionInfo(optionRelPath[0]);
        if (optionInfo.isCollection || optionRelPath.length > 1) {
            const nestedConfig = this._getNestedConfig(optionInfo.fullName);
            if (nestedConfig) {
                nestedConfig._onOptionChanged(optionRelPath.slice(1), args);
                return;
            }

            this._tryEmitOptionChanged(
                optionInfo.name,
                args.component.option(this.fullPath ? `${this.fullPath}.${optionInfo.name}` : optionInfo.name)
            );
        } else {
            this._tryEmitOptionChanged(optionInfo.name, args.value);
        }
    }

    private _getNestedConfig(fullName: string): Configuration | undefined {
        for (const nestedConfig of this._nestedConfigurations) {
            if (nestedConfig.fullName === fullName) {
                return nestedConfig;
            }
        }

        return undefined;
    }

    private _tryEmitOptionChanged(name: string, value: any): void {
        if (this._emitOptionChanged) {
            this._emitOptionChanged(name, value);
        }
    }
}

function bindOptionWatchers(
    config: Configuration,
    vueInstance: Pick<IVue, "$watch">,
    innerChanges: Record<string, any>): void {
    const targets = config && config.getOptionsToWatch();
    if (targets) {
        targets.forEach((optionName: string) => {
            vueInstance.$watch(optionName, (value) => {
                if (!innerChanges.hasOwnProperty(optionName) ||
                innerChanges[optionName] !== value) {
                    config.updateValue(optionName, value);
                }
                delete innerChanges[optionName];
            }, { deep: getOption("deepWatch") });
        });
    }
}

function hasProp(vueInstance: Pick<IVue, "$options">, propName: string) {
    const props = vueInstance.$options.props;
    return props && props.hasOwnProperty(propName);
}

function hasVModelValue(options: Record<string, any>, props: VNodeProps, vnode: VNode) {
    return options.model
        && props.hasOwnProperty(VMODEL_NAME)
        && vnode?.props?.hasOwnProperty(VMODEL_NAME);
}

function setEmitOptionChangedFunc(
    config: Configuration,
    vueInstance: Pick<IVue, "$" | "$props" | "$emit" | "$options">,
    innerChanges: Record<string, any>): void {
    config.emitOptionChanged = (name: string, value: string) => {
        const props = vueInstance.$props;
        const vnode = vueInstance?.$?.vnode;
        if (hasProp(vueInstance, name) && !isEqual(value, props[name]) && vueInstance.$emit) {
            innerChanges[name] = value;
            const eventName = name === "value" && hasVModelValue(vueInstance.$options, props, vnode) ?
                `update:${VMODEL_NAME}` :
                `update:${name}`;

            vueInstance.$emit(eventName, value);
        }
    };
}

export default Configuration;
export { bindOptionWatchers, setEmitOptionChangedFunc, UpdateFunc, ExpectedChild, IOptionChangedArgs };
