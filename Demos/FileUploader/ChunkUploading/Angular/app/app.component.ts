import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileUploaderModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
	styleUrls: ['app/app.component.css']
})
export class AppComponent {
	onUploadStarted(e) {
		this.getChunkPanel().innerHTML = '';
	}
	onUploadProgress(e) {
		this.getChunkPanel().appendChild(this.addChunkInfo(e.segmentSize, e.bytesLoaded, e.bytesTotal));
	}

	addChunkInfo(segmentSize, loaded, total) {
		var result = document.createElement("DIV");

		result.appendChild(this.createSpan("Chunk size:"));
		result.appendChild(this.createSpan(this.getValueInKb(segmentSize), 'segment-size'));
		result.appendChild(this.createSpan(", Uploaded:"));
		result.appendChild(this.createSpan(this.getValueInKb(loaded), 'loaded-size'));
		result.appendChild(this.createSpan("/"));
		result.appendChild(this.createSpan(this.getValueInKb(total), 'total-size'));

		return result;
	}
	getValueInKb(value) {
		return (value / 1024).toFixed(0) + "kb";
	}
	createSpan(text, className = null) {
		var result = document.createElement("SPAN");
		if (className)
			result.className = className + " dx-theme-accent-as-text-color";
		result.innerText = text;
		return result;
	}
	getChunkPanel() {
		return document.querySelector('.chunk-panel');
	}
}

@NgModule({
    imports: [
        BrowserModule,
        DxFileUploaderModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);