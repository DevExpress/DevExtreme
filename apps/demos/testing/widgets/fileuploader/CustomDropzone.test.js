import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const DROPZONE_EXTERNAL_CLASS = 'dropzone-external';

fixture('FileUploader.CustomDropzone')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('FileUploader', 'CustomDropzone', ['jQuery'], (test) => {
  test('dropzone-active class is added to the dropzone element when single valid file is dragged over it', async (t) => {
    await ClientFunction(() => {
      const $dropZone = $(`#${DROPZONE_EXTERNAL_CLASS}`);
      $dropZone.trigger($.Event('dragenter', {
        originalEvent: $.Event('dragenter', {
          dataTransfer: {
            items: [
              { kind: 'file', type: 'image/png' },
            ],
            types: ['Files'],
          },
          clientX: $dropZone.offset().left,
          clientY: $dropZone.offset().top,
        }),
      }));
    }, { dependencies: { DROPZONE_EXTERNAL_CLASS } })();

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_CLASS}`).hasClass('dropzone-active')).ok();
  });

  test('dropzone-active class is not added to the dropzone element when an invalid file format is dragged', async (t) => {
    await ClientFunction(() => {
      const $dropZone = $(`#${DROPZONE_EXTERNAL_CLASS}`);
      $dropZone.trigger($.Event('dragenter', {
        originalEvent: $.Event('dragenter', {
          dataTransfer: {
            items: [
              { kind: 'file', type: 'image/xlsx' },
            ],
            types: ['Files'],
          },
          clientX: $dropZone.offset().left,
          clientY: $dropZone.offset().top,
        }),
      }));
    }, { dependencies: { DROPZONE_EXTERNAL_CLASS } })();

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_CLASS}`).hasClass('dropzone-active')).notOk();
  });

  test('dropzone-active class is not added to the dropzone element when an multiple items are dragged', async (t) => {
    await ClientFunction(() => {
      const $dropZone = $(`#${DROPZONE_EXTERNAL_CLASS}`);
      $dropZone.trigger($.Event('dragenter', {
        originalEvent: $.Event('dragenter', {
          dataTransfer: {
            items: [
              { kind: 'file', type: 'image/png' },
              { kind: 'file', type: 'image/png' },
            ],
            types: ['Files'],
          },
          clientX: $dropZone.offset().left,
          clientY: $dropZone.offset().top,
        }),
      }));
    }, { dependencies: { DROPZONE_EXTERNAL_CLASS } })();

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_CLASS}`).hasClass('dropzone-active')).notOk();
  });

  test('custom dropzone user interface appearance when dropzone-active is applied', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await ClientFunction(() => {
      const $dropZone = $(`#${DROPZONE_EXTERNAL_CLASS}`);
      $dropZone.trigger($.Event('dragenter', {
        originalEvent: $.Event('dragenter', {
          dataTransfer: {
            items: [
              { kind: 'file', type: 'image/png' },
            ],
            types: ['Files'],
          },
          clientX: $dropZone.offset().left,
          clientY: $dropZone.offset().top,
        }),
      }));
    }, { dependencies: { DROPZONE_EXTERNAL_CLASS } })();

    await testScreenshot(t, takeScreenshot, 'custom_dropzone_valid_file.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
