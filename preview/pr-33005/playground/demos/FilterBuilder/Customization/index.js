$(() => {
  $('#filterBuilder').dxFilterBuilder({
    fields,
    value: filter,
    maxGroupLevel: 1,
    groupOperations: ['and', 'or'],
    onValueChanged: updateTexts,
    onInitialized: updateTexts,
    customOperations: [{
      name: 'anyof',
      caption: 'Is any of',
      icon: 'check',
      editorTemplate(conditionInfo) {
        return $('<div>').dxTagBox({
          value: conditionInfo.value,
          items: categories,
          inputAttr: { 'aria-label': 'Category' },
          onValueChanged(e) {
            conditionInfo.setValue(e.value && e.value.length ? e.value : null);
          },
          width: 'auto',
        });
      },
      calculateFilterExpression(filterValue, field) {
        return filterValue && filterValue.length
                    && Array.prototype.concat.apply([], filterValue.map((value) => [[field.dataField, '=', value], 'or'])).slice(0, -1);
      },
    }],
  });

  function updateTexts(e) {
    $('#filterText').text(formatValue(e.component.option('value')));
    $('#dataSourceText').text(formatValue(e.component.getFilterExpression()));
  }

  function formatValue(value, spaces = TAB_SIZE) {
    if (value && Array.isArray(value[0])) {
      return `[${getLineBreak(spaces)}${value.map((item) => (Array.isArray(item[0]) ? formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item))).join(`,${getLineBreak(spaces)}`)}${getLineBreak(spaces - TAB_SIZE)}]`;
    }
    return JSON.stringify(value);
  }

  function getLineBreak(spaces) {
    return `\r\n${new Array(spaces + 1).join(' ')}`;
  }
});
