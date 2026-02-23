import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxFileUploaderModule, DxProgressBarModule } from 'devextreme-angular';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxFileUploaderModule,
    DxProgressBarModule,
  ],
})
export class AppComponent {
  isDropZoneActive = false;

  imageSource = '';

  textVisible = true;

  progressVisible = false;

  progressValue = 0;

  allowedFileExtensions: string[] = ['.jpg', '.jpeg', '.gif', '.png'];

  constructor() {
    this.onDropZoneEnter = this.onDropZoneEnter.bind(this);
    this.onDropZoneLeave = this.onDropZoneLeave.bind(this);
    this.onUploaded = this.onUploaded.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onUploadStarted = this.onUploadStarted.bind(this);
  }

  onDropZoneEnter({ component, dropZoneElement, event }) {
    if (dropZoneElement.id === 'dropzone-external') {
      const items = event.originalEvent.dataTransfer.items;

      const allowedFileExtensions = component.option('allowedFileExtensions');
      const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;

      const isSingleFileDragged = items.length === 1;
      const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);

      if (isSingleFileDragged && isValidFileExtension) {
        this.isDropZoneActive = true;
      }
    }
  }

  onDropZoneLeave(e) {
    if (e.dropZoneElement.id === 'dropzone-external') { this.isDropZoneActive = false; }
  }

  onUploaded(e) {
    const file = e.file;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isDropZoneActive = false;
      this.imageSource = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
    this.textVisible = false;
    this.progressVisible = false;
    this.progressValue = 0;
  }

  onProgress(e) {
    this.progressValue = e.bytesLoaded / e.bytesTotal * 100;
  }

  onUploadStarted() {
    this.imageSource = '';
    this.progressVisible = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
