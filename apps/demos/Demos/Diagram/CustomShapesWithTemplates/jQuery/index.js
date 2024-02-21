$(() => {
  $('#diagram').dxDiagram({
    readOnly: true,
    customShapes: employees.map(
      (emp) => ({
        type: `employee${emp.ID}`,
        baseType: 'rectangle',
        defaultWidth: 1.5,
        defaultHeight: 1,
        allowEditText: false,
        allowResize: false,
      }),
    ),
    customShapeTemplate(item, $container) {
      const employee = item.dataItem;
      const $content = $(`${"<svg class='template'>"
                + "<text class='template-name' x='50%' y='20%'>"}${employee.Full_Name}</text>`
                + `<text class='template-title' x='50%' y='45%'>${employee.Title}</text>`
                + '<text class=\'template-button\' x=\'50%\' y=\'85%\'>Show Details</text>'
                + '</svg >');
      $container.append($content);
      $content.find('.template-button').click(() => {
        showInfo(employee);
      });
    },
    nodes: {
      dataSource: new DevExpress.data.ArrayStore({
        key: 'ID',
        data: employees,
      }),
      keyExpr: 'ID',
      typeExpr(obj) { return `employee${obj.ID}`; },
      parentKeyExpr: 'Head_ID',
      autoLayout: {
        type: 'tree',
      },
    },
  }).dxDiagram('instance');

  let currentEmployee = {};
  let popup = null;
  const popupOptions = {
    width: 300,
    height: 280,
    contentTemplate() {
      return $('<div />').append(
        $(`<p>Full Name: <b>${currentEmployee.Full_Name}</b></p>`),
        $(`<p>Title: <b>${currentEmployee.Title}</b></p>`),
        $(`<p>City: <b>${currentEmployee.City}</b></p>`),
        $(`<p>State: <b>${currentEmployee.State}</b></p>`),
        $(`<p>Email: <b>${currentEmployee.Email}</b></p>`),
        $(`<p>Skype: <b>${currentEmployee.Skype}</b></p>`),
        $(`<p>Mobile Phone: <b>${currentEmployee.Mobile_Phone}</b></p>`),
      );
    },
    showTitle: true,
    title: 'Information',
    visible: false,
    dragEnabled: false,
    hideOnOutsideClick: true,
  };

  const showInfo = function (data) {
    currentEmployee = data;

    if (popup) {
      popup.option('contentTemplate', popupOptions.contentTemplate.bind(this));
    } else {
      popup = $('#popup').dxPopup(popupOptions).dxPopup('instance');
    }

    popup.show();
  };
});
