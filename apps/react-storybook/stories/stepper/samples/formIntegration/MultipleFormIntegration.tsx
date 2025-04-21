import React, { FC, useState, useCallback, memo } from 'react';
import { Stepper, Item } from 'devextreme-react/stepper'
import type { IStepperOptions, IItemProps } from 'devextreme-react/stepper'
import Button from 'devextreme-react/button';
import { Form, RangeRule, RequiredRule, SimpleItem } from 'devextreme-react/form';
import { MultiView } from 'devextreme-react/multi-view';
import 'devextreme-react/date-range-box';
import 'devextreme-react/number-box';
import 'devextreme-react/select-box';
import 'devextreme-react/text-area';
import type { SelectionChangedEvent, SelectionChangingEvent } from 'devextreme/ui/stepper';
import validationEngine from "devextreme/ui/validation_engine";

import { initialSteps, formData, mealPlans, roomTypes } from "./data";
import './styles.css';

const DatesForm: FC = memo(() => (
    <Form formData={formData} validationGroup='dates' >
        <SimpleItem
            isRequired
            dataField='dates'
            editorType='dxDateRangeBox'
            editorOptions={{
                startDatePlaceholder: 'Check-in',
                endDatePlaceholder: 'Check-out',
            }}
            label={{ visible: false }}
        >
            <RequiredRule message='Dates are required' />
        </SimpleItem>
    </Form>
));

const GuestsForm: FC = memo(( ) => (
    <Form formData={formData} validationGroup='quests' >
        <SimpleItem
            isRequired
            dataField='adultsCount'
            editorType='dxNumberBox'
            label={{ text: 'Adults' }}
            editorOptions={{ showSpinButtons: true }}
        >
            <RangeRule min={1} message='At least one adult guest is required' />
        </SimpleItem>
        <SimpleItem
            dataField='childrenCount'
            editorType='dxNumberBox'
            label={{ text: 'Children' }}
            editorOptions={{ showSpinButtons: true }}
        />
    </Form>
));

const RoomMealPlanForm: FC = memo(( ) => (
    <Form formData={formData} validationGroup="roomAndMealPlan" >
        <SimpleItem
            dataField='roomType'
            isRequired
            editorType='dxSelectBox'
            label={{ text: 'Room Type' }}
            editorOptions={{ items: roomTypes }}
        >
            <RequiredRule message='Room type is required' />
        </SimpleItem>
        <SimpleItem
            dataField='mealPlan'
            isRequired
            editorType='dxSelectBox'
            label={{ text: 'Meal Plan' }}
            editorOptions={{ items: mealPlans }}
        >
            <RequiredRule message='Meal Plan s required' />
        </SimpleItem>
    </Form>
));

const AdditionalForm: FC = memo(() => (
    <Form formData={formData} >
        <SimpleItem
            dataField='additionalRequest'
            editorType='dxTextArea'
        ></SimpleItem>
    </Form>
));

const Summary: FC = memo(() => (
    <div className="dx-fieldset">
        <div className="dx-field">
            <div className="dx-field-label">Dates</div>
            <div className="dx-field-value-static">
                {`${formData.dates[0]?.toLocaleDateString()} - ${formData.dates[1]?.toLocaleDateString()}`}
            </div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Adult Guests</div>
            <div className="dx-field-value-static">{formData.adultsCount}</div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Children Guests</div>
            <div className="dx-field-value-static">{formData.childrenCount}</div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Room Type</div>
            <div className="dx-field-value-static">{formData.roomType}</div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Meal Plan</div>
            <div className="dx-field-value-static">{formData.mealPlan}</div>
        </div>
        <div className="dx-field">
            <div className="dx-field-label">Additional Request</div>
            <div className="dx-field-value-static">{formData.additionalRequest}</div>
        </div>
    </div>
));

const Confirmation: FC = memo(() => (
    <div>Booking is confirmed</div>
));

const MultipleFormIntegration: FC<IStepperOptions> = memo(() => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [steps, setSteps] = useState(initialSteps);

    const [formSubmitted, setFormSubmitted] = useState(false);

    const onPrevButtonClick = useCallback(() => {
        setSelectedIndex((prev) => prev - 1);
    }, []);

    const onNextButtonClick = useCallback(() => {
        setSelectedIndex((prev) => prev + 1);
    }, []);

    const getValidationResult = useCallback((index: number) => {
        if (index > 2) {
            return undefined;
        }

        const groupName = ['dates', 'quests', 'roomAndMealPlan'][index];

        return validationEngine.validateGroup(groupName).isValid;
    }, []);

    const setStepValidationResult = useCallback((index: number, isValid: boolean | undefined) => {
        setSteps((prev) => prev.map((step, i) => {
            if (i === index) {
                return {
                    ...step,
                    isValid,
                }
            }

            return step;
        }));
    }, []);

    const onSelectionChanging = useCallback((args: SelectionChangingEvent) => {
        const { component, addedItems, removedItems } = args;
        const { items = [] } = component.option();

        const addedIndex = items.findIndex((item: IItemProps) => item === addedItems[0]);
        const removedIndex = items.findIndex((item: IItemProps) => item === removedItems[0]);
        const isMoveForward = addedIndex > removedIndex;

        if (isMoveForward) {
            const isValid = getValidationResult(removedIndex);

            setStepValidationResult(removedIndex, isValid);

            if (isValid === false) {
                args.cancel = true;
                setSelectedIndex(removedIndex);
            }
        }
    }, [setStepValidationResult]);

    const onSelectionChanged = useCallback(({ component }: SelectionChangedEvent) => {
        setSelectedIndex(component.option('selectedIndex') ?? 0);
    }, []);

    const onFormSubmit = useCallback(() => {
        setFormSubmitted(true);
    }, []);

    return (
        <>
            <Stepper
                selectedIndex={selectedIndex}
                onSelectionChanged={onSelectionChanged}
                onSelectionChanging={onSelectionChanging}
            >
                {steps.map((step) => <Item key={step.title} {...step} />)}
            </Stepper>

            <MultiView
                selectedIndex={selectedIndex}
                animationEnabled={false}
                swipeEnabled={false}
                height={300}
            >
                <Item component={DatesForm}/>
                <Item component={GuestsForm} />
                <Item component={RoomMealPlanForm}/>
                <Item component={AdditionalForm}/>
                <Item component={formSubmitted ? Confirmation : Summary}/>
            </MultiView>

            <div className="dx-fieldset buttons-group">
            <Button
                text="Back"
                type="normal"
                onClick={onPrevButtonClick}
                visible={selectedIndex !== 0}
            />

            <Button
                text={selectedIndex === 4 ? "Confirm" : "Next"}
                type="default"
                onClick={selectedIndex === 4 ? onFormSubmit : onNextButtonClick}
                visible={!formSubmitted || selectedIndex !== 4}
            />
            </div>
        </>
    );
});

export default MultipleFormIntegration;
