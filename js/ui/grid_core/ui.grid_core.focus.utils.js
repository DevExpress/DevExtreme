import { isDate, isFunction } from '../../core/utils/type';
import dateSerialization from '../../core/utils/date_serialization';

// TODO Vinogradov: Move it to ts and cover with unit tests.
const getSortFilterValue = (
    sortInfo,
    rowData,
    {
        isRemoteFiltering,
        dateSerializationFormat,
        getSelector,
    }) => {
    const { selector } = sortInfo;
    const getter = isFunction(selector)
        ? selector
        : getSelector(selector);

    const rawValue = getter ? getter(rowData) : rowData[selector];
    const safeValue = isRemoteFiltering && isDate(rawValue)
        ? dateSerialization.serializeDate(rawValue, dateSerializationFormat)
        : rawValue;

    return {
        getter,
        rawValue,
        safeValue,
    };
};

export const UiGridCoreFocusUtils = {
    getSortFilterValue,
};
