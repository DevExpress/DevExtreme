import { Injectable } from '@angular/core';

let images: string[] = [
    "../../../../images/gallery/1.jpg",
    "../../../../images/gallery/2.jpg",
    "../../../../images/gallery/3.jpg",
    "../../../../images/gallery/4.jpg",
    "../../../../images/gallery/5.jpg",
    "../../../../images/gallery/6.jpg",
    "../../../../images/gallery/7.jpg",
    "../../../../images/gallery/8.jpg",
    "../../../../images/gallery/9.jpg"];

@Injectable()
export class Service {
    getImages() {
        return images;
    }
}
