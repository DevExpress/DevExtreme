import { Injectable } from '@angular/core';

export class ScatterData {
  x1: number;

  y1: number;

  x2: number;

  y2: number;
}

@Injectable()
export class Service {
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateDataSource() {
    let x1; let x2; let y1; let y2; let
      i;
    const ds = [];
    for (i = 0; i < 20; i++) {
      x1 = this.random(5, 15);
      y1 = this.random(5, 15);

      ds.push({
        x1, y1, x2, y2,
      });
    }
    for (i = 0; i < 20; i++) {
      x2 = this.random(5, 15);
      y2 = this.random(-15, -5);

      ds.push({
        x1, y1, x2, y2,
      });
    }

    for (i = 0; i < 20; i++) {
      x2 = this.random(-15, -5);
      y2 = this.random(5, 15);

      ds.push({
        x1, y1, x2, y2,
      });
    }
    for (i = 0; i < 20; i++) {
      x1 = this.random(-15, -5);
      y1 = this.random(-15, -5);

      ds.push({
        x1, y1, x2, y2,
      });
    }
    return ds;
  }
}
