import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import notify from 'devextreme/ui/notify';
import ArrayStore from 'devextreme/data/array_store';
import { DxDiagramModule, DxDiagramComponent, DxDiagramTypes } from 'devextreme-angular/ui/diagram';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  orgItemsDataSource: ArrayStore;

  constructor(service: Service) {
    this.orgItemsDataSource = new ArrayStore({
      key: 'ID',
      data: service.getOrgItems(),
    });
  }

  showToast(text: string) {
    notify({
      position: {
        at: 'top', my: 'top', of: '#diagram', offset: '0 4',
      },
      message: text,
      type: 'warning',
      delayTime: 2000,
    });
  }

  requestLayoutUpdateHandler(e: DxDiagramTypes.RequestLayoutUpdateEvent) {
    for (let i = 0; i < e.changes.length; i++) {
      if (e.changes[i].type === 'remove') { e.allowed = true; } else if (e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null) { e.allowed = true; }
    }
  }

  requestEditOperationHandler(e) {
    const diagram = this.diagram.instance;
    if (e.operation === 'addShape') {
      if (e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast("You can add only a 'Team' or 'Employee' shape."); }
        e.allowed = false;
      }
    } else if (e.operation === 'deleteShape') {
      if (e.args.shape.type === 'root') {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast("You cannot delete the 'Development' shape."); }
        e.allowed = false;
      }
      if (e.args.shape.type === 'team') {
        for (let i = 0; i < e.args.shape.attachedConnectorIds.length; i++) {
          if ((diagram.getItemById(e.args.shape.attachedConnectorIds[i]) as any).toId != e.args.shape.id) {
            if (e.reason !== 'checkUIElementAvailability') { this.showToast("You cannot delete a 'Team' shape that has a child shape."); }
            e.allowed = false;
            break;
          }
        }
      }
    } else if (e.operation === 'resizeShape') {
      if (e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast('The shape size is too small.'); }
        e.allowed = false;
      }
    } else if (e.operation === 'changeConnection') {
      const shapeType = e.args.newShape && e.args.newShape.type;
      if (shapeType === 'root' && e.args.connectorPosition === 'end') {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast("The 'Development' shape cannot have an incoming connection."); }
        e.allowed = false;
      }
      if (shapeType === 'employee' && e.args.connectorPosition === 'start') {
        e.allowed = false;
      }
    } else if (e.operation === 'changeConnectorPoints') {
      if (e.args.newPoints.length > 2) {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast('You cannot add points to a connector.'); }
        e.allowed = false;
      }
    } else if (e.operation === 'beforeChangeShapeText') {
      if (e.args.shape.type === 'root') {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast("You cannot change the 'Development' shape's text."); }
        e.allowed = false;
      }
    } else if (e.operation === 'changeShapeText') {
      if (e.args.text === '') {
        if (e.reason !== 'checkUIElementAvailability') { this.showToast('A shape text cannot be empty.'); }
        e.allowed = false;
      }
    } else if (e.operation === 'beforeChangeConnectorText') {
      e.allowed = false;
    }
  }

  itemStyleExpr = ({ Type }: Record<string, string>) => (
    {
      fill: {
        root: '#ffcfc3',
        team: '#b7e3fe',
      }[Type] || '#bbefcb',
    }
  );
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
