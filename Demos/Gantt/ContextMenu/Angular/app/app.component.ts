import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxGanttModule, DxCheckBoxModule } from 'devextreme-angular';
import { Service, Task, Dependency, Resource, ResourceAssignment } from './app.service';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    tasks: Task[];
    dependencies: Dependency[];
    resources: Resource[];
    resourceAssignments: ResourceAssignment[];
    contextMenuItems: {};
    showResources: boolean;
    disableContextMenu: boolean;

    constructor(service: Service) {
        this.tasks = service.getTasks();
        this.dependencies = service.getDependencies();
        this.resources = service.getResources();
        this.resourceAssignments = service.getResourceAssignments();
        this.showResources = true,
        this.disableContextMenu = false,
        this.contextMenuItems = this.getContextMenuItems()
    }
    onContextMenuPreparing(e) {
        e.cancel = this.disableContextMenu;
    }
    onCustomizeContextMenu(e) {
        this.contextMenuItems = e.value ? this.getContextMenuItems() : undefined
    }
    onPreventContextMenuShowing(e) {
        this.disableContextMenu = e.value
    }
    onCustomCommandClick(e) {
        if(e.name == 'ToggleDisplayOfResources') {
            this.showResources = !this.showResources
        }
    }
    getContextMenuItems() {
      return [
          "addTask",
          "taskdetails",
          "deleteTask",
          { 
              name: "ToggleDisplayOfResources", 
              text: "Toggle Display of Resources"
              }
          ]
      }
}

@NgModule({
    imports: [
        BrowserModule,
        DxGanttModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);