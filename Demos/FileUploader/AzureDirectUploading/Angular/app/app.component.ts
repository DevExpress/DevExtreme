import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxFileUploaderModule, DxLoadPanelModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    requests: any[];
    wrapperClassName: string;
    loadPanelVisible: boolean;

    constructor(http: HttpClient) {
        const endpointUrl = 'https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-access';
        gateway = new AzureGateway(endpointUrl, this.onRequestExecuted.bind(this));

        this.requests = [];
        this.wrapperClassName = '';
        this.loadPanelVisible = true;

        this.checkAzureStatus(http);
    }

    uploadChunk(file, uploadInfo) {
        let promise = null;

        if(uploadInfo.chunkIndex === 0) {
            promise = gateway.getUploadAccessUrl(file.name).done(accessUrl => {
                uploadInfo.customData.accessUrl = accessUrl;
            });
        } else {
            promise = Promise.resolve();
        }

        promise = promise.then(() => gateway.putBlock(uploadInfo.customData.accessUrl, uploadInfo.chunkIndex, uploadInfo.chunkBlob));

        if(uploadInfo.chunkIndex === uploadInfo.chunkCount - 1) {
            promise = promise.then(() => gateway.putBlockList(uploadInfo.customData.accessUrl, uploadInfo.chunkCount));
        }

        return promise;
    }

    onRequestExecuted({method, urlPath, queryString}) {
        const request = { method, urlPath, queryString };
        this.requests.unshift(request);
    }

    checkAzureStatus(http: HttpClient) {
        http.get('https://js.devexpress.com/Demos/Mvc/api/file-manager-azure-status?widgetType=fileManager')
            .toPromise()
            .then(result => {
                this.wrapperClassName = result.active ? 'show-widget' : 'show-message';
                this.loadPanelVisible = false;
            });
    }
}

let gateway = null;

@NgModule({
    imports: [
        BrowserModule,
        DxFileUploaderModule,
        DxLoadPanelModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);