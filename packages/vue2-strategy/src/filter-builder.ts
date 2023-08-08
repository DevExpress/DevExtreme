import FilterBuilder, { Properties } from "devextreme/ui/filter_builder";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowHierarchicalFields" |
  "customOperations" |
  "disabled" |
  "elementAttr" |
  "fields" |
  "filterOperationDescriptions" |
  "focusStateEnabled" |
  "groupOperationDescriptions" |
  "groupOperations" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "maxGroupLevel" |
  "onContentReady" |
  "onDisposing" |
  "onEditorPrepared" |
  "onEditorPreparing" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "rtlEnabled" |
  "tabIndex" |
  "value" |
  "visible" |
  "width"
>;

interface DxFilterBuilder extends AccessibleOptions {
  readonly instance?: FilterBuilder;
}
const DxFilterBuilder = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowHierarchicalFields: Boolean,
    customOperations: Array,
    disabled: Boolean,
    elementAttr: Object,
    fields: Array,
    filterOperationDescriptions: Object,
    focusStateEnabled: Boolean,
    groupOperationDescriptions: Object,
    groupOperations: Array,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    maxGroupLevel: Number,
    onContentReady: Function,
    onDisposing: Function,
    onEditorPrepared: Function,
    onEditorPreparing: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onValueChanged: Function,
    rtlEnabled: Boolean,
    tabIndex: Number,
    value: [Array, Function, String],
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowHierarchicalFields": null,
    "update:customOperations": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:fields": null,
    "update:filterOperationDescriptions": null,
    "update:focusStateEnabled": null,
    "update:groupOperationDescriptions": null,
    "update:groupOperations": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:maxGroupLevel": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onEditorPrepared": null,
    "update:onEditorPreparing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:rtlEnabled": null,
    "update:tabIndex": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): FilterBuilder {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = FilterBuilder;
    (this as any).$_expectedChildren = {
      customOperation: { isCollectionItem: true, optionName: "customOperations" },
      field: { isCollectionItem: true, optionName: "fields" },
      filterOperationDescriptions: { isCollectionItem: false, optionName: "filterOperationDescriptions" },
      groupOperationDescriptions: { isCollectionItem: false, optionName: "groupOperationDescriptions" }
    };
  }
});

const DxCustomOperation = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataTypes": null,
    "update:editorTemplate": null,
    "update:hasValue": null,
    "update:icon": null,
    "update:name": null,
  },
  props: {
    calculateFilterExpression: Function,
    caption: String,
    customizeText: Function,
    dataTypes: Array,
    editorTemplate: {},
    hasValue: Boolean,
    icon: String,
    name: String
  }
});
(DxCustomOperation as any).$_optionName = "customOperations";
(DxCustomOperation as any).$_isCollectionItem = true;
const DxField = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:calculateFilterExpression": null,
    "update:caption": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:editorOptions": null,
    "update:editorTemplate": null,
    "update:falseText": null,
    "update:filterOperations": null,
    "update:format": null,
    "update:lookup": null,
    "update:name": null,
    "update:trueText": null,
  },
  props: {
    calculateFilterExpression: Function,
    caption: String,
    customizeText: Function,
    dataField: String,
    dataType: String,
    editorOptions: {},
    editorTemplate: {},
    falseText: String,
    filterOperations: Array,
    format: [Object, Function, String],
    lookup: Object,
    name: String,
    trueText: String
  }
});
(DxField as any).$_optionName = "fields";
(DxField as any).$_isCollectionItem = true;
(DxField as any).$_expectedChildren = {
  format: { isCollectionItem: false, optionName: "format" },
  lookup: { isCollectionItem: false, optionName: "lookup" }
};
const DxFilterOperationDescriptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:between": null,
    "update:contains": null,
    "update:endsWith": null,
    "update:equal": null,
    "update:greaterThan": null,
    "update:greaterThanOrEqual": null,
    "update:isBlank": null,
    "update:isNotBlank": null,
    "update:lessThan": null,
    "update:lessThanOrEqual": null,
    "update:notContains": null,
    "update:notEqual": null,
    "update:startsWith": null,
  },
  props: {
    between: String,
    contains: String,
    endsWith: String,
    equal: String,
    greaterThan: String,
    greaterThanOrEqual: String,
    isBlank: String,
    isNotBlank: String,
    lessThan: String,
    lessThanOrEqual: String,
    notContains: String,
    notEqual: String,
    startsWith: String
  }
});
(DxFilterOperationDescriptions as any).$_optionName = "filterOperationDescriptions";
const DxFormat = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function,
    parser: Function,
    precision: Number,
    type: String,
    useCurrencyAccountingStyle: Boolean
  }
});
(DxFormat as any).$_optionName = "format";
const DxGroupOperationDescriptions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:and": null,
    "update:notAnd": null,
    "update:notOr": null,
    "update:or": null,
  },
  props: {
    and: String,
    notAnd: String,
    notOr: String,
    or: String
  }
});
(DxGroupOperationDescriptions as any).$_optionName = "groupOperationDescriptions";
const DxLookup = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowClearing": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:valueExpr": null,
  },
  props: {
    allowClearing: Boolean,
    dataSource: [Array, Object],
    displayExpr: [Function, String],
    valueExpr: [Function, String]
  }
});
(DxLookup as any).$_optionName = "lookup";

export default DxFilterBuilder;
export {
  DxFilterBuilder,
  DxCustomOperation,
  DxField,
  DxFilterOperationDescriptions,
  DxFormat,
  DxGroupOperationDescriptions,
  DxLookup
};
import type * as DxFilterBuilderTypes from "devextreme/ui/filter_builder_types";
export { DxFilterBuilderTypes };
