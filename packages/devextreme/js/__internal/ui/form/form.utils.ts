import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import type { GroupItem, SimpleItem, TabbedItem } from '@js/ui/form';
import type { PreparedItem, TabItem } from '@ts/ui/form/form.items_runtime_info';
import type { ConvertToLayoutManagerOptionsParams, LayoutManagerProperties } from '@ts/ui/form/form.layout_manager';

export const createItemPathByIndex = (
  index: number,
  isTabs: boolean | undefined,
): string => `${isTabs ? 'tabs' : 'items'}[${index}]`;

export const concatPaths = (
  path1: string | undefined,
  path2: string | undefined,
): string | undefined => {
  if (isDefined(path1) && isDefined(path2)) {
    return `${path1}.${path2}`;
  }
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return path1 || path2;
};

export const getTextWithoutSpaces = (text: string | undefined): string | undefined => (text ? text.replace(/\s/g, '') : undefined);

export const isEqualToDataFieldOrNameOrTitleOrCaption = (
  item: PreparedItem,
  fieldName: string,
): boolean => {
  if (item) {
    return (item as SimpleItem).dataField === fieldName
      || item.name === fieldName
      || getTextWithoutSpaces((item as TabItem).title) === fieldName
      || (item.itemType === 'group' && getTextWithoutSpaces((item as GroupItem).caption) === fieldName);
  }
  return false;
};

export const getFullOptionName = (
  path: string,
  optionName: string | undefined,
): string => `${path}.${optionName}`;

export const getOptionNameFromFullName = (fullName: string): string => {
  const parts = fullName.split('.');
  return parts[parts.length - 1].replace(/\[\d+]/, '');
};

export const isFullPathContainsTabs = (fullPath: string): boolean => fullPath.includes('tabs');

export const tryGetTabPath = (fullPath: string): string => {
  const pathParts = fullPath.split('.');
  const resultPathParts = [...pathParts];

  for (let i = pathParts.length - 1; i >= 0; i -= 1) {
    if (isFullPathContainsTabs(pathParts[i])) {
      return resultPathParts.join('.');
    }
    resultPathParts.splice(i, 1);
  }
  return '';
};

export const getItemPath = (
  items: PreparedItem[],
  item: PreparedItem | null,
  isTabs?: boolean,
): string => {
  if (!item) {
    return '';
  }

  const index = items.indexOf(item);
  if (index > -1) {
    return createItemPathByIndex(index, isTabs);
  }
  for (let i = 0; i < items.length; i += 1) {
    const targetItem = items[i];

    const tabOrGroupItems = (targetItem as TabbedItem).tabs ?? targetItem.items;
    if (tabOrGroupItems) {
      const itemPath = getItemPath(tabOrGroupItems, item, !!(targetItem as TabbedItem).tabs);
      if (itemPath) {
        return concatPaths(createItemPathByIndex(i, isTabs), itemPath) ?? '';
      }
    }
  }

  return '';
};

export function convertToLayoutManagerOptions({
  form,
  $formElement,
  formOptions,
  items,
  validationGroup,
  extendedLayoutManagerOptions,
  onFieldDataChanged,
  onContentReady,
  onDisposing,
  onFieldItemRendered,
}: ConvertToLayoutManagerOptionsParams): LayoutManagerProperties {
  const baseOptions: LayoutManagerProperties = {
    form,
    items,
    $formElement,
    validationGroup,
    // @ts-expect-error ts-error
    onFieldDataChanged,
    onContentReady,
    onDisposing,
    onFieldItemRendered,
    validationBoundary: formOptions.scrollingEnabled ? $formElement : undefined,
    scrollingEnabled: formOptions.scrollingEnabled,
    showRequiredMark: formOptions.showRequiredMark,
    showOptionalMark: formOptions.showOptionalMark,
    requiredMark: formOptions.requiredMark,
    optionalMark: formOptions.optionalMark,
    requiredMessage: formOptions.requiredMessage,
    screenByWidth: formOptions.screenByWidth,
    layoutData: formOptions.formData,
    labelLocation: formOptions.labelLocation,
    customizeItem: formOptions.customizeItem,
    minColWidth: formOptions.minColWidth,
    showColonAfterLabel: formOptions.showColonAfterLabel,
    onEditorEnterKey: formOptions.onEditorEnterKey,
    labelMode: formOptions.labelMode,
  };

  // cannot use '=' because 'extend' makes special assingment
  const result: LayoutManagerProperties = extend(baseOptions, {
    isRoot: extendedLayoutManagerOptions.isRoot,
    colCount: extendedLayoutManagerOptions.colCount,
    alignItemLabels: extendedLayoutManagerOptions.alignItemLabels,
    cssItemClass: extendedLayoutManagerOptions.cssItemClass,
    colCountByScreen: extendedLayoutManagerOptions.colCountByScreen,
    onLayoutChanged: extendedLayoutManagerOptions.onLayoutChanged,
    width: extendedLayoutManagerOptions.width,
  });
  return result;
}
