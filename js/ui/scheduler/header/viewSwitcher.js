import {
    formatViews,
    getViewName,
    isOneView,
} from './utils';

const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = 'dx-scheduler-view-switcher-dropdown-button';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS = 'dx-scheduler-view-switcher-dropdown-button-content';

const getViewsAndSelectedView = (header) => {
    const views = formatViews(header.views);
    let selectedView = getViewName(header.currentView);

    const isSelectedViewInViews = views.some(view => view.name === selectedView);

    selectedView = isSelectedViewInViews ? selectedView : undefined;

    return { selectedView, views };
};

export const getViewSwitcher = (header, item) => {
    const { selectedView, views } = getViewsAndSelectedView(header);

    return {
        widget: 'dxButtonGroup',
        locateInMenu: 'auto',
        cssClass: VIEW_SWITCHER_CLASS,
        options: {
            items: views,
            keyExpr: 'name',
            selectedItemKeys: [selectedView],
            stylingMode: 'contained',
            onItemClick: (e) => {
                const view = e.itemData.view;

                header._updateCurrentView(view);
            },
            onContentReady: (e) => {
                const viewSwitcher = e.component;

                header._addEvent('currentView', (view) => {
                    viewSwitcher.option('selectedItemKeys', [getViewName(view)]);
                });
            },
        },
        ...item,
    };
};

export const getDropDownViewSwitcher = (header, item) => {
    const { selectedView, views } = getViewsAndSelectedView(header);

    const oneView = isOneView(views, selectedView);

    return {
        widget: 'dxDropDownButton',
        locateInMenu: 'never',
        cssClass: VIEW_SWITCHER_CLASS,
        options: {
            items: views,
            useSelectMode: true,
            keyExpr: 'name',
            selectedItemKey: selectedView,
            displayExpr: 'text',
            showArrowIcon: !oneView,
            elementAttr: {
                class: VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS,
            },
            onItemClick: (e) => {
                const view = e.itemData.view;

                header._updateCurrentView(view);
            },
            onContentReady: (e) => {
                const viewSwitcher = e.component;

                header._addEvent('currentView', (view) => {
                    const views = formatViews(header.views);

                    if(isOneView(views, view)) {
                        header.repaint();
                    }

                    viewSwitcher.option('selectedItemKey', getViewName(view));
                });
            },
            dropDownOptions: {
                onShowing: (e) => {
                    if(oneView) {
                        e.cancel = true;
                    }
                },
                width: 'max-content',
                _wrapperClassExternal: VIEW_SWITCHER_DROP_DOWN_BUTTON_CONTENT_CLASS,
            }
        },
        ...item,
    };
};
