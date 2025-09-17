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
              }, 'city', 'zipcode', 'mobilePhone', 'email',
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
        dataType: 'date',
      },
      {
        dataField: 'hireDate',
        dataType: 'date',
      },
      {
        caption: 'Position',
        dataField: 'title',
      },
      'department',
      'address',
      'mobilePhone',
      'email',
      {
        dataField: 'notes',
        visible: false,
      },
      {
        dataField: 'firstName',
        visible: false,
      },
      {
        dataField: 'lastName',
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
