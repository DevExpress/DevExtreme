$(() => {
  const cardView = $('#card-view').dxCardView({
    dataSource: employees,
    keyExpr: 'ID',
    cardMinWidth: 100,
    cardsPerRow: 'auto',
    wordWrapEnabled: true,
    cardCover: {
      imageExpr: ({ First_Name, Last_Name }) => `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`,
      altExpr: ({ First_Name, Last_Name }) => `Photo of ${First_Name} ${Last_Name}`,
    },
    columns: [
      {
        dataField: 'Status',
        fieldValueTemplate({ field: { value } }) {
          return $('<div>')
            .append($('<div>').addClass('indicator'))
            .append($('<div>').text(value))
            .addClass('status')
            .addClass(
              value === 'Salaried'
                ? 'status--ok'
                : 'status--warning'
            );
        }
      },
      {
        caption: 'Full Name',
        calculateFieldValue({ First_Name, Last_Name }) {
          return `${First_Name} ${Last_Name}`;
        },
      },
      {
        caption: 'Position',
        dataField: 'Title',
      },
      'Department',
      'Mobile_Phone',
      {
        dataField: 'Email',
        fieldValueTemplate({ field: { value, text }}) {
          return $('<a>')
            .attr('href', `mailto:${value}`)
            .text(text);
        }
      },
      {
        caption: 'Address',
        calculateFieldValue({ State, City }) {
          return `${City}, ${State}`;
        }
      },
    ],
    cardFooterTemplate() {
      return $('<div>')
        .addClass('footer')
        .append(
          $('<div>').dxButton({
            text: 'Call',
            icon: 'tel',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              DevExpress.ui.notify({
                message: 'The "Call" button is clicked.',
                maxWidth: 560,
              });
            },
          }),
          $('<div>').dxButton({
            text: 'Send Email',
            icon: 'send',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              DevExpress.ui.notify({
                message: 'The "Send Email" button is clicked.',
                maxWidth: 560,
              });
            },
          }),
        )
    },
    selection: {
      mode: 'multiple',
    },
    headerFilter: {
      visible: true,
    },
    searchPanel: {
      visible: true,
    },
  }).dxCardView('instance');
});
