import Form, { Properties } from "devextreme/ui/form";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "alignItemLabels" |
  "alignItemLabelsInAllGroups" |
  "colCount" |
  "colCountByScreen" |
  "customizeItem" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "formData" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "items" |
  "labelLocation" |
  "labelMode" |
  "minColWidth" |
  "onContentReady" |
  "onDisposing" |
  "onEditorEnterKey" |
  "onFieldDataChanged" |
  "onInitialized" |
  "onOptionChanged" |
  "optionalMark" |
  "readOnly" |
  "requiredMark" |
  "requiredMessage" |
  "rtlEnabled" |
  "screenByWidth" |
  "scrollingEnabled" |
  "showColonAfterLabel" |
  "showOptionalMark" |
  "showRequiredMark" |
  "showValidationSummary" |
  "tabIndex" |
  "validationGroup" |
  "visible" |
  "width"
>;

interface DxForm extends AccessibleOptions {
  readonly instance?: Form;
}
const DxForm = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    alignItemLabels: Boolean,
    alignItemLabelsInAllGroups: Boolean,
    colCount: [Number, String],
    colCountByScreen: Object,
    customizeItem: Function,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    formData: {},
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    items: Array,
    labelLocation: String,
    labelMode: String,
    minColWidth: Number,
    onContentReady: Function,
    onDisposing: Function,
    onEditorEnterKey: Function,
    onFieldDataChanged: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    optionalMark: String,
    readOnly: Boolean,
    requiredMark: String,
    requiredMessage: String,
    rtlEnabled: Boolean,
    screenByWidth: Function,
    scrollingEnabled: Boolean,
    showColonAfterLabel: Boolean,
    showOptionalMark: Boolean,
    showRequiredMark: Boolean,
    showValidationSummary: Boolean,
    tabIndex: Number,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:alignItemLabels": null,
    "update:alignItemLabelsInAllGroups": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:customizeItem": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:formData": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:items": null,
    "update:labelLocation": null,
    "update:labelMode": null,
    "update:minColWidth": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorEnterKey": null,
    "update:onFieldDataChanged": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:optionalMark": null,
    "update:readOnly": null,
    "update:requiredMark": null,
    "update:requiredMessage": null,
    "update:rtlEnabled": null,
    "update:screenByWidth": null,
    "update:scrollingEnabled": null,
    "update:showColonAfterLabel": null,
    "update:showOptionalMark": null,
    "update:showRequiredMark": null,
    "update:showValidationSummary": null,
    "update:tabIndex": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Form {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Form;
    (this as any).$_expectedChildren = {
      ButtonItem: { isCollectionItem: true, optionName: "items" },
      colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" },
      EmptyItem: { isCollectionItem: true, optionName: "items" },
      GroupItem: { isCollectionItem: true, optionName: "items" },
      item: { isCollectionItem: true, optionName: "items" },
      SimpleItem: { isCollectionItem: true, optionName: "items" },
      TabbedItem: { isCollectionItem: true, optionName: "items" }
    };
  }
});

const DxAsyncRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxAsyncRule as any).$_optionName = "validationRules";
(DxAsyncRule as any).$_isCollectionItem = true;
(DxAsyncRule as any).$_predefinedProps = {
  type: "async"
};
const DxButtonItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:buttonOptions": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:horizontalAlignment": null,
    "update:itemType": null,
    "update:name": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    buttonOptions: Object,
    colSpan: Number,
    cssClass: String,
    horizontalAlignment: String,
    itemType: String,
    name: String,
    verticalAlignment: String,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxButtonItem as any).$_optionName = "items";
(DxButtonItem as any).$_isCollectionItem = true;
(DxButtonItem as any).$_predefinedProps = {
  itemType: "button"
};
(DxButtonItem as any).$_expectedChildren = {
  buttonOptions: { isCollectionItem: false, optionName: "buttonOptions" }
};
const DxButtonOptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:bindingOptions": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:icon": null,
    "update:onClick": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:template": null,
    "update:text": null,
    "update:type": null,
    "update:useSubmitBehavior": null,
    "update:validationGroup": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    bindingOptions: Object,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    icon: String,
    onClick: Function,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    rtlEnabled: Boolean,
    stylingMode: String,
    tabIndex: Number,
    template: {},
    text: String,
    type: String,
    useSubmitBehavior: Boolean,
    validationGroup: String,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxButtonOptions as any).$_optionName = "buttonOptions";
const DxColCountByScreen = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:lg": null,
    "update:md": null,
    "update:sm": null,
    "update:xs": null,
  },
  props: {
    lg: Number,
    md: Number,
    sm: Number,
    xs: Number
  }
});
(DxColCountByScreen as any).$_optionName = "colCountByScreen";
const DxCompareRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxCompareRule as any).$_optionName = "validationRules";
(DxCompareRule as any).$_isCollectionItem = true;
(DxCompareRule as any).$_predefinedProps = {
  type: "compare"
};
const DxCustomRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:reevaluate": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    reevaluate: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxCustomRule as any).$_optionName = "validationRules";
(DxCustomRule as any).$_isCollectionItem = true;
(DxCustomRule as any).$_predefinedProps = {
  type: "custom"
};
const DxEmailRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxEmailRule as any).$_optionName = "validationRules";
(DxEmailRule as any).$_isCollectionItem = true;
(DxEmailRule as any).$_predefinedProps = {
  type: "email"
};
const DxEmptyItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String,
    name: String,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxEmptyItem as any).$_optionName = "items";
(DxEmptyItem as any).$_isCollectionItem = true;
(DxEmptyItem as any).$_predefinedProps = {
  itemType: "empty"
};
const DxGroupItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:caption": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:items": null,
    "update:itemType": null,
    "update:name": null,
    "update:template": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignItemLabels: Boolean,
    caption: String,
    colCount: Number,
    colCountByScreen: Object,
    colSpan: Number,
    cssClass: String,
    items: Array,
    itemType: String,
    name: String,
    template: {},
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxGroupItem as any).$_optionName = "items";
(DxGroupItem as any).$_isCollectionItem = true;
(DxGroupItem as any).$_predefinedProps = {
  itemType: "group"
};
(DxGroupItem as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};
const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:buttonOptions": null,
    "update:caption": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:disabled": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:horizontalAlignment": null,
    "update:html": null,
    "update:icon": null,
    "update:isRequired": null,
    "update:items": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
    "update:validationRules": null,
    "update:verticalAlignment": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    alignItemLabels: Boolean,
    badge: String,
    buttonOptions: Object,
    caption: String,
    colCount: Number,
    colCountByScreen: Object,
    colSpan: Number,
    cssClass: String,
    dataField: String,
    disabled: Boolean,
    editorOptions: {},
    editorType: String,
    helpText: String,
    horizontalAlignment: String,
    html: String,
    icon: String,
    isRequired: Boolean,
    items: Array,
    itemType: String,
    label: Object,
    name: String,
    tabPanelOptions: Object,
    tabs: Array,
    tabTemplate: {},
    template: {},
    text: String,
    title: String,
    validationRules: Array,
    verticalAlignment: String,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxLabel = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:location": null,
    "update:showColon": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    alignment: String,
    location: String,
    showColon: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
});
(DxLabel as any).$_optionName = "label";
const DxNumericRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    type: String
  }
});
(DxNumericRule as any).$_optionName = "validationRules";
(DxNumericRule as any).$_isCollectionItem = true;
(DxNumericRule as any).$_predefinedProps = {
  type: "numeric"
};
const DxPatternRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:message": null,
    "update:pattern": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    message: String,
    pattern: {},
    type: String
  }
});
(DxPatternRule as any).$_optionName = "validationRules";
(DxPatternRule as any).$_isCollectionItem = true;
(DxPatternRule as any).$_predefinedProps = {
  type: "pattern"
};
const DxRangeRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:reevaluate": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    reevaluate: Boolean,
    type: String
  }
});
(DxRangeRule as any).$_optionName = "validationRules";
(DxRangeRule as any).$_isCollectionItem = true;
(DxRangeRule as any).$_predefinedProps = {
  type: "range"
};
const DxRequiredRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:message": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    message: String,
    trim: Boolean,
    type: String
  }
});
(DxRequiredRule as any).$_optionName = "validationRules";
(DxRequiredRule as any).$_isCollectionItem = true;
(DxRequiredRule as any).$_predefinedProps = {
  type: "required"
};
const DxSimpleItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:editorOptions": null,
    "update:editorType": null,
    "update:helpText": null,
    "update:isRequired": null,
    "update:itemType": null,
    "update:label": null,
    "update:name": null,
    "update:template": null,
    "update:validationRules": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    dataField: String,
    editorOptions: {},
    editorType: String,
    helpText: String,
    isRequired: Boolean,
    itemType: String,
    label: Object,
    name: String,
    template: {},
    validationRules: Array,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxSimpleItem as any).$_optionName = "items";
(DxSimpleItem as any).$_isCollectionItem = true;
(DxSimpleItem as any).$_predefinedProps = {
  itemType: "simple"
};
(DxSimpleItem as any).$_expectedChildren = {
  AsyncRule: { isCollectionItem: true, optionName: "validationRules" },
  CompareRule: { isCollectionItem: true, optionName: "validationRules" },
  CustomRule: { isCollectionItem: true, optionName: "validationRules" },
  EmailRule: { isCollectionItem: true, optionName: "validationRules" },
  label: { isCollectionItem: false, optionName: "label" },
  NumericRule: { isCollectionItem: true, optionName: "validationRules" },
  PatternRule: { isCollectionItem: true, optionName: "validationRules" },
  RangeRule: { isCollectionItem: true, optionName: "validationRules" },
  RequiredRule: { isCollectionItem: true, optionName: "validationRules" },
  StringLengthRule: { isCollectionItem: true, optionName: "validationRules" },
  validationRule: { isCollectionItem: true, optionName: "validationRules" }
};
const DxStringLengthRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:trim": null,
    "update:type": null,
  },
  props: {
    ignoreEmptyValue: Boolean,
    max: Number,
    message: String,
    min: Number,
    trim: Boolean,
    type: String
  }
});
(DxStringLengthRule as any).$_optionName = "validationRules";
(DxStringLengthRule as any).$_isCollectionItem = true;
(DxStringLengthRule as any).$_predefinedProps = {
  type: "stringLength"
};
const DxTab = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignItemLabels": null,
    "update:badge": null,
    "update:colCount": null,
    "update:colCountByScreen": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:title": null,
  },
  props: {
    alignItemLabels: Boolean,
    badge: String,
    colCount: Number,
    colCountByScreen: Object,
    disabled: Boolean,
    icon: String,
    items: Array,
    tabTemplate: {},
    template: {},
    title: String
  }
});
(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;
(DxTab as any).$_expectedChildren = {
  colCountByScreen: { isCollectionItem: false, optionName: "colCountByScreen" }
};
const DxTabbedItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colSpan": null,
    "update:cssClass": null,
    "update:itemType": null,
    "update:name": null,
    "update:tabPanelOptions": null,
    "update:tabs": null,
    "update:visible": null,
    "update:visibleIndex": null,
  },
  props: {
    colSpan: Number,
    cssClass: String,
    itemType: String,
    name: String,
    tabPanelOptions: Object,
    tabs: Array,
    visible: Boolean,
    visibleIndex: Number
  }
});
(DxTabbedItem as any).$_optionName = "items";
(DxTabbedItem as any).$_isCollectionItem = true;
(DxTabbedItem as any).$_predefinedProps = {
  itemType: "tabbed"
};
(DxTabbedItem as any).$_expectedChildren = {
  tab: { isCollectionItem: true, optionName: "tabs" },
  tabPanelOptions: { isCollectionItem: false, optionName: "tabPanelOptions" }
};
const DxTabPanelOptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:animationEnabled": null,
    "update:bindingOptions": null,
    "update:dataSource": null,
    "update:deferRendering": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemHoldTimeout": null,
    "update:items": null,
    "update:itemTemplate": null,
    "update:itemTitleTemplate": null,
    "update:loop": null,
    "update:noDataText": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onItemClick": null,
    "update:onItemContextMenu": null,
    "update:onItemHold": null,
    "update:onItemRendered": null,
    "update:onOptionChanged": null,
    "update:onSelectionChanged": null,
    "update:onTitleClick": null,
    "update:onTitleHold": null,
    "update:onTitleRendered": null,
    "update:repaintChangesOnly": null,
    "update:rtlEnabled": null,
    "update:scrollByContent": null,
    "update:scrollingEnabled": null,
    "update:selectedIndex": null,
    "update:selectedItem": null,
    "update:showNavButtons": null,
    "update:swipeEnabled": null,
    "update:tabIndex": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    animationEnabled: Boolean,
    bindingOptions: Object,
    dataSource: {},
    deferRendering: Boolean,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemHoldTimeout: Number,
    items: Array,
    itemTemplate: {},
    itemTitleTemplate: {},
    loop: Boolean,
    noDataText: String,
    onContentReady: Function,
    onDisposing: Function,
    onInitialized: Function,
    onItemClick: Function,
    onItemContextMenu: Function,
    onItemHold: Function,
    onItemRendered: Function,
    onOptionChanged: Function,
    onSelectionChanged: Function,
    onTitleClick: Function,
    onTitleHold: Function,
    onTitleRendered: Function,
    repaintChangesOnly: Boolean,
    rtlEnabled: Boolean,
    scrollByContent: Boolean,
    scrollingEnabled: Boolean,
    selectedIndex: Number,
    selectedItem: {},
    showNavButtons: Boolean,
    swipeEnabled: Boolean,
    tabIndex: Number,
    visible: Boolean,
    width: [Function, Number, String]
  }
});
(DxTabPanelOptions as any).$_optionName = "tabPanelOptions";
(DxTabPanelOptions as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  tabPanelOptionsItem: { isCollectionItem: true, optionName: "items" }
};
const DxTabPanelOptionsItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:badge": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:tabTemplate": null,
    "update:template": null,
    "update:text": null,
    "update:title": null,
  },
  props: {
    badge: String,
    disabled: Boolean,
    html: String,
    icon: String,
    tabTemplate: {},
    template: {},
    text: String,
    title: String
  }
});
(DxTabPanelOptionsItem as any).$_optionName = "items";
(DxTabPanelOptionsItem as any).$_isCollectionItem = true;
const DxValidationRule = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:comparisonTarget": null,
    "update:comparisonType": null,
    "update:ignoreEmptyValue": null,
    "update:max": null,
    "update:message": null,
    "update:min": null,
    "update:pattern": null,
    "update:reevaluate": null,
    "update:trim": null,
    "update:type": null,
    "update:validationCallback": null,
  },
  props: {
    comparisonTarget: Function,
    comparisonType: String,
    ignoreEmptyValue: Boolean,
    max: {},
    message: String,
    min: {},
    pattern: {},
    reevaluate: Boolean,
    trim: Boolean,
    type: String,
    validationCallback: Function
  }
});
(DxValidationRule as any).$_optionName = "validationRules";
(DxValidationRule as any).$_isCollectionItem = true;
(DxValidationRule as any).$_predefinedProps = {
  type: "required"
};

export default DxForm;
export {
  DxForm,
  DxAsyncRule,
  DxButtonItem,
  DxButtonOptions,
  DxColCountByScreen,
  DxCompareRule,
  DxCustomRule,
  DxEmailRule,
  DxEmptyItem,
  DxGroupItem,
  DxItem,
  DxLabel,
  DxNumericRule,
  DxPatternRule,
  DxRangeRule,
  DxRequiredRule,
  DxSimpleItem,
  DxStringLengthRule,
  DxTab,
  DxTabbedItem,
  DxTabPanelOptions,
  DxTabPanelOptionsItem,
  DxValidationRule
};
import type * as DxFormTypes from "devextreme/ui/form_types";
export { DxFormTypes };
