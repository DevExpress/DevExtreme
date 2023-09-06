export declare function getTemplatePropName(props: Record<string, unknown> | null, templateName: string): string;
export declare function uppercaseFirst(value: string): string;
export declare function lowercaseFirst(value: string): string;
export declare function camelize(value: string): string;
export declare function toComparable(value: any): any;
export declare function isEqual(value1: any, value2: any): boolean;
export declare function forEachChildNode(el: Node, callback: (child: ReturnType<Node['childNodes']['item']>) => void): void;
export declare function allKeysAreEqual(obj1: object, obj2: object): boolean;
export declare function getOptionValue(options: any, optionPath: any): any;
export declare function getOptionInfo(name: string): IOptionInfo | ICollectionOptionInfo;
interface IOptionInfo {
    isCollection: false;
    name: string;
    fullName: string;
}
interface ICollectionOptionInfo {
    isCollection: true;
    name: string;
    fullName: string;
    index: number;
}
export {};
