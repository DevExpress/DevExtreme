import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const DROPZONE_EXTERNAL_ID = 'dropzone-external';
const DROPZONE_ACTIVE_CLASS = 'dropzone-active';

fixture('FileUploader.CustomDropzone')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('FileUploader', 'CustomDropzone', ['jQuery'], (test) => {
  const triggerDragEnter = async (dropZoneSelector, items) => {
    await ClientFunction(() => {
      const $dropZone = $(dropZoneSelector);
      const { left, top } = $dropZone.offset();
      $dropZone.trigger($.Event('dragenter', {
        originalEvent: $.Event('dragenter', {
          dataTransfer: {
            items,
            types: ['Files'],
          },
          clientX: left,
          clientY: top,
        }),
      }));
    }, { dependencies: { dropZoneSelector, items } })();
  };

  test('dropzone-active class is added to the dropzone element when single valid file is dragged over it', async (t) => {
    await triggerDragEnter(`#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/png' }]);

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_ID}`).hasClass(DROPZONE_ACTIVE_CLASS)).ok();
  });

  test('dropzone-active class is not added to the dropzone element when an invalid file format is dragged', async (t) => {
    await triggerDragEnter(`#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/xlsx' }]);

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_ID}`).hasClass(DROPZONE_ACTIVE_CLASS)).notOk();
  });

  test('dropzone-active class is not added to the dropzone element when multiple items are dragged', async (t) => {
    await triggerDragEnter(`#${DROPZONE_EXTERNAL_ID}`, [
      { type: 'image/png' },
      { type: 'image/png' },
    ]);

    await t.expect(Selector(`#${DROPZONE_EXTERNAL_ID}`).hasClass(DROPZONE_ACTIVE_CLASS)).notOk();
  });

  test('custom dropzone user interface appearance when dropzone-active is applied', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await triggerDragEnter(`#${DROPZONE_EXTERNAL_ID}`, [{ type: 'image/png' }]);

    await testScreenshot(t, takeScreenshot, 'custom_dropzone_valid_file.png');

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  });
});
