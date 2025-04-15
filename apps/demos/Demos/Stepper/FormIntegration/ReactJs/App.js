import React, {
  useState, useCallback, useRef, useMemo,
} from 'react';
import { Stepper, Item } from 'devextreme-react/stepper';
import Button from 'devextreme-react/button';
import { MultiView } from 'devextreme-react/multi-view';
import validationEngine from 'devextreme/ui/validation_engine';
import DatesForm from './DatesForm.js';
import GuestsForm from './GuestsForm.js';
import RoomMealPlanForm from './RoomMealPlanForm.js';
import AdditionalForm from './AdditionalForm.js';
import Confirmation from './Confirmation.js';
import { initialSteps, initialFormData } from './data.js';

const cloneFormData = () => ({
  ...initialFormData,
  dates: [...initialFormData.dates],
});
const formData = cloneFormData();
const validationGroups = ['dates', 'guests', 'roomAndMealPlan'];
export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [steps, setSteps] = useState(initialSteps);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const formRef = useRef(null);
  const onPrevButtonClick = useCallback(() => {
    setSelectedIndex((prev) => prev - 1);
  }, []);
  const onConfirm = useCallback(() => {
    setIsConfirmed(true);
    setStepValidationResult(initialSteps.length - 1, true);
  }, []);
  const onReset = useCallback(() => {
    setIsConfirmed(false);
    setSteps(initialSteps);
    setSelectedIndex(0);
    formRef.current.instance().updateData(cloneFormData());
    validationEngine.resetGroup(validationGroups[0]);
  }, []);
  const onNextButtonClick = useCallback(() => {
    if (selectedIndex < initialSteps.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    } else if (isConfirmed) {
      onReset();
    } else {
      onConfirm();
    }
  }, [selectedIndex, isConfirmed, onConfirm, onReset]);
  const nextButtonText = useMemo(() => {
    if (selectedIndex < steps.length - 1) {
      return 'Next';
    }
    if (isConfirmed) {
      return 'Reset';
    }
    return 'Confirm';
  }, [selectedIndex, isConfirmed]);
  const getValidationResult = useCallback((index) => {
    if (index >= validationGroups.length) {
      return true;
    }
    return validationEngine.validateGroup(validationGroups[index]).isValid;
  }, []);
  const setStepValidationResult = useCallback((index, isValid) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === index) {
          return {
            ...step,
            isValid,
          };
        }
        return step;
      }));
  }, []);
  const onSelectionChanging = useCallback(
    (args) => {
      if (isConfirmed) {
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
          setSelectedIndex(removedIndex);
        }
      }
    },
    [setStepValidationResult, isConfirmed],
  );
  const onSelectionChanged = useCallback(({ component }) => {
    setSelectedIndex(component.option('selectedIndex') ?? 0);
  }, []);
  return (
    <React.Fragment>
      <Stepper
        selectedIndex={selectedIndex}
        onSelectionChanged={onSelectionChanged}
        onSelectionChanging={onSelectionChanging}
      >
        {steps.map((step) => (
          <Item
            key={step.title}
            {...step}
          />
        ))}
      </Stepper>

      <div className="content">
        <MultiView
          selectedIndex={selectedIndex}
          animationEnabled={false}
          swipeEnabled={false}
          height={300}
        >
          <Item
            render={() => (
              <DatesForm
                ref={formRef}
                formData={formData}
                validationGroup={validationGroups[0]}
              />
            )}
          />
          <Item
            render={() => (
              <GuestsForm
                formData={formData}
                validationGroup={validationGroups[1]}
              />
            )}
          />
          <Item
            render={() => (
              <RoomMealPlanForm
                formData={formData}
                validationGroup={validationGroups[2]}
              />
            )}
          />
          <Item render={() => <AdditionalForm formData={formData} />} />
          <Item
            render={() => (
              <Confirmation
                formData={formData}
                isConfirmed={isConfirmed}
              />
            )}
          />
        </MultiView>

        <div className="nav-panel">
          <div className="current-step">
            {!isConfirmed && (
              <React.Fragment>
                Step <span className="selected-index">{selectedIndex + 1}</span>
                {' of '}
                <span className="step-count">{steps.length}</span>
              </React.Fragment>
            )}
          </div>

          <div className="nav-buttons">
            <Button
              text="Back"
              type="normal"
              onClick={onPrevButtonClick}
              visible={selectedIndex !== 0}
            />

            <Button
              text={nextButtonText}
              type="default"
              onClick={onNextButtonClick}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
