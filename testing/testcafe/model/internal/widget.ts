import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
    focused: 'dx-state-focused'
};

export default abstract class Widget {
    element: Selector;
    isFocused: Promise<boolean>;

    abstract name: string;

    constructor (id: string|Selector) {
        this.element = typeof id === 'string' ? Selector(id) : id;
        this.isFocused = this.element.hasClass(CLASS.focused);
    }

    option (option: string, value?: any): Promise<any> {
        const { element, name } = this;
        const get = () => $(element())[name]('instance').option(option);
        const set = () => $(element())[name]('instance').option(option, value);
        const isSetter = arguments.length === 2;

        return ClientFunction(isSetter ? set : get, { dependencies: { option, value, element, name }})();
    }
}
