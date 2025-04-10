$(() => {
  $('#customStepShape').dxStepper({
    selectedIndex: 2,
    dataSource,
    linear: false,
    elementAttr: { 'aria-labelledby': 'label-customStepShape' },
    itemTemplate(data) {
      return `<div class="dx-step-indicator">
          <i class="dx-icon dx-icon-${data.icon}"></i>
        </div>
        <div class="dx-step-label">
          <div class="dx-step-title">${data.title}</div>
          ${data.optional ? '<div class="dx-step-optional-mark">(Optional)</div>' : ''}
        </div>`;
    },
  });

  $('#titleOnly').dxStepper({
    selectedIndex: 2,
    dataSource,
    linear: false,
    elementAttr: { 'aria-labelledby': 'label-titleOnly' },
    itemTemplate(data) {
      return `<div class='dx-step-label'>
        <div class='dx-step-title'>${data.title}</div>
      </div>`;
    },
  });

  $('#iconOnly').dxStepper({
    selectedIndex: 2,
    dataSource,
    linear: false,
    elementAttr: { 'aria-labelledby': 'label-iconOnly' },
    itemTemplate(data) {
      return `<i class="dx-icon dx-icon-${data.icon}"></i>`;
    },
  });
});
