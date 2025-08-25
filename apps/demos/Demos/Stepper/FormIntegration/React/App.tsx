import React, { useState, useCallback, useMemo } from 'react';
import { Stepper, Item, type StepperTypes } from 'devextreme-react/stepper';
import { Button } from 'devextreme-react/button';
import { MultiView } from 'devextreme-react/multi-view';
import validationEngine from 'devextreme/ui/validation_engine';

import DatesForm from './DatesForm.tsx';
import GuestsForm from './GuestsForm.tsx';
import RoomMealPlanForm from './RoomMealPlanForm.tsx';
import AdditionalForm from './AdditionalForm.tsx';
import Confirmation from './Confirmation.tsx';

import { initialSteps, getInitialFormData } from './data.ts';
import { BookingFormData } from './types.ts';

const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [steps, setSteps] = useState<StepperTypes.Item[]>(initialSteps);
  const [formData, setFormData] = useState<BookingFormData>(getInitialFormData);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isStepperReadonly, setIsStepperReadonly] = useState(false);

  const getValidationResult = useCallback((index: number) => {
    if (index >= validationGroups.length) {
      return true;
    }

    return validationEngine.validateGroup(validationGroups[index]).isValid;
  }, []);

  const setStepValidationResult = useCallback((index: number, isValid: boolean | undefined) => {
    setSteps((prev) => prev.map((step, i) => {
      if (i === index) {
        return {
          ...step,
          isValid,
        };
      }

      return step;
    }));
  }, []);

  const onPrevButtonClick = useCallback(() => {
    setSelectedIndex((prev) => prev - 1);
  }, []);

  const moveNext = useCallback(() => {
    const isValid = getValidationResult(selectedIndex);

    setStepValidationResult(selectedIndex, isValid);

    if (isValid) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [getValidationResult, selectedIndex, setStepValidationResult]);

  const onConfirm = useCallback(() => {
    setIsConfirmed(true);
    setStepValidationResult(initialSteps.length - 1, true);
    setIsStepperReadonly(true);
  }, [setStepValidationResult]);

  const onReset = useCallback(() => {
    setIsConfirmed(false);
    setSteps(initialSteps);
    setSelectedIndex(0);
    setFormData(getInitialFormData);
    setIsStepperReadonly(false);
  }, []);

  const onNextButtonClick = useCallback(() => {
    if (selectedIndex < initialSteps.length -1) {
      moveNext();
    } else if (isConfirmed) {
      onReset();
    } else {
      onConfirm();
    }
  }, [selectedIndex, isConfirmed, onConfirm, onReset, moveNext]);

  const nextButtonText = useMemo(() => {
    if (selectedIndex < steps.length - 1) {
      return 'Next';
    }

    if (isConfirmed) {
      return 'Reset';
    }

    return 'Confirm';
  }, [selectedIndex, isConfirmed, steps.length]);

  const onSelectionChanging = useCallback((args: StepperTypes.SelectionChangingEvent) => {
    const { component, addedItems, removedItems } = args;
    const { items = [] } = component.option();

    const addedIndex = items.findIndex((item: StepperTypes.Item) => item === addedItems[0]);
    const removedIndex = items.findIndex((item: StepperTypes.Item) => item === removedItems[0]);
    const isMoveForward = addedIndex > removedIndex;

    if (isMoveForward) {
      const isValid = getValidationResult(removedIndex);

      setStepValidationResult(removedIndex, isValid);

      if (isValid === false) {
        args.cancel = true;
      }
    }
  }, [setStepValidationResult, getValidationResult]);

  const onSelectionChanged = useCallback(({ component }: StepperTypes.SelectionChangedEvent) => {
    setSelectedIndex(component.option('selectedIndex') ?? 0);
  }, []);

  const renderDatesForm = useCallback(
    () => <DatesForm formData={formData} validationGroup={validationGroups[0]} />,
    [formData]
  );

  const renderGuestsForm = useCallback(
    () => <GuestsForm formData={formData} validationGroup={validationGroups[1]} />,
    [formData]
  );

  const renderRoomMealPlanForm = useCallback(
    () => <RoomMealPlanForm formData={formData} validationGroup={validationGroups[2]} />,
    [formData]
  );

  const renderAdditionalForm = useCallback(
    () => <AdditionalForm formData={formData} />,
    [formData]
  );

  const renderConfirmation = useCallback(
    () => <Confirmation formData={formData} isConfirmed={isConfirmed} />,
    [formData, isConfirmed]
  );

  return (
    <>
      <Stepper
        className={ isStepperReadonly ? 'readonly' : ''}
        focusStateEnabled={!isStepperReadonly}
        selectedIndex={selectedIndex}
        onSelectionChanged={onSelectionChanged}
        onSelectionChanging={onSelectionChanging}
      >
        {steps.map((step) => <Item key={step.label} {...step} />)}
      </Stepper>

      <div className="content">
        <MultiView
          selectedIndex={selectedIndex}
          focusStateEnabled={false}
          animationEnabled={false}
          swipeEnabled={false}
          height={400}
        >
          <Item render={renderDatesForm} />
          <Item render={renderGuestsForm} />
          <Item render={renderRoomMealPlanForm} />
          <Item render={renderAdditionalForm} />
          <Item render={renderConfirmation} />
        </MultiView>

        <div className="nav-panel">
          <div className="current-step">
            {!isConfirmed && (
              <>
                Step <span className="selected-index">{selectedIndex + 1}</span>
                {' of '}
                {steps.length}
              </>
            )}
          </div>

          <div className="nav-buttons">
            <Button
              id="prevButton"
              text="Back"
              type="normal"
              onClick={onPrevButtonClick}
              visible={selectedIndex !== 0 && !isConfirmed}
              width={100}
            />

            <Button
              id="nextButton"
              text={nextButtonText}
              type="default"
              onClick={onNextButtonClick}
              width={100}
            />
          </div>
        </div>
      </div>
    </>
  );
}
