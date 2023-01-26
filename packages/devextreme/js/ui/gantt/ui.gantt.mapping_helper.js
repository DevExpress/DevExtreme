import { compileGetter, compileSetter } from '../../core/utils/data';

const GANTT_TASKS = 'tasks';
const GANTT_MAPPED_FIELD_REGEX = /(\w*)Expr/;

export class GanttMappingHelper {
    constructor(gantt) {
        this._gantt = gantt;
    }

    _getMappedFieldName(optionName, coreField) {
        let coreFieldName = coreField;
        if(coreField === 'id') {
            coreFieldName = 'key';
        }
        return this._gantt.option(`${optionName}.${coreFieldName}Expr`);
    }

    getTaskMappedFieldNames() {
        const mappedFields = [ ];
        const mappedFieldsData = this._gantt.option(GANTT_TASKS);
        for(const field in mappedFieldsData) {
            const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
            const mappedFieldName = exprMatches && mappedFieldsData[exprMatches[0]];
            if(mappedFieldName) {
                mappedFields.push(mappedFieldName);
            }
        }
        return mappedFields;
    }
    convertCoreToMappedData(optionName, coreData) {
        return Object.keys(coreData).reduce((previous, f) => {
            const mappedField = this._getMappedFieldName(optionName, f);
            if(mappedField) {
                const setter = compileSetter(mappedField);
                setter(previous, coreData[f]);
            }
            return previous;
        }, {});
    }
    convertMappedToCoreData(optionName, mappedData) {
        const coreData = {};
        if(mappedData) {
            const mappedFields = this._gantt.option(optionName);
            for(const field in mappedFields) {
                const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
                const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
                if(mappedFieldName && mappedData[mappedFieldName] !== undefined) {
                    const getter = compileGetter(mappedFieldName);
                    const coreFieldName = exprMatches[1];
                    coreData[coreFieldName] = getter(mappedData);
                }
            }
        }
        return coreData;
    }
    convertCoreToMappedFields(optionName, fields) {
        return fields.reduce((previous, f) => {
            const mappedField = this._getMappedFieldName(optionName, f);
            if(mappedField) {
                previous.push(mappedField);
            }
            return previous;
        }, []);
    }
    convertMappedToCoreFields(optionName, fields) {
        const coreFields = [];
        const mappedFields = this._gantt.option(optionName);
        for(const field in mappedFields) {
            const exprMatches = field.match(GANTT_MAPPED_FIELD_REGEX);
            const mappedFieldName = exprMatches && mappedFields[exprMatches[0]];
            if(mappedFieldName && fields.indexOf(mappedFieldName) > -1) {
                const coreFieldName = exprMatches[1];
                coreFields.push(coreFieldName);
            }
        }
        return coreFields;
    }
}
