const schedulerDOMComponentOverrides = [
    '_createActionByOption',
    '_defaultOptionsRules',
    '_dimensionChanged',
    '_dispose',
    '_disposed',
    '_getDefaultOptions',
    '_init',
    '_initTemplates',
    '_optionChanged',
    '_setOptionsByReference',
    '_useTemplates',
    '_visibilityChanged',
];

const schedulerWidgetOverrides = [
    '_activeStateUnit',
    '_clean',
    '_cleanFocusState',
    '_eventBindingTarget',
    '_fireContentReadyAction',
    '_focusInHandler',
    '_focusOutHandler',
    '_focusTarget',
    '_initMarkup',
    '_keyboardHandler',
    '_render',
    '_renderContent',
    '_renderFocusState',
    '_renderFocusTarget',
    '_supportedKeys',
    '_toggleVisibility',
    '_createAction',
    '_createEventArgs',
    '_dataSource',
    '_dataSourceChangedHandler',
    '_dataSourceOptions',
    '_options',
];

const schedulerCollectionWidgetOverrides = [
    '_cleanItemContainer',
    '_clearDropDownItemsElements',
    '_createItemByTemplate',
    '_executeItemRenderAction',
    '_filteredItems',
    '_findItemElementByItem',
    '_focusedItemIndexBeforeRender',
    '_getItemContent',
    '_itemClass',
    '_itemClickHandler',
    '_itemContainer',
    '_moveFocus',
    '_postprocessRenderItem',
    '_processItemClick',
    '_refreshActiveDescendant',
    '_renderDirection',
    '_renderItem',
    '_sortedItems',
];

const schedulerR1Overrides = [
    '_propsInfo',
    '_value',
    '_viewComponent',
];

const schedulerLegacyMembers = [
    // workspaces/m_work_space.ts
    '_$allDayPanel',
    '_$dateTable',
    '_$dateTableScrollableContent',
    '_$flexContainer',
    '_$groupTable',
    '_$headerPanel',
    '_$headerPanelContainer',
    '_$thead',
    '_dateTableScrollable',
    '_getCellCount',
    '_getGroupCount',
    '_groupedStrategy',
    '_isHorizontalGroupedWorkSpace',
    '_shader',
    '_sidebarScrollable',

    // m_scheduler.ts
    '_appointments',
    '_compactAppointmentsHelper',
    '_dataAccessors',
    '_getDragBehavior',
    '_isAppointmentBeingUpdated',
    '_layoutManager',
    '_workSpace',

    // appointments/m_appointment_collection.ts
    '_renderAppointmentTemplate',

    // workspaces/view_model/m_view_data_generator.ts
    '_getIntervalDuration',

    // workspaces/m_virtual_scrolling.ts
    '_renderGrid',

    // appointment_popup/m_popup.ts
    '_popup',

    // appointment_popup/m_legacy_popup.ts
    '_ignorePreventScrollEventsDeprecation',

    // header/m_header.ts
    '_useShortDateFormat',

    // header/m_view_switcher.ts
    '_wrapperClassExternal',

    // utils/options/constants.ts, utils/options/types.ts
    '_appointmentTooltipOffset',
    '_draggingMode',
];

const schedulerMemberAllowlist = [
    ...schedulerDOMComponentOverrides,
    ...schedulerWidgetOverrides,
    ...schedulerCollectionWidgetOverrides,
    ...schedulerR1Overrides,
    ...schedulerLegacyMembers,
];

export const schedulerMemberAllowlistRegex =
    `^(_|__esModule|${schedulerMemberAllowlist.map(s => s.replace(/\$/g, '\\$')).join('|')})$`;
