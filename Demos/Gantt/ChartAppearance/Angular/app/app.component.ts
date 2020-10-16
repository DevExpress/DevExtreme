import { ViewEncapsulation } from '@angular/compiler/src/core';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxGanttModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service, Task, Dependency, Resource, ResourceAssignment } from './app.service';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    tasks: Task[];
    dependencies: Dependency[];
    resources: Resource[];
    resourceAssignments: ResourceAssignment[];
    scaleType: string;
    titlePosition: string;
    showResources: boolean;
    taskTooltipContentTemplate: (model: any) => string;

    constructor(service: Service) {
        this.tasks = service.getTasks();
        this.dependencies = service.getDependencies();
        this.resources = service.getResources();
        this.resourceAssignments = service.getResourceAssignments();
        this.scaleType = "quarters";
        this.titlePosition = "outside";
        this.showResources = true;
        this.taskTooltipContentTemplate = this.getTaskTooltipContentTemplate;
    }

    getTaskTooltipContentTemplate(model) {
        const parentElement = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
        parentElement.className = 'dx-gantt-task-edit-tooltip custom-task-edit-tooltip';
        const timeEstimate = Math.abs(model.start - model.end) / 36e5;
        const timeLeft = Math.floor((100 - model.progress) / 100 * timeEstimate);

        return `<div class="custom-tooltip-title"> ${model.title} </div>`
        + `<div class="custom-tooltip-row"> <span> Estimate: </span> ${timeEstimate} <span> hours </span> </div>`
        + `<div class="custom-tooltip-row"> <span> Left: </span> ${timeLeft} <span> hours </span> </div>`;
    }

    onShowCustomTaskTooltip(e) {
        const parentElement = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
        parentElement.className = 'dx-gantt-task-edit-tooltip';
        e.value ? this.taskTooltipContentTemplate = this.getTaskTooltipContentTemplate 
                : this.taskTooltipContentTemplate = undefined;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxGanttModule,
        DxCheckBoxModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);