import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import infernoRenderer from 'devextreme/core/inferno_renderer';
import { renderToString } from 'inferno-server';

@NgModule({
  exports: [],
  imports: [],
  providers: [],
})
export class DxServerModule {
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    if (isPlatformServer(platformId)) {
      infernoRenderer.inject({
        render: (
          component,
          props,
          container,
        ) => {
          const el = infernoRenderer.createElement(component, props);
          const document = container.ownerDocument;
          const temp = document.createElement(container.tagName);

          temp.innerHTML = renderToString(el);

          const mainElement = temp.childNodes[0];
          const childString = mainElement.innerHTML;

          for (let i = 0; i < mainElement.attributes.length; i++) {
            const attr = mainElement.attributes[i];

            if (!container.hasAttribute(attr.name)) {
              container.setAttribute(attr.name, attr.value);
            }
          }

          container.innerHTML = childString;
        },
      });
    }
  }
}
