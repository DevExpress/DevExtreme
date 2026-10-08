import type { PositionConfig } from '@js/common/core/animation';
import type Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import type {
  CustomOperation, Field, FieldInfo, Properties as FilterBuilderOptions,
} from '@js/ui/filter_builder';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type {
  ContentReadyEvent, ItemClickEvent, ItemRenderedEvent, Properties as TreeViewProperties,
} from '@js/ui/tree_view';
import type { EngineEvent } from '@ts/events/core/events_engine';

export type FieldValue = string | number | boolean | Date | null | undefined;

export type ConditionValue = FieldValue | FieldValue[];

export type FilterCombiner = 'and' | 'or';

export type Condition = [string, string, ...ConditionValue[]];

export type ValueOperand = FieldValue | ValueOperand[];

export type ValueCondition = [string, ValueOperand] | [string, string, ...ValueOperand[]];

export type ValueGroup = [] | [FilterCombiner] | ['!', ValueExpression]
| [ValueExpression, ...(FilterCombiner | ValueExpression)[]];

export type ValueExpression = ValueCondition | ValueGroup;

export type FilterBuilderValue = ValueExpression | null | undefined;

export type Criteria = unknown[];

export type NegationGroup = ['!', Criteria];

export type FilterExpression = ReturnType<NonNullable<CustomOperation['calculateFilterExpression']>>;

export type FilterExpressionCallback = (
  filterValue: unknown,
  selectedFilterOperation: string,
  target?: string,
) => FilterExpression;

type LookupCellValue = (value: ConditionValue) => string;

interface LookupWithoutItems {
  items?: undefined;
  calculateCellValue?: LookupCellValue;
}

interface LookupWithItems {
  items: unknown[];
  calculateCellValue: LookupCellValue;
}

export type FilterBuilderLookup = NonNullable<Field['lookup']> & (LookupWithoutItems | LookupWithItems);

export interface FilterBuilderField extends Field {
  dataField: string;
  calculateFilterExpression?: FilterExpressionCallback;
  createFilterExpression?: FilterExpressionCallback;
  defaultCalculateFilterExpression: FilterExpressionCallback;
  defaultFilterOperation?: string;
  id?: string;
  parentId?: string;
  lookup?: FilterBuilderLookup;
}

export interface FilterBuilderItem extends FilterBuilderField {
  caption: string;
  id: string;
}

export interface FilterCustomOperation extends Omit<CustomOperation, 'name' | 'calculateFilterExpression' | 'customizeText'> {
  name: string;
  customizeText?: (fieldInfo: FieldInfo, options?: { values: FieldValue[] }) => string;
  notForLookup?: boolean;
  valueSeparator?: string;
  calculateFilterExpression?: (
    filterValue: unknown,
    field: Field,
    fields?: Field[],
  ) => FilterExpression | null;
}

export interface ValueTextCustomOperation extends CustomOperation {
  customizeText?: (fieldInfo: FieldInfo, options?: { values: FieldValue[] }) => string;
}

export type LookupField = FilterBuilderField & {
  lookup: NonNullable<FilterBuilderField['lookup']>;
};

export interface OperationMenuItem {
  icon: string;
  text: string;
  value: string;
  isCustom?: boolean;
}

export interface GroupMenuItem {
  text: string;
  value: string;
}

export interface OperationsField {
  dataType?: string;
  defaultFilterOperation?: string;
  filterOperations?: readonly string[] | null;
  lookup?: object | null;
}

export type RangeValue = (string | number | Date | null | undefined)[];

export interface RangeConditionInfo {
  field: Field;
  value?: RangeValue;
  setValue: (value: RangeValue) => void;
}

export interface EditorFactoryOwner {
  _editorFactory: {
    createEditor: (
      this: EditorFactoryOwner,
      container: dxElementWrapper,
      options: object,
    ) => void;
  };
}

export type BetweenOperation = CustomOperation & {
  name: string;
  notForLookup: boolean;
  valueSeparator: string;
};

export interface FilterBuilderProperties extends FilterBuilderOptions {
  fields: Field[];
  closePopupOnTargetScroll: boolean;
}

export type MenuItemEvent<TEvent, TItem> = TEvent & { itemData: TItem };

export type MenuOptions<TItem> = Required<Pick<TreeViewProperties<TItem>, 'items' | 'displayExpr'>>
& Pick<TreeViewProperties<TItem>, 'keyExpr' | 'dataStructure'>
& {
  cssClass: string;
  onItemClick: (e: MenuItemEvent<ItemClickEvent<TItem>, TItem>) => void;
  onItemRendered?: (e: MenuItemEvent<ItemRenderedEvent<TItem>, TItem>) => void;
  onContentReady?: (e: ContentReadyEvent<TItem>) => void;
};

export type MenuPosition = Omit<PositionConfig, 'of'> & { of: dxElementWrapper };

export interface AddMenuItem {
  caption: string;
  click: () => void;
}

export type PopupOptions = Required<Pick<PopupProperties, 'onShown'>>;

export interface ButtonWithMenuOptions<TItem> {
  caption?: string;
  menu: MenuOptions<TItem>;
}

export type ResolvedMenuOptions<TItem> = MenuOptions<TItem>
& Required<Pick<TreeViewProperties<TItem>, 'focusStateEnabled' | 'selectionMode'>>
& Pick<PopupProperties, 'rtlEnabled' | 'onHiding' | 'onHidden'>
& {
  id: Guid;
  position: MenuPosition;
  animation: null;
};

export interface PopupMenuOptions<TItem> {
  menu: ResolvedMenuOptions<TItem>;
  popup: PopupOptions;
}

export type KeyEvent = EngineEvent & {
  key: string;
  shiftKey: boolean;
};

export interface ValueEditorOptions {
  value: ConditionValue;
  filterOperation: string;
  setValue: (data: ConditionValue) => void;
  closeEditor: () => void;
  text: string;
}
