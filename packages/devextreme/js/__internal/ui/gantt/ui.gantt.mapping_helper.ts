/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { isFunction } from '@js/core/utils/type';
import type Gantt from '@ts/ui/gantt/ui.gantt';

const GANTT_TASKS = 'tasks';
const GANTT_MAPPED_FIELD_REGEX = /(\w*)Expr/;

export class GanttMappingHelper {
  _gantt: Gantt;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getMappedFieldName(optionName, coreField) {
    let coreFieldName = coreField;
    if (coreField === 'id') {
      coreFieldName = 'key';
    }
    return this._gantt.option(`${optionName}.${coreFieldName}Expr`);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskMappedFieldNames() {
    const mappedFields = [];
    const mappedFieldsData = this._gantt.option(GANTT_TASKS);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in mappedFieldsData) {
      const exprMatches = GANTT_MAPPED_FIELD_REGEX.exec(field);
      const mappedFieldName = exprMatches && mappedFieldsData[exprMatches[0]];
      if (mappedFieldName) {
        // @ts-expect-error ts-error
        mappedFields.push(mappedFieldName);
      }
    }
    return mappedFields;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  convertCoreToMappedData(optionName, coreData) {
    return Object.keys(coreData).reduce((previous, f) => {
      const mappedField = this._getMappedFieldName(optionName, f);
      if (mappedField && !isFunction(mappedField)) {
        // @ts-expect-error ts-error
        const setter = compileSetter(mappedField);
        // @ts-expect-error ts-error
        setter(previous, coreData[f]);
      }
      return previous;
    }, {});
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  convertMappedToCoreData(optionName, mappedData) {
    const coreData = {};
    if (mappedData) {
      const mappedFields = this._gantt.option(optionName);
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const field in mappedFields) {
        const exprMatches = GANTT_MAPPED_FIELD_REGEX.exec(field);
        const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
        if (mappedFieldName && mappedData[mappedFieldName] !== undefined) {
          const getter = compileGetter(mappedFieldName);
          const coreFieldName = exprMatches[1];
          // @ts-expect-error ts-error
          coreData[coreFieldName] = getter(mappedData);
        }
      }
    }
    return coreData;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  convertCoreToMappedFields(optionName, fields) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fields.reduce((previous, f) => {
      const mappedField = this._getMappedFieldName(optionName, f);
      if (mappedField) {
        previous.push(mappedField);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return previous;
    }, []);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  convertMappedToCoreFields(optionName, fields) {
    const coreFields = [];
    const mappedFields = this._gantt.option(optionName);
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const field in mappedFields) {
      const exprMatches = GANTT_MAPPED_FIELD_REGEX.exec(field);
      const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
      if (mappedFieldName && fields.indexOf(mappedFieldName) > -1) {
        const coreFieldName = exprMatches[1];
        // @ts-expect-error ts-error
        coreFields.push(coreFieldName);
      }
    }
    return coreFields;
  }
}
