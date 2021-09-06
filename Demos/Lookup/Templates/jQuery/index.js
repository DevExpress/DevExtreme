$(() => {
  $('#lookupFieldTemplateOption').dxLookup({
    items: employees,
    displayExpr: getDisplayExpr,
    dropDownOptions: {
      title: 'Select employee',
    },
    valueExpr: 'ID',
    value: employees[0].ID,
    fieldTemplate(data) {
      return getTemplateMarkup(data, 'custom-field');
    },
  });

  $('#lookupItemTemplateOptions').dxLookup({
    items: employees,
    searchExpr: ['FirstName', 'LastName', 'Prefix'],
    valueExpr: 'ID',
    displayExpr: getDisplayExpr,
    dropDownOptions: {
      title: 'Select employee',
    },
    placeholder: 'Select employee',
    itemTemplate(data) {
      return getTemplateMarkup(data, 'custom-item');
    },
  });

  function getTemplateMarkup(data, containerClass) {
    return `<div class='${containerClass}'><img src='${
      data.Picture}' /><div>${data.Prefix} ${
      data.FirstName} ${data.LastName}</div></div>`;
  }

  function getDisplayExpr(item) {
    if (!item) {
      return '';
    }

    return `${item.FirstName} ${item.LastName}`;
  }
});
