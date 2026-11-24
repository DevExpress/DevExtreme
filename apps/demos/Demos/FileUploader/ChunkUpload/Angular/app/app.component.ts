import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxFileUploaderModule } from 'devextreme-angular';
import type { DxFileUploaderTypes } from 'devextreme-angular/ui/file-uploader';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxFileUploaderModule,
  ],
})
export class AppComponent {
  onUploadStarted() {
    const chunkPanel = this.getChunkPanel();
    if (chunkPanel) {
      chunkPanel.innerHTML = '';
    }
  }

  onUploadProgress(e: DxFileUploaderTypes.ProgressEvent) {
    this.getChunkPanel()?.appendChild(this.addChunkInfo(e.segmentSize, e.bytesLoaded, e.bytesTotal));
  }

  private addChunkInfo(segmentSize: number, loaded: number, total: number) {
    const result = document.createElement('DIV');

    result.appendChild(this.createSpan('Chunk size:'));
    result.appendChild(this.createSpan(this.getValueInKb(segmentSize), 'segment-size'));
    result.appendChild(this.createSpan(', Uploaded:'));
    result.appendChild(this.createSpan(this.getValueInKb(loaded), 'loaded-size'));
    result.appendChild(this.createSpan('/'));
    result.appendChild(this.createSpan(this.getValueInKb(total), 'total-size'));

    return result;
  }

  private getValueInKb(value: number) {
    return `${(value / 1024).toFixed(0)}kb`;
  }

  private createSpan(text: string, className?: string) {
    const result = document.createElement('SPAN');
    if (className) { result.className = className; }
    result.innerText = text;
    return result;
  }

  private getChunkPanel() {
    return document.querySelector<HTMLElement>('.chunk-panel');
  }
}

bootstrapApplication(AppComponent);
