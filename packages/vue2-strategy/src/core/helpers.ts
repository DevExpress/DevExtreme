export function getTemplatePropName(props: Record<string, unknown> | null, templateName: string): string {
    for (const propName in props) {
        if (props[propName] === templateName) {
            return propName;
        }
    }

    return templateName;
}

export function uppercaseFirst(value: string): string {
    return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
    return value[0].toLowerCase() + value.substr(1);
}

export function camelize(value: string): string {
    return lowercaseFirst(value.split("-").map((v) => uppercaseFirst(v)).join(""));
}

export function toComparable(value: any): any {
    return value instanceof Date ? value.getTime() : value;
}

export function isEqual(value1, value2) {
    if (toComparable(value1) === toComparable(value2)) {
        return true;
    }

    if (Array.isArray(value1) && Array.isArray(value2)) {
        return value1.length === 0 && value2.length === 0;
    }

    return false;
}

export function forEachChildNode(
    el: Node,
    callback: (child: ReturnType<Node["childNodes"]["item"]>) => void
) {
    Array.prototype.slice.call(el.childNodes).forEach(callback);
}

export function allKeysAreEqual(obj1: object, obj2: object) {
    const obj1Keys = Object.keys(obj1);

    if (obj1Keys.length !==  Object.keys(obj2).length) {
        return false;
    }

    for (const key of obj1Keys) {
        if (!obj2.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

export function getOptionValue(options, optionPath) {
    let value = options;

    optionPath.split(".").forEach((p) => {
        const optionInfo = getOptionInfo(p);
        if (value) {
            value = optionInfo.isCollection ?
                value[optionInfo.name] && value[optionInfo.name][optionInfo.index] :
                value[optionInfo.name];
        }
    });

    return value;
}

export function getOptionInfo(name: string): IOptionInfo | ICollectionOptionInfo {
    const parts = name.split("[");

    if (parts.length === 1) {
        return {
            isCollection: false,
            name,
            fullName: name
        };
    }

    return {
        isCollection: true,
        name: parts[0],
        fullName: name,
        index: Number(parts[1].slice(0, -1))
    };
}

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
