$(() => {
  $('#form').dxForm({
    formData: employee,
    items: [{
      itemType: 'group',
      caption: 'Employee Details',
      colCount: 2,
      items: [{
        dataField: 'FirstName',
        editorOptions: {
          disabled: true,
        },
        label: {
          template: labelTemplate('user'),
        },
      }, {
        dataField: 'Position',
        editorType: 'dxSelectBox',
        editorOptions: {
          items: positions,
          searchEnabled: true,
          value: '',
        },
        validationRules: [{
          type: 'required',
          message: 'Position is required',
        }],
        label: {
          template: labelTemplate('info'),
        },
      }, {
        dataField: 'LastName',
        editorOptions: {
          disabled: true,
        },
        label: {
          template: labelTemplate('user'),
        },
      }, {
        dataField: 'HireDate',
        editorType: 'dxDateBox',
        editorOptions: {
          value: null,
          width: '100%',
        },
        validationRules: [{
          type: 'required',
          message: 'Hire date is required',
        }],
        label: {
          template: labelTemplate('event'),
        },
      }, {
        dataField: 'BirthDate',
        editorType: 'dxDateBox',
        editorOptions: {
          disabled: true,
          width: '100%',
        },
        label: {
          template: labelTemplate('event'),
        },
      }, {
        dataField: 'Address',
        label: {
          template: labelTemplate('home'),
        },
      }, {
        colSpan: 2,
        dataField: 'Notes',
        editorType: 'dxTextArea',
        editorOptions: {
          height: 90,
          maxLength: 200,
        },
        label: {
          template: (data, element) => {
            const lineBreak = '<br>';
            const infoIcon = '<i id="helpedInfo" class="dx-icon dx-icon-info"></i>';
            const labelText = `Additional${lineBreak}${data.text}`;

            element.append(`<div id='template-content'>${infoIcon}${labelText}</div>`);

            $('<div>').dxTooltip({
              target: '#helpedInfo',
              showEvent: 'mouseenter',
              hideEvent: 'mouseleave',
              contentTemplate(args) {
                args.html('<div id="tooltip-content">This field must not exceed 200 characters</div>');
              },
            }).appendTo(element);
          },
        },
      }, {
        dataField: 'Phone',
        editorOptions: {
          mask: '+1 (X00) 000-0000',
          maskRules: { X: /[02-9]/ },
        },
        label: {
          template: labelTemplate('tel'),
        },
      }, {
        dataField: 'Email',
        label: {
          template: labelTemplate('email'),
        },
      }],
    }],
  });

  $('#form').dxForm('instance').validate();

  function labelTemplate(iconName) {
    return (data) => $(`<div><i class='dx-icon dx-icon-${iconName}'></i>${data.text}</div>`);
  }
});
