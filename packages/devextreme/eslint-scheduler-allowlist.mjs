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

const schedulerWorkspaceOverrides = [
    '_getCellCount',
    '_getGroupCount',
    '_isHorizontalGroupedWorkSpace',
];

const schedulerLegacyMembers = [
    '_$allDayPanel',
    '_$dateTable',
    '_$dateTableScrollableContent',
    '_$flexContainer',
    '_$groupTable',
    '_$headerPanel',
    '_$headerPanelContainer',
    '_$thead',
    '_appointmentTooltipOffset',
    '_appointments',
    '_compactAppointmentsHelper',
    '_createAction',
    '_createEventArgs',
    '_dataAccessors',
    '_dataSource',
    '_dataSourceChangedHandler',
    '_dataSourceOptions',
    '_dateTableScrollable',
    '_draggingMode',
    '_getDragBehavior',
    '_groupPanelItems',
    '_groupedStrategy',
    '_ignorePreventScrollEventsDeprecation',
    '_isAppointmentBeingUpdated',
    '_isScrollOptionsObject',
    '_layoutManager',
    '_options',
    '_popup',
    '_renderAppointmentTemplate',
    '_renderGrid',
    '_shader',
    '_sidebarScrollable',
    '_textCache',
    '_timeZoneCalculator',
    '_useShortDateFormat',
    '_workSpace',
    '_wrapperClassExternal',
];

const schedulerMemberAllowlist = [
    ...schedulerDOMComponentOverrides,
    ...schedulerWidgetOverrides,
    ...schedulerCollectionWidgetOverrides,
    ...schedulerR1Overrides,
    ...schedulerWorkspaceOverrides,
    ...schedulerLegacyMembers,
];

export const schedulerMemberAllowlistRegex =
    `^(_|__esModule|${schedulerMemberAllowlist.map(s => s.replace(/\$/g, '\\$')).join('|')})$`;
