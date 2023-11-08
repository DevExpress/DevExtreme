import React from 'react';

import { TextBox, Button as TextBoxButton, TextBoxTypes } from 'devextreme-react/text-box';
import { NumberBox, Button as NumberBoxButton, NumberBoxTypes } from 'devextreme-react/number-box';
import { DateBox, Button as DateBoxButton, DateBoxTypes } from 'devextreme-react/date-box';
import { ButtonTypes } from 'devextreme-react/button';

const millisecondsInDay = 24 * 60 * 60 * 1000;
const currencyLabel = { 'aria-label': 'Multi Currency' };
const dateBoxLabel = { 'aria-label': 'Date' };
const passwordLabel = { 'aria-label': 'Password' };

function App() {
  const [passwordMode, setPasswordMode] = React.useState<TextBoxTypes.TextBoxType>('password');
  const [currencyFormat, setCurrencyFormat] = React.useState('$ #.##');
  const [currencyValue, setCurrencyValue] = React.useState(14500.55);
  const [dateValue, setDateValue] = React.useState(new Date().getTime());

  const passwordButton = React.useMemo<ButtonTypes.Properties>(
    () => ({
      icon: 'eyeopen',
      stylingMode: 'text',
      onClick: () => {
        setPasswordMode((prevPasswordMode: string) =>
          (prevPasswordMode === 'text' ? 'password' : 'text'));
      },
    }),
    [setPasswordMode],
  );

  const currencyButton = React.useMemo<ButtonTypes.Properties>(
    () => ({
      text: '€',
      stylingMode: 'text',
      width: 32,
      elementAttr: {
        class: 'currency',
      },
      onClick: (e) => {
        if (e.component.option('text') === '$') {
          e.component.option('text', '€');
          setCurrencyFormat('$ #.##');
          setCurrencyValue((prevCurrencyValue: number) => prevCurrencyValue / 0.836);
        } else {
          e.component.option('text', '$');
          setCurrencyFormat('€ #.##');
          setCurrencyValue((prevCurrencyValue: number) => prevCurrencyValue * 0.836);
        }
      },
    }),
    [setCurrencyFormat, setCurrencyValue],
  );

  const todayButton = React.useMemo<ButtonTypes.Properties>(
    () => ({
      text: 'Today',
      stylingMode: 'text',
      onClick: () => {
        setDateValue(new Date().getTime());
      },
    }),
    [setDateValue],
  );

  const prevDateButton = React.useMemo<ButtonTypes.Properties>(
    () => ({
      icon: 'spinprev',
      stylingMode: 'text',
      onClick: () => {
        setDateValue((prevDateValue: number) => prevDateValue - millisecondsInDay);
      },
    }),
    [setDateValue],
  );

  const nextDateButton = React.useMemo<ButtonTypes.Properties>(
    () => ({
      icon: 'spinnext',
      stylingMode: 'text',
      onClick: () => {
        setDateValue((prevDateValue: number) => prevDateValue + millisecondsInDay);
      },
    }),
    [setDateValue],
  );

  const onDateChanged = React.useCallback(
    (e: DateBoxTypes.ValueChangedEvent) => {
      setDateValue(e.value);
    },
    [setDateValue],
  );

  const changeCurrency = React.useCallback(
    (data: NumberBoxTypes.ValueChangedEvent) => {
      setCurrencyValue(data.value);
    },
    [setCurrencyValue],
  );

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default App;
