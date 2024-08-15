import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef, Type,
} from '@angular/core';
import { DxPopupTypes } from '../component';
import { DxServicePopupComponent } from './service.component';

@Injectable({
  providedIn: 'root',
})
export class DxPopupService {
  constructor(
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  open<T>(contentComponent: Type<T>, popupOptions?: DxPopupTypes.Properties) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DxServicePopupComponent);
    const componentRef: ComponentRef<DxServicePopupComponent> = componentFactory.create(this.injector);
    const cmpInstance = componentRef.instance;

    cmpInstance.onHidden.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);
      componentRef.destroy();
    });

    cmpInstance.afterViewInit$.subscribe(() => {
      if (popupOptions) {
        cmpInstance.instance.option(popupOptions);
      }

      componentRef.instance.contentRef = cmpInstance.contentInsertion?.viewContainerRef.createComponent(contentComponent);
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    cmpInstance.visible = true;

    this.applicationRef.tick();

    return componentRef.instance as (typeof componentRef.instance & { contentRef: ComponentRef<T> });
  }
}
