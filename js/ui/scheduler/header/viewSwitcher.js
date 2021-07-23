import {
    formatViews,
    getViewName,
} from './utils';

const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';
const VIEW_SWITCHER_DROP_DOWN_BUTTON_CLASS = 'dx-scheduler-view-switcher-dropdown-button';

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
            stylingMode: 'outlined',
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
            splitButton: true,
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
                    viewSwitcher.option('selectedItemKey', getViewName(view));
                });
            },
        },
        ...item,
    };
};
