/* tslint:disable:component-selector */

import {
  Component,
} from '@angular/core';
import {
  TestBed,
} from '@angular/core/testing';

import {
  DevExtremeModule,
} from 'devextreme-angular';

import renderer from 'devextreme/core/renderer';

import { DxServerModule } from 'devextreme-angular/server';

import {
  componentNames,
} from './component-names';

@Component({
  selector: 'test-container-component',
  template: '',
  imports: [DevExtremeModule],
})
class TestContainerComponent {
}

describe('Universal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestContainerComponent,
        DxServerModule,
        DevExtremeModule,
      ],
    });
  });

  // spec
  it('should render all components', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    ${componentNames.map((name) => `<dx-${name}></dx-${name}>`).join('')}
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    expect(fixture.detectChanges.bind(fixture)).not.toThrow();
  });

  // eslint-disable-next-line require-await
  it('should not throw error if core/renderer is called (T1255582)', async () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<div></div>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);

    fixture.detectChanges();

    expect(() => renderer(fixture.nativeElement).filter(':visible')).not.toThrow();
  });
});
