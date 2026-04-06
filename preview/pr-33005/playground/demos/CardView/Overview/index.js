$(() => {
  $('#card-view').dxCardView({
    dataSource: employees,
    keyExpr: 'ID',
    cardMinWidth: 300,
    cardsPerRow: 'auto',
    paging: {
      pageSize: 4,
    },
    cardCover: {
      imageExpr: ({ First_Name, Last_Name }) => `../../../images/employees/new/${First_Name} ${Last_Name}.jpg`,
      altExpr: ({ First_Name, Last_Name }) => `Photo of ${First_Name} ${Last_Name}`,
    },
    columns: [
      {
        dataField: 'Status',
        fieldValueTemplate({ field: { value } }) {
          return $('<div>')
            .append(
              $('<div>').addClass('indicator'),
            )
            .append(
              $('<div>').text(value),
            )
            .addClass('status')
            .toggleClass('status--salaried', value === 'Salaried')
            .toggleClass('status--commission', value === 'Commission')
            .toggleClass('status--terminated', value === 'Terminated');
        },
        allowSearch: false,
      },
      {
        caption: 'Full Name',
        allowFiltering: true,
        allowSorting: true,
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
        fieldValueTemplate({ field: { value, text } }) {
          return $('<a>')
            .attr('href', `mailto:${value}`)
            .text(text);
        },
        allowSearch: false,
      },
      {
        caption: 'Address',
        allowFiltering: true,
        allowSorting: true,
        calculateFieldValue({ State, City }) {
          return `${City}, ${State}`;
        },
      },
    ],
    cardFooterTemplate() {
      return $('<div>')
        .addClass('card-footer')
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
            icon: 'message',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              DevExpress.ui.notify({
                message: 'The "Send Email" button is clicked.',
                maxWidth: 560,
              });
            },
          }),
        );
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
