/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { compileGetter } from '@js/core/utils/data';
import type Gantt from '@ts/ui/gantt/ui.gantt';
import { GanttDataCache } from '@ts/ui/gantt/ui.gantt.cache';
import { GanttHelper } from '@ts/ui/gantt/ui.gantt.helper';
import type { GanttMappingHelper } from '@ts/ui/gantt/ui.gantt.mapping_helper';

const GANTT_TASKS = 'tasks';

export class GanttCustomFieldsManager {
  _gantt: Gantt;

  _mappingHelper: GanttMappingHelper;

  cache: GanttDataCache;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
    // @ts-expect-error ts-error
    this._mappingHelper = gantt._mappingHelper;
    this.cache = new GanttDataCache();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getTaskCustomFields() {
    const { columns } = this._gantt.option();
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const columnFields = columns?.map((c) => c.dataField);
    const mappedFields = this._mappingHelper.getTaskMappedFieldNames();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return columnFields
      // @ts-expect-error ts-error
      ? columnFields.filter((f) => !mappedFields.includes(f))
      : [];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getCustomFieldsData(data) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getTaskCustomFields().reduce((previous, field) => {
      if (data && data[field] !== undefined) {
        previous[field] = data[field];
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return previous;
    }, {});
  }

  addCustomFieldsData(key, data): void {
    if (data) {
      // @ts-expect-error ts-error
      const modelData = this._gantt._tasksOption?._getItems();
      const keyGetter = compileGetter(
        // @ts-expect-error ts-error
        this._gantt.option(`${GANTT_TASKS}.keyExpr`),
      );
      // @ts-expect-error ts-error
      const modelItem = modelData?.filter((obj) => keyGetter(obj) === key)[0];
      const customFields = this._getTaskCustomFields();
      if (modelItem) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < customFields.length; i += 1) {
          const field = customFields[i];
          // eslint-disable-next-line max-depth
          if (Object.prototype.hasOwnProperty.call(modelItem, field)) {
            data[field] = modelItem[field];
          }
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  appendCustomFields(data) {
    // @ts-expect-error ts-error
    const modelData = this._gantt._tasksOption?._getItems();
    const keyGetter = this._gantt._getTaskKeyGetter();
    const invertedData = GanttHelper.getInvertedData(modelData, keyGetter);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data.reduce((previous, item) => {
      // @ts-expect-error ts-error
      const key = keyGetter(item);
      const modelItem = invertedData[key];
      if (!modelItem) {
        previous.push(item);
      } else {
        const updatedItem = {};
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const field in modelItem) {
          updatedItem[field] = Object.prototype.hasOwnProperty.call(item, field)
            ? item[field]
            : modelItem[field];
        }
        previous.push(updatedItem);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return previous;
    }, []);
  }

  addCustomFieldsDataFromCache(key, data): void {
    this.cache.pullDataFromCache(key, data);
  }

  saveCustomFieldsDataToCache(
    key,
    data,
    forceUpdateOnKeyExpire = false,
    isCustomFieldsUpdateOnly = false,
  ): void {
    const customFieldsData = this._getCustomFieldsData(data);
    if (Object.keys(customFieldsData).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const updateCallback = (key, data): void => {
        const dataOption = this._gantt[`_${GANTT_TASKS}Option`];
        if (dataOption && data) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          dataOption.update(key, data, (data, key): void => {
            const updatedCustomFields = {};
            this.addCustomFieldsData(key, updatedCustomFields);
            // eslint-disable-next-line @typescript-eslint/no-shadow
            dataOption._reloadDataSource().done((data): void => {
              this._gantt._ganttTreeList?.updateDataSource(
                data ?? dataOption._dataSource,
                false,
                isCustomFieldsUpdateOnly,
              );
            });
            const selectedRowKey = this._gantt.option('selectedRowKey');
            this._gantt._ganttView?._selectTask(selectedRowKey);
            this._gantt._actionsManager?.raiseUpdatedAction(
              GANTT_TASKS,
              updatedCustomFields,
              key,
            );
          });
        }
      };
      this.cache.saveData(
        key,
        customFieldsData,
        forceUpdateOnKeyExpire ? updateCallback : null,
      );
    }
  }

  resetCustomFieldsDataCache(key): void {
    this.cache.resetCache(key);
  }
}
