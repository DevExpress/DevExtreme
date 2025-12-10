export default (
  currencySymbol: string | undefined,
  accountingFormat: string | undefined,
): string | undefined => {
  if (!accountingFormat) {
    return undefined;
  }

  let encodedCurrencySymbol = currencySymbol;
  if (typeof currencySymbol === 'string') {
    encodedCurrencySymbol = '';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < currencySymbol.length; i += 1) {
      if (currencySymbol[i] !== '$') {
        encodedCurrencySymbol += '\\';
      }
      encodedCurrencySymbol += currencySymbol[i];
    }
  }

  const encodeSymbols = {
    '.00': '{0}',
    '\'': '\\\'',
    '\\(': '\\(',
    '\\)': '\\)',
    ' ': '\\ ',
    '"': '&quot;',
    '\\¤': encodedCurrencySymbol,
  };

  const result = accountingFormat.split(';');
  for (let i = 0; i < result.length; i += 1) {
    // eslint-disable-next-line no-restricted-syntax
    for (const symbol in encodeSymbols) {
      if (Object.prototype.hasOwnProperty.call(encodeSymbols, symbol)) {
        result[i] = result[i].replace(new RegExp(symbol, 'g'), encodeSymbols[symbol]);
      }
    }
  }

  return result.length === 2 ? `${result[0]}_);${result[1]}` : result[0];
};
