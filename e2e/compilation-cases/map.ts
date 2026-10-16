import type { MarkerClickEvent, Properties } from 'devextreme/js/ui/map';
import type { MarkerClickEvent as ReexportedMarkerClickEvent } from 'devextreme/js/ui/map_types';
import type dxPopover from 'devextreme/js/ui/popover';

import { assertType, notAny, toAssertion } from './consts';

const options: Properties = {
  markers: [{
    location: [40.78, -73.97],
    onClick(e) {
      notAny(e);
      notAny(e.location);
      notAny(e.tooltip);
      assertType<MarkerClickEvent>(toAssertion(e));
      assertType<ReexportedMarkerClickEvent>(toAssertion(e));
      assertType<dxPopover | undefined>(toAssertion(e.tooltip));
      e.component.option('center', e.location);
      e.tooltip?.option({ showTitle: true, showCloseButton: true });
    },
  }, {
    onClick: () => undefined,
  }],
};
