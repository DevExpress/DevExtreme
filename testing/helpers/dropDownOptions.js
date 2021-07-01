const defaultDropDownOptions = {
    accessKey: null,
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
    closeOnOutsideClick: null,
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
    onContentReady: null,
    onDisposing: null,
    onHidden: null,
    onHiding: null,
    onInitialized: null,
    onOptionChanged: null,
    onResize: null,
    onResizeEnd: null,
    onResizeStart: null,
    onShowing: null,
    onShown: null,
    onTitleRendered: null,
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
    width: null
};

export {
    defaultDropDownOptions
};
