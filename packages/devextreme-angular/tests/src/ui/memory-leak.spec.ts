import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DxButtonModule, DxSliderModule } from 'devextreme-angular';

@Component({
  standalone: false,
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  isVisible = true;
}

async function forceGC(times = 3): Promise<void> {
  for (let i = 0; i < times; i++) {
    Array.from({ length: 10_000 }, () => ({ data: new Array(100) }));
    globalThis.gc?.();
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('Memory leak tests', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    TestBed.configureTestingModule({
      declarations: [TestContainerComponent],
      imports: [DxButtonModule, DxSliderModule],
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should not memory leak after change @if block with DxButton (T1324584)', async () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '@if (isVisible) {<dx-button text="BUTTON"></dx-button>}',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    const component: TestContainerComponent = fixture.componentInstance;

    fixture.detectChanges();

    for (let i = 0; i < 100; i++) {
      component.isVisible = !component.isVisible;
      fixture.detectChanges();
    }

    const memoryBefore = await (performance as any).measureUserAgentSpecificMemory();

    for (let i = 0; i < 100; i++) {
      component.isVisible = !component.isVisible;
      fixture.detectChanges();
    }

    await forceGC();

    const memoryAfter = await (performance as any).measureUserAgentSpecificMemory();
    const memoryDiff = Math.round((memoryAfter.bytes - memoryBefore.bytes) / 1024);

    expect(memoryDiff).toBeLessThan(150);
  });

  it('should not memory leak after change @if block with DxSlider (T1324584)', async () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '@if (isVisible) {<dx-slider></dx-slider>}',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    const component: TestContainerComponent = fixture.componentInstance;

    fixture.detectChanges();

    for (let i = 0; i < 100; i++) {
      component.isVisible = !component.isVisible;
      fixture.detectChanges();
    }

    const memoryBefore = await (performance as any).measureUserAgentSpecificMemory();

    for (let i = 0; i < 100; i++) {
      component.isVisible = !component.isVisible;
      fixture.detectChanges();
    }

    await forceGC();

    const memoryAfter = await (performance as any).measureUserAgentSpecificMemory();
    const memoryDiff = Math.round((memoryAfter.bytes - memoryBefore.bytes) / 1024);

    expect(memoryDiff).toBeLessThan(200);
  });
});
