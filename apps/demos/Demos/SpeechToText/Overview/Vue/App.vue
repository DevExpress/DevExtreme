<template>
  <div className="speech-to-text-demo">
    <div class="speech-to-text-container">
      <span>Use voice recognition (speech to text)</span>
      <DxSpeechToText
        id="speech-to-text"
        :class="{ 'animation-disabled': !animation, 'custom-button': displayMode === 'Custom' }"
        :start-text="startText"
        :stop-text="stopText"
        v-model:type="type"
        v-model:styling-mode="stylingMode"
        :hint="hint"
        :speech-recognition-config="speechRecognitionConfig"
        v-model:disabled="disabled"
        @start-click="onStartClick"
        @stop-click="onStopClick"
        @result="onResult"
      />
      <DxTextArea
        id="text-area"
        v-model:value="textAreaValue"
        :width="360"
        :height="120"
        placeholder="Recognized text will appear here..."
        :input-attr="{ 'aria-label': 'Recognized Text' }"
      />
      <DxButton
        text="Clear"
        :disabled="textAreaValue === ''"
        @click="onClearButtonClick"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <div>Display Mode</div>
        <DxSelectBox
          v-model:value="displayMode"
          :data-source="displayModes"
          :input-attr="{ 'aria-label': 'Display Mode' }"
          @value-changed="onDisplayModeChanged"
        />
      </div>
      <div class="option">
        <div>Styling Mode</div>
        <DxSelectBox
          v-model="stylingMode"
          :data-source="stylingModes"
          display-expr="displayValue"
          value-expr="value"
          :disabled="displayMode === 'Custom'"
          :input-attr="{ 'aria-label': 'Styling Mode' }"
        />
      </div>
      <div class="option">
        <div>Type</div>
        <DxSelectBox
          v-model="type"
          :data-source="types"
          display-expr="displayValue"
          value-expr="value"
          :disabled="displayMode === 'Custom'"
          :input-attr="{ 'aria-label': 'Type' }"
        />
      </div>
      <div class="switch">
        <DxSwitch
          v-model="disabled"
        />
        <span>Disabled</span>
      </div>
      <div class="option-separator"/>
      <div class="option">
        <div>Language</div>
        <DxSelectBox
          v-model="language"
          :data-source="languages"
          :input-attr="{ 'aria-label': 'Language' }"
        />
      </div>
      <div class="switch">
        <DxSwitch
          v-model="interimResults"
        />
        <span>Interim Results</span>
      </div>
      <div class="switch">
        <DxSwitch
          v-model="continuous"
        />
        <span>Continuous Recognition</span>
      </div>
      <div class="option-separator"/>
      <div class="switch">
        <DxSwitch
          v-model="animation"
        />
        <span>Animation</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DxSpeechToText } from 'devextreme-vue/speech-to-text';
import { DxTextArea } from 'devextreme-vue/text-area';
import { DxButton, type DxButtonTypes } from 'devextreme-vue/button';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxSwitch } from 'devextreme-vue/switch';
import notify from 'devextreme/ui/notify';
import { displayModes, stylingModes, types, languages, langMap } from './data.ts';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

let state = 'initial';
const startText = ref('');
const stopText = ref('');
const displayMode = ref(displayModes[0]);
const stylingMode = ref<DxButtonTypes.ButtonStyle>('contained');
const type = ref<DxButtonTypes.ButtonType>('default');
const hint = ref('Start voice recognition');
const disabled = ref(false);
const textAreaValue = ref('');
const language = ref<string>(languages[0]);
const interimResults = ref(true);
const continuous = ref(false);
const animation = ref(true);
const speechRecognitionConfig: Record<string, any> = computed(() => ({
  interimResults: interimResults.value,
  continuous: continuous.value,
  lang: langMap[language.value],
}));

function onStartClick() {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    notify({
      message: 'The browser does not support Web Speech API (SpeechRecognition).',
      type: 'error',
      displayTime: 7000,
      position: 'bottom center',
      width: 'auto',
    });
    return;
  }

  state = 'listening';
  hint.value = 'Stop voice recognition';
  if (displayMode.value !== 'Custom') {
    return;
  }

  type.value = 'danger';
}
function onStopClick() {
  stopHandler();
}
function onResult({ event }: Record<string, any>) {
  const { results } = event;
  const resultText = Object.values(results)
    .map((resultItem: Record<string, any>) => resultItem[0].transcript)
    .join(' ');
  textAreaValue.value = resultText;

  if (!continuous.value && results[0].isFinal === true) {
    stopHandler();
  }
}
function stopHandler() {
  state = 'initial';
  hint.value = 'Start voice recognition';

  if (displayMode.value !== 'Custom') {
    return;
  }

  type.value = 'default';
}
function onClearButtonClick() {
  textAreaValue.value = '';
}
function onDisplayModeChanged({ value }: { value?: string }) {
  if (value === 'Text and Icon') {
    startText.value = 'Dictate';
    stopText.value = 'Stop';

    return;
  }

  startText.value = '';
  stopText.value = '';

  if (value === 'Custom') {
    stylingMode.value = 'contained';
    type.value = state === 'initial' ? 'default' : 'danger';
  }
}

</script>

<style>
  .speech-to-text-demo {
    display: flex;
    gap: 20px;
    height: 640px;
  }

  .speech-to-text-container {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  #text-area {
    margin-top: 16px;
  }

  .options {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 300px;
    box-sizing: border-box;
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    gap: 16px;
  }

  .caption {
    font-weight: 500;
    font-size: 18px;
  }

  .option {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }

  .switch {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  .option-separator {
    border-bottom: 1px solid var(--dx-color-border);
  }

  .animation-disabled {
    animation: none;
  }

  #speech-to-text.custom-button {
    border-radius: 2rem;
  }
</style>
