import React, { useCallback, useMemo, useState } from 'react';

import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import type { TextBoxTypes } from 'devextreme-react/text-box';
import { NumberBox, Button as NumberBoxButton } from 'devextreme-react/number-box';
import type { NumberBoxTypes } from 'devextreme-react/number-box';
import { DateBox, Button as DateBoxButton } from 'devextreme-react/date-box';
import type { DateBoxTypes } from 'devextreme-react/date-box';
import type { ButtonTypes } from 'devextreme-react/button';

const millisecondsInDay = 24 * 60 * 60 * 1000;
const currencyLabel = { 'aria-label': 'Multi Currency' };
const dateBoxLabel = { 'aria-label': 'Date' };
const passwordLabel = { 'aria-label': 'Password' };

function App() {
  const [passwordMode, setPasswordMode] = useState<TextBoxTypes.TextBoxType>('password');
  const [currencyFormat, setCurrencyFormat] = useState<string>('$ #.##');
  const [currencyValue, setCurrencyValue] = useState<number>(14500.55);
  const [dateValue, setDateValue] = useState<number>(new Date().getTime());

  const passwordButton = useMemo<ButtonTypes.Properties>(
    (): ButtonTypes.Properties => ({
      icon: 'eyeopen',
      stylingMode: 'text',
      onClick: (): void => {
        setPasswordMode((prevPasswordMode: string) =>
          (prevPasswordMode === 'text' ? 'password' : 'text'));
      },
    }),
    [],
  );

  const currencyButton = useMemo<ButtonTypes.Properties>(
    (): ButtonTypes.Properties => ({
      text: '€',
      stylingMode: 'text',
      width: 32,
      elementAttr: {
        class: 'currency',
      },
      onClick: (e: ButtonTypes.ClickEvent): void => {
        if (e.component.option('text') === '$') {
          e.component.option('text', '€');
          setCurrencyFormat('$ #.##');
          setCurrencyValue((prevCurrencyValue: number): number => prevCurrencyValue / 0.836);
        } else {
          e.component.option('text', '$');
          setCurrencyFormat('€ #.##');
          setCurrencyValue((prevCurrencyValue: number): number => prevCurrencyValue * 0.836);
        }
      },
    }),
    [],
  );

  const todayButton = useMemo<ButtonTypes.Properties>(
    (): ButtonTypes.Properties => ({
      text: 'Today',
      stylingMode: 'text',
      onClick: (): void => {
        setDateValue(new Date().getTime());
      },
    }),
    [],
  );

  const prevDateButton = useMemo<ButtonTypes.Properties>(
    (): ButtonTypes.Properties => ({
      icon: 'spinprev',
      stylingMode: 'text',
      onClick: (): void => {
        setDateValue((prevDateValue: number): number => prevDateValue - millisecondsInDay);
      },
    }),
    [],
  );

  const nextDateButton = useMemo<ButtonTypes.Properties>(
    (): ButtonTypes.Properties => ({
      icon: 'spinnext',
      stylingMode: 'text',
      onClick: (): void => {
        setDateValue((prevDateValue: number): number => prevDateValue + millisecondsInDay);
      },
    }),
    [],
  );

  const onDateChanged = useCallback(
    (e: DateBoxTypes.ValueChangedEvent): void => {
      setDateValue(e.value);
    },
    [],
  );

  const changeCurrency = useCallback(
    (data: NumberBoxTypes.ValueChangedEvent): void => {
      setCurrencyValue(data.value);
    },
    [],
  );

  return (
    <>
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Password TextBox</div>
          <div className="dx-field-value">
            <TextBox
              placeholder="password"
              stylingMode="filled"
              defaultValue="password"
              inputAttr={passwordLabel}
              mode={passwordMode}
            >
              <TextBoxButton
                name="password"
                location="after"
                options={passwordButton}
              />
            </TextBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Multi-currency NumberBox</div>
          <div className="dx-field-value">
            <NumberBox
              showClearButton={true}
              showSpinButtons={true}
              format={currencyFormat}
              value={currencyValue}
              inputAttr={currencyLabel}
              onValueChanged={changeCurrency}
            >
              <NumberBoxButton
                name="currency"
                location="after"
                options={currencyButton}
              />
              <NumberBoxButton name="clear" />
              <NumberBoxButton name="spins" />
            </NumberBox>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Advanced DateBox</div>
          <div className="dx-field-value">
            <DateBox
              value={dateValue}
              stylingMode="outlined"
              inputAttr={dateBoxLabel}
              onValueChanged={onDateChanged}
            >
              <DateBoxButton
                name="today"
                location="before"
                options={todayButton}
              />
              <DateBoxButton
                name="prevDate"
                location="before"
                options={prevDateButton}
              />
              <DateBoxButton
                name="nextDate"
                location="after"
                options={nextDateButton}
              />
              <DateBoxButton name="dropDown" />
            </DateBox>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
