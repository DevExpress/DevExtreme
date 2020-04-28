import DOMComponent from '../../core/dom_component';

export default class PreactWrapper extends DOMComponent {
    viewRef: any;

    getInstance(): this;

    _initMarkup(): void;

    _render(): void;

    getAllProps(isFirstRender: boolean): any;

    _getActionsMap(): any;

    _init(): any;

    _createViewRef(): any;

    _optionChanged(option: any): any;

    _addAction(name: string, config:any): any;

    _stateChange(name: string): (value: any) => void;

    _createTemplateComponent(props: any, templateOption: any, canBeAnonymous: boolean): any;

    _wrapKeyDownHandler(handler: (event: any, options: any) => any): any;

    // Public API
    repaint(): any;

    registerKeyHandler(key: string, handler: (e: any) => any): void;

    setAria(): any;
}
