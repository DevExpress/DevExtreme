import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    Injector,
    EmbeddedViewRef,
    ComponentRef,
    Component,
    ViewChild,
    Output,
    EventEmitter,
    Directive,
    ViewContainerRef,
    ElementRef,
    NgZone, TransferState, Inject, PLATFORM_ID, AfterViewInit,
} from '@angular/core'
import { DxPopupComponent, DxPopupTypes } from 'devextreme-angular/ui/popup';
import { DxTemplateHost, IterableDifferHelper, NestedOptionHost, WatcherHelper} from "devextreme-angular/core";

@Directive({
    standalone: true,
    selector: '[dx-content-insertion]',
})
class InsertionDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
    standalone: true,
    imports: [InsertionDirective],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ],
    template: '<ng-template dx-content-insertion></ng-template>',
})
class DxPopupStandaloneComponent extends DxPopupComponent implements AfterViewInit {
    @ViewChild(InsertionDirective) insertionPoint: InsertionDirective;

    @Output() afterViewInit$: EventEmitter<void> = new EventEmitter<void>();

    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
                _watcherHelper: WatcherHelper,
                _idh: IterableDifferHelper,
                optionHost: NestedOptionHost,
                transferState: TransferState,
                @Inject(PLATFORM_ID) platformId: any) {
        super(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.afterViewInit$.emit();
    }
}

@Injectable({
    providedIn: 'root',
})
export class DxPopupService {
    constructor(
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {}

    open(contentComponentType: any, popupOptions?: DxPopupTypes.Properties) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DxPopupStandaloneComponent);
        const componentRef: ComponentRef<DxPopupStandaloneComponent> = componentFactory.create(this.injector);
        const cmpInstance = componentRef.instance;

        cmpInstance.onHidden.subscribe(() => {
            this.applicationRef.detachView(componentRef.hostView);
            componentRef.destroy();
        });

        cmpInstance.afterViewInit$.subscribe(() => {
            if(popupOptions) {
                cmpInstance.instance.option(popupOptions);
            }

            cmpInstance.insertionPoint?.viewContainerRef.createComponent(contentComponentType);
        })

        this.applicationRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        document.body.appendChild(domElem);

        cmpInstance.visible = true;

        return componentRef.instance as DxPopupComponent;
    }
}
