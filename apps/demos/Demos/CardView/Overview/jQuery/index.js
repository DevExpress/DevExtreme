$(() => {
  const cardView = $('#card-view').dxCardView({
    dataSource: employees,
    keyExpr: 'ID',
    cardMinWidth: 250,
    cardsPerRow: 'auto',
    cardCover: {
      imageExpr: ({ First_Name, Last_Name }) => `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`,
      altExpr: ({ First_Name, Last_Name }) => `Photo of ${First_Name} ${Last_Name}`,
    },
    columns: [
      {
        dataField: 'Status',
        fieldValueTemplate({ field: { value } }) {
          return $('<div>')
            .append($('<span>').addClass('indicator'))
            .append($('<span>').text(value))
            .addClass(
              value === 'Salaried'
                ? 'status-ok'
                : 'status-warning'
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
      {
        dataField: 'Head_ID',
        caption: 'Assigned To',
        calculateDisplayValue({ Head_ID }) {
          const assignedTo = employees
            .find((employee) => employee.ID === Head_ID)

          if (!assignedTo) {
            return 'None';
          }

          return `${assignedTo.First_Name} ${assignedTo.Last_Name}`;
        },
        fieldValueTemplate({ field: { value, text } }) {
          if (!value) {
            return text
          }

          return $('<a>')
            .text(text)
            .addClass('dx-link')
            .on('click', async (e) => {
              $('.card-highlight').removeClass('card-highlight');

              const index = employees.findIndex(
                (employee) => employee.ID === value,
              );

              const pageIndex = Math.floor(index / cardView.pageSize());
              await cardView.pageIndex(pageIndex);

              const cardIndex = cardView.getCardIndexByKey(value);
              const cardElement = cardView.getCardElement(cardIndex)
              cardElement.focus();
              cardElement.addClass('card-highlight');
            });
        }
      },
      'Mobile_Phone',
      'Email',
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
              DevExpress.ui.notify('The "Call" button is clicked.');
            },
          }),
          $('<div>').dxButton({
            text: 'Send Email',
            icon: 'send',
            type: 'default',
            stylingMode: 'contained',
            onClick() {
              DevExpress.ui.notify('The "Send Email" button is clicked.');
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
