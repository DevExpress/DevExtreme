import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileUploaderModule, DxProgressBarModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    isDropZoneActive = false;
    imageSource = "#";
    progressVisible = false;
    progressValue = 0;

    constructor() {
        this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
        this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
        this.onUploaded = this.onUploaded.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onUploadStarted = this.onUploadStarted.bind(this);
    } 

    onDropZoneEnter(e) {
        if(e.dropZoneElement.id === "dropzone-external")
            this.isDropZoneActive = true;
    }

    onDropZoneLeave(e) {
        if(e.dropZoneElement.id === "dropzone-external")
            this.isDropZoneActive = false;
    }

    onUploaded(e) {
        const file = e.file;
        const dropZoneText = document.getElementById("dropzone-text");
        const fileReader = new FileReader();
        fileReader.onload = () => {
            this.isDropZoneActive = false;
            this.imageSource = fileReader.result as string;
        }
        fileReader.readAsDataURL(file);
        dropZoneText.style.display = "none";
        this.progressVisible = false;
        this.progressValue = 0;
    }

    onProgress(e) {
        this.progressValue = e.bytesLoaded / e.bytesTotal * 100;
    }

    onUploadStarted() {
        this.imageSource = "";
        this.progressVisible = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxFileUploaderModule,
        DxProgressBarModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);