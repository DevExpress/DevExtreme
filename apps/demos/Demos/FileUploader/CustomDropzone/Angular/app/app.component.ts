import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxFileUploaderModule, DxProgressBarModule } from 'devextreme-angular';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxFileUploaderModule,
    DxProgressBarModule,
  ],
})
export class AppComponent {
  readonly isDropZoneActive = signal(false);

  readonly imageSource = signal('');

  readonly textVisible = signal(true);

  readonly progressVisible = signal(false);

  readonly progressValue = signal(0);

  readonly allowedFileExtensions: string[] = ['.jpg', '.jpeg', '.gif', '.png'];

  onDropZoneEnter({ component, dropZoneElement, event }) {
    if (dropZoneElement.id === 'dropzone-external') {
      const items = event.originalEvent.dataTransfer.items;

      const allowedFileExtensions = component.option('allowedFileExtensions');
      const draggedFileExtension = `.${items[0].type.replace(/^image\//, '')}`;

      const isSingleFileDragged = items.length === 1;
      const isValidFileExtension = allowedFileExtensions.includes(draggedFileExtension);

      if (isSingleFileDragged && isValidFileExtension) {
        this.isDropZoneActive.set(true);
      }
    }
  }

  onDropZoneLeave(e) {
    if (e.dropZoneElement.id === 'dropzone-external') { this.isDropZoneActive.set(false); }
  }

  onUploaded(e) {
    const file = e.file;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.isDropZoneActive.set(false);
      this.imageSource.set(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    this.textVisible.set(false);
    this.progressVisible.set(false);
    this.progressValue.set(0);
  }

  onProgress(e) {
    this.progressValue.set(e.bytesLoaded / e.bytesTotal * 100);
  }

  onUploadStarted() {
    this.imageSource.set('');
    this.progressVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
