import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import Button from '@js/ui/button';
import FileUploader from '@js/ui/file_uploader';
import type { dxHtmlEditorImageUpload } from '@js/ui/html_editor';
import TabPanel from '@js/ui/tab_panel';
import eventsEngine from '@ts/events/core/events_engine';

import HtmlEditor from '../html_editor';

interface DialogConfig {
  name: string;
  imageUpload: dxHtmlEditorImageUpload;
  fileTabIndex?: number;
}

const VALUE = '<p>text</p>';
const UPLOAD_URL = '/upload';

const UPLOAD_MODES: DialogConfig[] = [
  { name: 'the default upload mode', imageUpload: {} },
  { name: 'base64', imageUpload: { fileUploadMode: 'base64' } },
  { name: 'server', imageUpload: { fileUploadMode: 'server', uploadUrl: UPLOAD_URL } },
  { name: 'both', imageUpload: { fileUploadMode: 'both', uploadUrl: UPLOAD_URL } },
];

const TAB_SETS: Required<Pick<DialogConfig, 'name' | 'fileTabIndex'>>[] = [
  { name: 'the file tab is the only one', fileTabIndex: 0 },
  { name: 'the file tab is the first of two', fileTabIndex: 0 },
  { name: 'the file tab is the second of two', fileTabIndex: 1 },
];

const getTabs = (name: string): dxHtmlEditorImageUpload['tabs'] => {
  if (name === TAB_SETS[0].name) {
    return ['file'];
  }

  return name === TAB_SETS[1].name ? ['file', 'url'] : ['url', 'file'];
};

const DIALOG_CONFIGS: DialogConfig[] = UPLOAD_MODES.flatMap((mode) => TAB_SETS.map((tabSet) => ({
  name: `${mode.name}, ${tabSet.name}`,
  imageUpload: { ...mode.imageUpload, tabs: getTabs(tabSet.name) },
  fileTabIndex: tabSet.fileTabIndex,
})));

const editors: HtmlEditor[] = [];

const getAddButton = (): Button => Button.getInstance(
  $('.dx-popup-bottom .dx-button').get(0),
) as Button;

const getFileUploader = (editor: HtmlEditor): FileUploader => FileUploader.getInstance(
  $(editor._formDialog._popup.content()).find('.dx-fileuploader').get(0),
) as FileUploader;

const openFileTab = ({ imageUpload, fileTabIndex }: DialogConfig): HtmlEditor => {
  const $element = $('<div>').appendTo(document.body);
  // @ts-expect-error direct instantiation is not typed
  const editor: HtmlEditor = new HtmlEditor($element, {
    value: VALUE,
    toolbar: { items: ['image'] },
    imageUpload,
  });

  editors.push(editor);

  eventsEngine.trigger(editor.$element().find('.dx-htmleditor-toolbar .dx-button'), 'dxclick');
  jest.runAllTimers();

  if (fileTabIndex) {
    const tabPanel = TabPanel.getInstance($('.dx-tabpanel').get(0)) as TabPanel;

    tabPanel.option('selectedIndex', fileTabIndex);
    jest.runAllTimers();
  }

  return editor;
};

const selectFile = (editor: HtmlEditor): File => {
  const file = new File(['image'], 'image.png', { type: 'image/png' });

  getFileUploader(editor).option('value', [file]);
  jest.runAllTimers();

  return file;
};

const isDialogShown = (editor: HtmlEditor): boolean => {
  const { visible } = editor._formDialog._popup.option();

  return Boolean(visible);
};

describe('HtmlEditor image dialog, the file tab', () => {
  const originalGetBoundingClientRect = Range.prototype.getBoundingClientRect;

  beforeEach(() => {
    jest.useFakeTimers();
    fx.off = true;
    // jsdom has no layout for a Range, and Quill reads it when the selection is set
    Range.prototype.getBoundingClientRect = (): DOMRect => new DOMRect();
  });

  afterEach(() => {
    editors.forEach((editor) => { editor.dispose(); });
    editors.length = 0;
    document.body.innerHTML = '';
    Range.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    fx.off = false;
    jest.useRealTimers();
  });

  describe.each(DIALOG_CONFIGS)('$name', (config) => {
    describe('no file is selected', () => {
      it('keeps the Add button disabled', () => {
        const editor = openFileTab(config);

        expect(isDialogShown(editor)).toBe(true);
        expect(getAddButton().option('disabled')).toBe(true);
      });

      it('keeps the dialog open on a click on the Add button that its own API enabled', () => {
        const editor = openFileTab(config);
        const addButton = getAddButton();

        addButton.option('disabled', false);

        expect(() => {
          eventsEngine.trigger(addButton.element(), 'dxclick');
          jest.runAllTimers();
        }).not.toThrow();
        expect(isDialogShown(editor)).toBe(true);
        expect(editor.option('value')).toBe(VALUE);
      });

      it('keeps the dialog open when the Add action is called', () => {
        const editor = openFileTab(config);

        expect(() => {
          editor._formDialog.callAddButtonAction();
          jest.runAllTimers();
        }).not.toThrow();
        expect(isDialogShown(editor)).toBe(true);
        expect(editor.option('value')).toBe(VALUE);
      });
    });

    describe('a file is selected', () => {
      it('enables the Add button', () => {
        const editor = openFileTab(config);

        selectFile(editor);

        expect(getAddButton().option('disabled')).toBe(false);
      });

      it('uploads the file and closes the dialog on a click on the Add button', () => {
        const editor = openFileTab(config);
        const quillUploader = editor.getQuillInstance().getModule('uploader');
        const base64Upload = jest.spyOn(quillUploader, 'upload').mockImplementation(() => {});
        const serverUpload = jest.spyOn(getFileUploader(editor), 'upload').mockImplementation(() => {});
        const file = selectFile(editor);

        eventsEngine.trigger(getAddButton().element(), 'dxclick');
        jest.runAllTimers();

        const isServerUpload = config.imageUpload.fileUploadMode === 'server'
          || config.imageUpload.fileUploadMode === 'both';

        expect(serverUpload).toHaveBeenCalledTimes(isServerUpload ? 1 : 0);
        expect(base64Upload).toHaveBeenCalledTimes(isServerUpload ? 0 : 1);

        if (!isServerUpload) {
          expect(base64Upload.mock.calls[0][1]).toEqual([file]);
        }

        expect(isDialogShown(editor)).toBe(false);
      });
    });
  });
});
