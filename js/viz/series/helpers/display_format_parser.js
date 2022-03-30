import { formatDate, formatNumber } from '../../../localization';

const startPlaceHolderChar = '{';
const endPlaceHolderChar = '}';
const placeholderFormatDelimiter = ':';

function formatValue(value, format) {
    if(format) {
        if(value instanceof Date) { return formatDate(value, format); }
        if(typeof value === 'number') { return formatNumber(value, format); }
    }
    return value;
}

function getValueByPlaceHolder(placeHolder, pointInfo) {
    let customFormat = '';
    const customFormatIndex = placeHolder.indexOf(placeholderFormatDelimiter);
    if(customFormatIndex > 0) {
        customFormat = placeHolder.substr(customFormatIndex + 1);
        placeHolder = placeHolder.substr(0, customFormatIndex);
    }
    return formatValue(pointInfo[placeHolder], customFormat);
}

export function processDisplayFormat(displayFormat, pointInfo) {
    let actualText = displayFormat;
    let continueProcess = true;

    while(continueProcess) {
        const startBracketIndex = actualText.indexOf(startPlaceHolderChar);
        const endBracketIndex = actualText.indexOf(endPlaceHolderChar);

        if(startBracketIndex >= 0 && endBracketIndex > 0) {
            const placeHolder = actualText.substring(startBracketIndex + 1, endBracketIndex);
            const value = getValueByPlaceHolder(placeHolder, pointInfo);
            actualText = actualText.substr(0, startBracketIndex) + value + actualText.substr(endBracketIndex + 1);
        } else {
            continueProcess = false;
        }
    }
    return actualText;
}
