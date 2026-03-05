$(() => {
  $('#card-view').dxCardView({
    dataSource: employees,
    keyExpr: 'id',
    cardsPerRow: 'auto',
    cardMinWidth: 350,
    height: 840,
    cardCover: {
      imageExpr: ({ picture }) => picture,
      altExpr: ({ fullName }) => `Photo of ${fullName}`,
    },
    editing: {
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
      popup: {
        title: 'Employee Info',
        showTitle: true,
        width: 700,
        height: 525,
      },
      form: {
        items: [
          {
            caption: 'Personal Data',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['firstName', 'lastName', 'birthDate', 'picture'],
          }, {
            caption: 'Main Info',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: ['hireDate', 'title', 'department', {
              dataField: 'notes',
              editorType: 'dxTextArea',
              colSpan: 2,
              editorOptions: {
                height: 100,
              },
            }],
          }, {
            caption: 'Contacts',
            itemType: 'group',
            colCount: 2,
            colSpan: 2,
            items: [
              {
                dataField: 'address',
                colSpan: 2,
              }, 'city', 'zipcode', {
                dataField: 'mobilePhone',
                editorOptions: {
                  mask: '+0 (000) 000-0000',
                  useMaskedValue: true,
                },
              }, 'email',
            ],
          },
        ],
      },
    },
    searchPanel: {
      visible: true,
    },
    columns: [
      {
        caption: 'Full Name',
        calculateFieldValue({ firstName, lastName }) {
          return `${firstName} ${lastName}`;
        },
      },
      {
        dataField: 'birthDate',
        validationRules: [{ type: 'required' }],
        dataType: 'date',
      },
      {
        dataField: 'hireDate',
        validationRules: [
          { type: 'required' },
          {
            type: 'custom',
            message: 'Hire date cannot be earlier than birth date',
            validationCallback(params) {
              return new Date(params.value) > new Date(params.data.birthDate);
            },
          },
        ],
        dataType: 'date',
      },
      {
        caption: 'Position',
        validationRules: [{ type: 'required' }],
        dataField: 'title',
      },
      'department',
      'address',
      {
        dataField: 'mobilePhone',
        validationRules: [{
          type: 'required',
        }],
      },
      {
        dataField: 'email',
        validationRules: [{
          type: 'email',
        }, {
          type: 'async',
          message: 'Email address is not unique',
          ignoreEmptyValue: true,
          validationCallback(params) {
            return $.ajax({
              url: 'https://js.devexpress.com/Demos/NetCore/RemoteValidation/CheckUniqueEmailAddress',
              type: 'GET',
              dataType: 'json',
              data: {
                id: params.data.id,
                email: params.value,
              },
            });
          },
        }],
      },
      {
        dataField: 'notes',
        visible: false,
      },
      {
        dataField: 'firstName',
        validationRules: [{ type: 'required' }],
        visible: false,
      },
      {
        dataField: 'lastName',
        validationRules: [{ type: 'required' }],
        visible: false,
      },
      {
        dataField: 'city',
        visible: false,
      },
      {
        dataField: 'zipcode',
        visible: false,
      },
      {
        dataField: 'picture',
        visible: false,
      },
    ],
  });
});
