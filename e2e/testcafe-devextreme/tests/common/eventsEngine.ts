import { ClientFunction, Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';

fixture.disablePageReloads`Events`
  .page(url(__dirname, '../container.html'));

const init = ClientFunction(() => {
  const markup = `<div class="dx-viewport demo-container">
      <div id="draggable" draggable="true" style="width: 200px; height: 200px; background-color: red;"></div>
      <div id="target" style="width: 200px; height: 200px; background-color: black;"></div>
      <div>hoverStartTriggerCount</div>
      <div id="hoverStartTriggerCount">0</div>
      <div>hoverEndTriggerCount</div>
      <div id="hoverEndTriggerCount">0</div>
  </div>`;

  $('#container').html(markup);

  const { DevExpress } = (window as any);

  let hoverStartTriggerCount = 0;
  let hoverEndTriggerCount = 0;

  DevExpress.events.on($('#target'), 'dxhoverstart', () => {
    hoverStartTriggerCount += 1;

    $('#hoverStartTriggerCount').text(hoverStartTriggerCount);
  });

  DevExpress.events.on($('#target'), 'dxhoverend', () => {
    hoverEndTriggerCount += 1;

    $('#hoverEndTriggerCount').text(hoverEndTriggerCount);
  });
});

test('The `dxhoverstart` event should be triggered after dragging and dropping an HTML draggable element (T1260277)', async (t) => {
  const draggable = Selector('#draggable');
  const target = Selector('#target');
  const hoverStartTriggerCount = Selector('#hoverStartTriggerCount');
  const hoverEndTriggerCount = Selector('#hoverEndTriggerCount');

  await t
    .drag(draggable, 0, 400, { speed: 1 });

  // `.drag` does not trigger the `pointercancel` event.
  // A sequence of `.drag` calls behaves like a single drag&drop operation,
  // and each call does not trigger the `pointerup` event.
  // Even if it did, the `pointercancel` event would not be triggered as specified in:
  // https://www.w3.org/TR/pointerevents/#suppressing-a-pointer-event-stream
  // This is a hack to test the event engine's logic.
  await t.dispatchEvent(draggable, 'pointercancel');

  await t
    .drag(target, 0, 400, { speed: 1 });

  await t.expect(hoverStartTriggerCount.textContent).eql('1');
  await t.expect(hoverEndTriggerCount.textContent).eql('1');
}).before(async () => {
  await init();
});
