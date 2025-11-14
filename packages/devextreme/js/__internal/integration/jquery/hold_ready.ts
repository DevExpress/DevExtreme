import readyCallbacks from '@ts/core/utils/m_ready_callbacks';
import { themeReadyCallback } from '@ts/ui/m_themes_callback';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

if (jQuery && !themeReadyCallback.fired()) {
  // @ts-expect-error
  const holdReady = jQuery.holdReady || jQuery.fn.holdReady;

  holdReady(true);

  themeReadyCallback.add(() => {
    readyCallbacks.add(() => {
      holdReady(false);
    });
  });
}
