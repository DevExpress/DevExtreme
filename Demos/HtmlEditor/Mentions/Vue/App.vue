<template>
  <div>
    <div id="chat-window">
      <div class="message dx-theme-background-color">
        <div class="photo">
          <img src="../../../../images/mentions/Kevin-Carter.png">
        </div>
        <div class="name">
          Kevin Carter
        </div>
        <div class="date">
          07/03/19 - 12:22AM
        </div>
        <div class="text">
          <span
            class="dx-mention"
            spellcheck="false"
          ><span><span>@</span>John Heart</span></span> What experience do you have in this field?
        </div>
      </div>
      <br>
      <div class="message dx-theme-background-color">
        <div class="photo">
          <img src="../../../../images/mentions/John-Heart.png">
        </div>
        <div class="name">
          John Heart
        </div>
        <div class="date">
          07/03/19 - 12:25AM
        </div>
        <div class="text">
          I've been in the audio/video industry since 2001, and I've been the CEO of DevAv since 2009.
        </div>
      </div>
      <br>
      <div class="message dx-theme-background-color">
        <div class="photo">
          <img src="../../../../images/mentions/Kevin-Carter.png">
        </div>
        <div class="name">
          Kevin Carter
        </div>
        <div class="date">
          07/03/19 - 12:26AM
        </div>
        <div class="text">
          That's very interesting. <span
            class="dx-mention"
            spellcheck="false"
          ><span><span>@</span>Olivia Peyton</span></span>, what do you think?
        </div>
      </div>
    </div>
    <DxHtmlEditor
      :mentions="mentions"
    >
      <p>
        <span
          class="dx-mention"
          spellcheck="false"
          data-marker="@"
          data-mention-value="Kevin Carter"
        ><span><span>@</span>Kevin Carter</span></span> I think John's expertise can be very valuable in our startup.
      </p>
    </DxHtmlEditor>
  </div>
</template>
<script>

import {
  DxHtmlEditor
} from 'devextreme-vue/html-editor';
import { employees } from './data.js';

export default {
  components: {
    DxHtmlEditor
  },
  data() {
    return {
      mentions: [{
        dataSource: employees,
        searchExpr: 'text',
        displayExpr: 'text',
        valueExpr: 'text'
      }]
    };
  }
};
</script>
<style>
#chat-window {
    background-color: rgba(191, 191, 191, 0.15);
    height: 350px;
    padding: 10px;
}

.dx-htmleditor {
    height: 100px;
}

#send {
    float: right;
    margin: 10px 0px;
}

.message {
    height: 85px;
    background-color: inherit;
    display: inline-block;
    max-width: 60%;
    border-radius: 5px;
    margin: 5px;
    padding: 10px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.name {
    font-weight: bold;
}

.date {
    opacity: 0.5;
}

.photo {
    float: left;
    height: 100%;
}

.photo > img {
    width: 40px;
    height: 40px;
    display: block;
    border-radius: 40px;
    margin-right: 10px;
}
</style>
