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
        <div class="dx-step-caption">
          <div class="dx-step-label">${data.label}</div>
          ${data.optional ? '<div class="dx-step-optional-mark">(Optional)</div>' : ''}
        </div>`;
    },
  });

  $('#labelOnly').dxStepper({
    selectedIndex: 2,
    dataSource,
    linear: false,
    elementAttr: { 'aria-labelledby': 'label-labelOnly' },
    itemTemplate(data) {
      return `<div class='dx-step-caption'>
        <div class='dx-step-label'>${data.label}</div>
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
