$(() => {
  const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];
  let confirmed = false;
  let formData = getInitialFormData();

  const stepper = $('#stepper').dxStepper({
    items: steps,
    onSelectionChanged(e) {
      const selectedIndex = e.component.option('selectedIndex');

      setSelectedIndex(selectedIndex);
    },
    onSelectionChanging(args) {
      const { component, addedItems, removedItems } = args;
      const { items = [] } = component.option();

      const addedIndex = items.findIndex((item) => item === addedItems[0]);
      const removedIndex = items.findIndex((item) => item === removedItems[0]);
      const isMoveForward = addedIndex > removedIndex;

      if (isMoveForward && validateStep(removedIndex) === false) {
        args.cancel = true;
      }
    },
  }).dxStepper('instance');

  const multiViewItems = [
    { template: getDatesForm() },
    { template: getGuestsForm() },
    { template: getRoomAndMealForm() },
    { template: getAdditionalRequestsForm() },
    { template: getConfirmationTemplate() },
  ];

  const stepContent = $('#stepContent').dxMultiView({
    animationEnabled: false,
    focusStateEnabled: false,
    swipeEnabled: false,
    height: 400,
    items: multiViewItems,
  }).dxMultiView('instance');

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

      if (selectedIndex < steps.length - 1) {
        if (validateStep(selectedIndex)) {
          setSelectedIndex(selectedIndex + 1);
        }
      } else if (confirmed) {
        reset();
      } else {
        confirm();
      }
    },
  }).dxButton('instance');

  function validateStep(index) {
    const isValid = getValidationResult(index);

    stepper.option(`items[${index}].isValid`, isValid);

    return isValid;
  }

  function setSelectedIndex(index) {
    stepper.option('selectedIndex', index);
    stepContent.option('selectedIndex', index);
    setCurrentStepCaption(index);
    updateStepNavigationButtons(index);

    if (index === steps.length - 1) {
      stepContent.option('items[4].template', getConfirmationTemplate());
    }
  }

  function reset() {
    confirmed = false;

    resetStepperState();
    formData = getInitialFormData();
    stepContent.repaint();
    setSelectedIndex(0);
  }

  function confirm() {
    confirmed = true;

    setStepperReadonly(true);
    validateStep(steps.length - 1);
    setSelectedIndex(steps.length - 1);
  }

  function getValidationResult(index) {
    if (index >= validationGroups.length) {
      return true;
    }

    return DevExpress.validationEngine.validateGroup(validationGroups[index]).isValid;
  }

  function setCurrentStepCaption(index) {
    if (confirmed) {
      $('.current-step').empty();
    } else if (!$('.current-step').text()) {
      $('.current-step').append(`Step <span class="selected-index">${index + 1}</span> of ${steps.length}`);
    } else {
      $('.selected-index').text(index + 1);
    }
  }

  function updateStepNavigationButtons(index) {
    const isLastStep = index === steps.length - 1;
    const lastStepNextButtonText = confirmed ? 'Reset' : 'Confirm';
    const nextButtonText = isLastStep ? lastStepNextButtonText : 'Next';

    prevButton.option('visible', !!index && !confirmed);
    nextButton.option('text', nextButtonText);
  }

  function setStepperReadonly(readonly) {
    stepper.option('focusStateEnabled', !readonly);

    if (readonly) {
      stepper.option('elementAttr', { class: 'readonly' });
    } else {
      stepper.resetOption('elementAttr');
    }
  }

  function resetStepperState() {
    stepper.beginUpdate();

    for (let i = 0; i < steps.length; i += 1) {
      stepper.option(`items[${i}].isValid`, undefined);
    }

    setStepperReadonly(false);

    stepper.endUpdate();
  }

  function getDatesForm() {
    return () => $('<div>').append(
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
        }],
      }),
    );
  }

  function getGuestsForm() {
    return () => {
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
  }

  function getRoomAndMealForm() {
    return () => {
      const getSelectBoxOptions = (options) => ({
        editorType: 'dxSelectBox',
        isRequired: true,
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
  }

  function getAdditionalRequestsForm() {
    return () => $('<div>').append(
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
  }

  function getConfirmationTemplate() {
    return () => {
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
  }
});
