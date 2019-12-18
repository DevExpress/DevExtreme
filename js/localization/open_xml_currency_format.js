module.exports = (currencySymbol, accountingFormat) => {
    if(!accountingFormat) {
        return;
    }

    const encodeSymbols = {
        '.00': '{0}',
        '\'': '\\\'',
        '\\(': '\\(',
        '\\)': '\\)',
        ' ': '\\ ',
        '"': '&quot;',
        '\\¤': currencySymbol
    };

    let result = accountingFormat.split(';');
    for(let i = 0; i < result.length; i++) {
        for(let symbol in encodeSymbols) {
            if(Object.prototype.hasOwnProperty.call(encodeSymbols, symbol)) {
                result[i] = result[i].replace(new RegExp(symbol, 'g'), encodeSymbols[symbol]);
            }
        }
    }

    return result.length === 2 ? result[0] + '_);' + result[1] : result[0];
};
