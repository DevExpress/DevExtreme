$(() => {
  const cardView = $('#card-view').dxCardView({
    selection: {
      mode: 'multiple'
    },
    selectedCardKeys: [4, 6],
    dataSource: employees,
    keyExpr: 'ID',
    columns: ['FullName', 'Position', 'Phone', 'Email'],
    cardCover: {
      altExpr: ({ FullName }) => `Photo of ${FullName}`,
      imageExpr: ({ FullName }) => `../../../../images/employees/new/${FullName}.jpg`,
    }
  }).dxCardView('instance');

  function renderOptions() {
    $("#selection-mode").dxSelectBox({
      dataSource: ['single', 'multiple'],
      value: cardView.option('selection.mode'),
      onOptionChanged(e) {
        if (e.name === 'value') {
          cardView.option('selection.mode', e.value);
          cardView.clearSelection();
          renderOptions();
        }
      },
    });

    $("#show-checkboxes-mode").dxSelectBox({
      dataSource: ['always', 'none', 'onClick', 'onLongTap'],
      value: cardView.option('selection.showCheckBoxesMode'),
      onOptionChanged(e) {
        if (e.name === 'value') {
          cardView.option('selection.showCheckBoxesMode', e.value);
          renderOptions();
        }
      },
      disabled: cardView.option('selection.mode') !== 'multiple',
    });
  
    $("#allow-select-all").dxCheckBox({
      value: cardView.option('selection.allowSelectAll'),
      onOptionChanged(e) {
        if (e.name === 'value') {
          cardView.option('selection.allowSelectAll', e.value);
          renderOptions();
        }
      },
      disabled: cardView.option('selection.mode') !== 'multiple',
    });

    $("#select-all-mode").dxSelectBox({
      dataSource: ['allPages', 'page'],
      value: cardView.option('selection.selectAllMode'),
      onOptionChanged(e) {
        if (e.name === 'value') {
          cardView.option('selection.selectAllMode', e.value);
          renderOptions();
        }
      },
      disabled: (
        cardView.option('selection.mode') !== 'multiple' || 
        !cardView.option('selection.allowSelectAll')
      ),
    });
  }

  renderOptions();
});
