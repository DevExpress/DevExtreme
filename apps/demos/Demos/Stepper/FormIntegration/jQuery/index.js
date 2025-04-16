$(() => {
  const stepsCount = initialSteps.length;
  const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];
  let confirmed = false;
  let formData = getInitialFormData();

  const setSelectedIndex = (index) => {
    stepper.option('selectedIndex', index);
  };

  const confirm = () => {
    confirmed = true;

    prevButton.option('visible', false);
    nextButton.option('text', 'Reset');
    setStepValidationResult(stepsCount - 1, true);
    $('.current-step').text('');
  };

  const setStepValidationResult = (index, isValid) => {
    stepper.option(`items[${index}].isValid`, isValid);
  };

  const moveNext = (selectedIndex) => {
    const isValid = getValidationResult(selectedIndex);

    setStepValidationResult(selectedIndex, isValid);

    if (isValid) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const resetStepperState = () => {
    stepper.beginUpdate();

    stepper.option('selectedIndex', 0);

    for (let i = 0; i < stepsCount; i += 1) {
      setStepValidationResult(i, undefined);
    }

    stepper.endUpdate();
  };

  const reset = () => {
    confirmed = false;

    resetStepperState();
    formData = getInitialFormData();
    stepContent.option('items', multiViewItems);
    $('.current-step').append(`Step <span class="selected-index">1</span> of <span class="step-count">${stepsCount}</span>`);
  };

  const prevButton = $('#prevButton').dxButton({
    text: 'Back',
    type: 'normal',
    width: 100,
    onClick: () => {
      const selectedIndex = stepper.option('selectedIndex');

      setSelectedIndex(selectedIndex - 1);
    },
    visible: false,
  }).dxButton('instance');

  const nextButton = $('#nextButton').dxButton({
    text: 'Next',
    type: 'default',
    width: 100,
    onClick: () => {
      const selectedIndex = stepper.option('selectedIndex');

      if (selectedIndex < stepsCount - 1) {
        moveNext(selectedIndex);
      } else if (confirmed) {
        reset();
      } else {
        confirm();
      }

      if (stepper.option('selectedIndex') === stepsCount - 1) {
        stepContent.option('items[4].template', getConfirmationTemplate());
      }
    },
  }).dxButton('instance');

  const getValidationResult = (index) => {
    if (index >= validationGroups.length) {
      return true;
    }

    return DevExpress.validationEngine.validateGroup(validationGroups[index]).isValid;
  };

  const stepper = $('#stepper').dxStepper({
    items: initialSteps,
    onSelectionChanged(e) {
      const selectedIndex = e.component.option('selectedIndex');
      const isLastStep = selectedIndex === stepsCount - 1;

      prevButton.option('visible', !!selectedIndex);
      nextButton.option('text', isLastStep ? 'Confirm' : 'Next');
      stepContent.option('selectedIndex', selectedIndex);
      $('.selected-index').text(selectedIndex + 1);
    },
    onSelectionChanging(args) {
      if (confirmed) {
        args.cancel = true;

        return;
      }

      const { component, addedItems, removedItems } = args;
      const { items = [] } = component.option();

      const addedIndex = items.findIndex((item) => item === addedItems[0]);
      const removedIndex = items.findIndex((item) => item === removedItems[0]);
      const isMoveForward = addedIndex > removedIndex;

      if (isMoveForward) {
        const isValid = getValidationResult(removedIndex);

        setStepValidationResult(removedIndex, isValid);

        if (isValid === false) {
          args.cancel = true;
        }
      }
    },
  }).dxStepper('instance');

  const getDatesForm = () => () => $('<div>').append(
    $('<p>').text('Select your check-in and check-out dates. If your dates are flexible, include that information in Additional Requests. We will do our best to suggest best pricing options, depending on room availability.'),
    $('<div>').dxForm({
      formData,
      validationGroup: validationGroups[0],
      items: [{
        dataField: 'dates',
        editorType: 'dxDateRangeBox',
        editorOptions: {
          elementAttr: { id: 'datesPicker' },
          startDatePlaceholder: 'Check-in',
          endDatePlaceholder: 'Check-out',
        },
        isRequired: true,
        label: { visible: false },
        validationRules: [{ type: 'required' }],
      }],
    }),
  );

  const getGuestsForm = () => () => {
    const getNumberBoxOptions = (options) => ({
      editorType: 'dxNumberBox',
      ...options,
      editorOptions: {
        showSpinButtons: true,
        min: 0,
        max: 5,
        ...options.editorOptions,
      },
      label: {
        location: 'top',
        ...options.label,
      },
    });

    return $('<div>').append(
      $('<p>').text('Enter the number of adults, children, and pets staying in the room. This information help us suggest suitable room types, number of beds, and included amenities.'),
      $('<div>').dxForm({
        formData,
        validationGroup: validationGroups[1],
        colCount: 3,
        colCountByScreen: { xs: 3 },
        items: [
          getNumberBoxOptions({
            dataField: 'adultsCount',
            isRequired: true,
            label: { text: 'Adults' },
            editorOptions: {
              elementAttr: { id: 'adultsCount' },
            },
            validationRules: [{
              type: 'range',
              min: 1,
            }],
          }),
          getNumberBoxOptions({
            dataField: 'childrenCount',
            label: { text: 'Children' },
          }),
          getNumberBoxOptions({
            dataField: 'petsCount',
            label: { text: 'Pets' },
          }),
        ],
      }),
    );
  };

  const getRoomAndMealForm = () => () => {
    const getSelectBoxOptions = (options) => ({
      editorType: 'dxSelectBox',
      isRequired: true,
      validationRules: [{ type: 'required' }],
      ...options,
      label: {
        location: 'top',
        ...options.label,
      },
    });

    return $('<div>').append(
      $('<p>').text('Review room types that can accommodate your group size and make your selection. You can also choose a meal plan, whether it\'s breakfast only or full board.'),
      $('<div>').dxForm({
        formData,
        validationGroup: validationGroups[2],
        colCount: 2,
        colCountByScreen: { xs: 2 },
        items: [
          getSelectBoxOptions({
            dataField: 'roomType',
            editorOptions: {
              items: roomTypes,
              elementAttr: { id: 'roomType' },
            },
            label: { text: 'Room Type' },
          }),
          getSelectBoxOptions({
            dataField: 'mealPlan',
            editorOptions: {
              items: mealPlans,
              elementAttr: { id: 'mealPlan' },
            },
            label: { text: 'Meal Plan' },
          }),
        ],
      }),
    );
  };

  const getAdditionalRequestsForm = () => () => $('<div>').append(
    $('<div>').text('Please let us know if you have any other requests.'),
    $('<div>').dxForm({
      formData,
      items: [
        {
          dataField: 'additionalRequest',
          editorType: 'dxTextArea',
          editorOptions: {
            height: 160,
            elementAttr: { id: 'additionalRequest' },
          },
          label: { visible: false },
        },
      ],
    }),
  );

  const getConfirmationTemplate = () => () => {
    if (confirmed) {
      return '<div class="summary-item-header center">Your booking request was submitted.</div>';
    }

    const summaryContainer = $('<div class="summary-container">');

    const datesData = $(`
      <div class="summary-item">
        <div class="summary-item-header">Dates</div>
        <div class="separator"></div>
        <div><span class="summary-item-label">Check-in Date: </span>${new Date(formData.dates[0]).toLocaleDateString()}</div>
        <div><span class="summary-item-label">Check-out Date: </span>${new Date(formData.dates[1]).toLocaleDateString()}</div>
      </div>
    `);

    const guestsData = $(`
      <div class="summary-item">
        <div class="summary-item-header">Guests</div>
        <div class="separator"></div>
        <div><span class="summary-item-label">Adults: </span>${formData.adultsCount}</div>
        <div><span class="summary-item-label">Children: </span>${formData.childrenCount}</div>
        <div><span class="summary-item-label">Pets: </span>${formData.petsCount}</div>
      </div>
    `);

    const roomAndMealData = $(`
      <div class="summary-item">
        <div class="summary-item-header">Room and Meals</div>
        <div class="separator"></div>
        <div><span class="summary-item-label">Room Type: </span>${formData.roomType}</div>
        <div><span class="summary-item-label">Check-out Date: </span>${formData.mealPlan}</div>
      </div>
    `);

    summaryContainer.append(datesData, guestsData, roomAndMealData);

    if (formData.additionalRequest) {
      const additionalRequestsData = $(`
        <div class="summary-item">
          <div class="summary-item-header">Additional Requests</div>
          <div class="separator"></div>
          <div>${formData.additionalRequest}</div>
        </div>
      `);

      summaryContainer.append(additionalRequestsData);
    }

    return summaryContainer;
  };

  const multiViewItems = [
    { template: getDatesForm() },
    { template: getGuestsForm() },
    { template: getRoomAndMealForm() },
    { template: getAdditionalRequestsForm() },
    { template: getConfirmationTemplate() },
  ];

  const stepContent = $('#stepContent').dxMultiView({
    animationEnabled: false,
    swipeEnabled: false,
    height: 300,
    items: multiViewItems,
  }).dxMultiView('instance');

  $('.step-count').text(stepsCount);
});
