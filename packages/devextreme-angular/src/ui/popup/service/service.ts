import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  ComponentRef,
  Type,
  RendererFactory2,
} from '@angular/core';
import { DxPopupComponent, DxPopupTypes } from '../component';
import { PopupServiceComponent } from './service.component';

export type DxPopupServiceComponent<T = any> = DxPopupComponent & { contentRef: ComponentRef<T> }

@Injectable({
  providedIn: 'root',
})
export class DxPopupService {
  constructor(
    private readonly injector: Injector,
    private readonly applicationRef: ApplicationRef,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly rendererFactory: RendererFactory2,
  ) {}

  open<T>(contentComponent: Type<T>, popupOptions?: DxPopupTypes.Properties): DxPopupServiceComponent<T> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PopupServiceComponent<T>);
    const serviceInjector = Injector.create({
      providers: [
        { provide: 'popupServiceContentComponent', useValue: contentComponent },
        { provide: 'popupServiceOptions', useValue: popupOptions },
      ],
      parent: this.injector
    });
    const componentRef = componentFactory.create(serviceInjector);
    const cmpInstance = componentRef.instance;

    cmpInstance.onHidden.subscribe(() => {
      this.applicationRef.detachView(componentRef.hostView);

      componentRef.destroy();
    });

    componentRef.changeDetectorRef.detectChanges();

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    const renderer = this.rendererFactory.createRenderer(null, null);

    renderer.appendChild(document.body, domElem);

    cmpInstance.visible = true;

    return componentRef.instance;
  }
}
