const defaultDropDownOptions = {
    accessKey: undefined,
    animation: {
        hide: {
            duration: 400,
            from: 1,
            to: 0,
            type: 'fade'
        },
        show: {
            duration: 0,
            from: 0,
            to: 1,
            type: 'fade'
        }
    },
    hideOnOutsideClick: null,
    container: undefined,
    contentTemplate: null,
    deferRendering: false,
    disabled: false,
    dragEnabled: false,
    elementAttr: {},
    focusStateEnabled: false,
    fullScreen: false,
    height: 'auto',
    hint: undefined,
    hoverStateEnabled: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: null,
    minWidth: null,
    onContentReady: undefined,
    onDisposing: undefined,
    onHidden: null,
    onHiding: null,
    onInitialized: undefined,
    onOptionChanged: undefined,
    onResize: undefined,
    onResizeEnd: undefined,
    onResizeStart: undefined,
    onShowing: null,
    onShown: null,
    onTitleRendered: undefined,
    position: null,
    resizeEnabled: false,
    rtlEnabled: false,
    shading: false,
    shadingColor: '',
    showCloseButton: false,
    showTitle: false,
    tabIndex: 0,
    title: '',
    titleTemplate: 'title',
    toolbarItems: [],
    visible: false,
    width: null,
    _wrapperClassExternal: 'dx-dropdowneditor-overlay',
    _ignorePreventScrollEventsDeprecation: true,
};

export {
    defaultDropDownOptions
};
