import React, { useCallback, useState } from 'react';
import { SpeechToText } from 'devextreme-react/speech-to-text';
import { TextArea } from 'devextreme-react/text-area';
import { Button, ButtonTypes } from 'devextreme-react/button';
import { SelectBox } from 'devextreme-react/select-box';
import { Switch } from 'devextreme-react/switch';
import Notify from 'devextreme/ui/notify';
import { displayModes, stylingModes, types, languages, langMap } from './data.ts';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

let state = 'initial';
const textAreaLabel = { 'aria-label': 'Recognized Text' };
const displayModeLabel = { 'aria-label': 'Display Mode' };
const stylingModeLabel = { 'aria-label': 'Styling Mode' };
const typeLabel = { 'aria-label': 'Type' };
const languageLabel = { 'aria-label': 'Language' };

export default function App() {
  const [startText, setStartText] = useState<string>('');
  const [stopText, setStopText] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<string>(displayModes[0]);
  const [stylingMode, setStylingMode] = useState<ButtonTypes.ButtonStyle>(stylingModes[0].value);
  const [type, setType] = useState<ButtonTypes.ButtonType>(types[2].value);
  const [hint, setHint] = useState<string>('Start voice recognition');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const [language, setLanguage] = useState<string>(languages[0]);
  const [interimResults, setInterimResults] = useState<boolean>(true);
  const [continuous, setContinuous] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(true);
  const speechRecognitionConfig = {
    lang: langMap[language],
    interimResults,
    continuous,
  };

  const onStartClick = useCallback(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      Notify({
        message: 'The browser does not support Web Speech API (SpeechRecognition).',
        type: 'error',
        displayTime: 7000,
        position: 'bottom center',
        width: 'auto',
      });
      return;
    }

    state = 'listening';
    setHint('Stop voice recognition');
    if (displayMode !== 'Custom') {
      return;
    }

    setType('danger');
  }, [displayMode]);

  const onEnd = useCallback(() => {
    state = 'initial';
    setHint('Start voice recognition');

    if (displayMode !== 'Custom') {
      return;
    }

    setType('default');
  }, [displayMode]);

  const onResult = useCallback(({ event }) => {
    const { results } = event;
    const resultText = Object.values(results)
      .map((resultItem: any) => resultItem[0].transcript)
      .join(' ');
    setTextAreaValue(resultText);
  }, []);

  const onTextAreaValueChanged = useCallback(({ value }) => {
    setTextAreaValue(value);
  }, []);

  const onClearButtonClick = useCallback(() => {
    setTextAreaValue('');
  }, []);

  const onDisplayModeValueChanged = useCallback(({ value }) => {
    setDisplayMode(value);

    if (value === 'Text and Icon') {
      setStartText('Dictate');
      setStopText('Stop');

      return;
    }

    setStartText('');
    setStopText('');

    if (value === 'Custom') {
      setStylingMode('contained');
      setType(state === 'initial' ? 'default' : 'danger');
    }
  }, []);

  const onStylingModeValueChanged = useCallback(({ value }) => {
    setStylingMode(value);
  }, []);

  const onTypeValueChanged = useCallback(({ value }) => {
    setType(value);
  }, []);

  const onDisabledValueChanged = useCallback(({ value }) => {
    setDisabled(value);
  }, []);

  const onLanguageValueChanged = useCallback(({ value }) => {
    setLanguage(value);
  }, []);

  const onInterimResultsValueChanged = useCallback(({ value }) => {
    setInterimResults(value);
  }, []);

  const onContinuousValueChanged = useCallback(({ value }) => {
    setContinuous(value);
  }, []);

  const onAnimationValueChanged = useCallback(({ value }) => {
    setAnimation(value);
  }, []);

  return (
    <div className='speech-to-text-demo'>
      <div className='speech-to-text-container'>
        <span>Use voice recognition (speech to text)</span>
        <SpeechToText
          id='speech-to-text'
          className={ `${!animation ? 'animation-disabled' : ''} ${displayMode === 'Custom' ? 'custom-button' : ''}` }
          startText={startText}
          stopText={stopText}
          stylingMode={stylingMode}
          type={type}
          hint={hint}
          speechRecognitionConfig={speechRecognitionConfig}
          disabled={disabled}
          onStartClick={onStartClick}
          onStopClick={onEnd}
          onEnd={onEnd}
          onResult={onResult}
        />
        <TextArea
          id='text-area'
          value={textAreaValue}
          width={360}
          height={120}
          placeholder='Recognized text will appear here...'
          inputAttr={textAreaLabel}
          onValueChanged={onTextAreaValueChanged}
        />
        <Button
          text='Clear'
          disabled={textAreaValue === ''}
          onClick={onClearButtonClick}
        />
      </div>
      <div className='options'>
        <div className='caption'>Options</div>
        <div className='option'>
          <div>Display Mode</div>
          <SelectBox
            value={displayMode}
            dataSource={displayModes}
            inputAttr={displayModeLabel}
            onValueChanged={onDisplayModeValueChanged}
          />
        </div>
        <div className='option'>
          <div>Styling Mode</div>
          <SelectBox
            value={stylingMode}
            dataSource={stylingModes}
            valueExpr='value'
            displayExpr='displayValue'
            disabled={displayMode === 'Custom'}
            inputAttr={stylingModeLabel}
            onValueChanged={onStylingModeValueChanged}
          />
        </div>
        <div className='option'>
          <div>Type</div>
          <SelectBox
            value={type}
            dataSource={types}
            valueExpr='value'
            displayExpr='displayValue'
            disabled={displayMode === 'Custom'}
            inputAttr={typeLabel}
            onValueChanged={onTypeValueChanged}
          />
        </div>
        <div className='switch'>
          <Switch value={disabled} onValueChanged={onDisabledValueChanged} />
          <span>Disabled</span>
        </div>
        <div className='option-separator'></div>
        <div className='option'>
          <div>Language</div>
          <SelectBox
            value={language}
            dataSource={languages}
            inputAttr={languageLabel}
            onValueChanged={onLanguageValueChanged}
          />
        </div>
        <div className='switch'>
          <Switch
            value={interimResults}
            onValueChanged={onInterimResultsValueChanged}
          />
          <span>Interim Results</span>
        </div>
        <div className='switch'>
          <Switch
            value={continuous}
            onValueChanged={onContinuousValueChanged}
          />
          <span>Continuous Recognition</span>
        </div>
        <div className='option-separator'></div>
        <div className='switch'>
          <Switch value={animation} onValueChanged={onAnimationValueChanged} />
          <span>Animation</span>
        </div>
      </div>
    </div>
  );
}
