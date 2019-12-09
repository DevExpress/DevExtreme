import { getWindow } from "core/utils/window";

const READ_DELAY = 10;

export default class FileReaderMock {
    constructor() {
        this._content = null;

        this.result = null;
        this.onload = null;
        this.onerror = null;
    }

    readAsDataURL(blob) {
        const window = getWindow();

        this._content = blob._dxContent;
        const base64String = window.btoa(this._content);
        const dataUrl = `data:application/octet-stream;base64,${base64String}`;

        setTimeout(() => {
            this.result = dataUrl;

            if(this.onload) {
                this.onload();
            }
        }, READ_DELAY);
    }

}
