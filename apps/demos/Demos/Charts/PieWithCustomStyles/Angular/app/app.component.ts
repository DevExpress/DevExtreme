import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPieChartModule } from 'devextreme-angular';
import { registerGradient, registerPattern } from 'devextreme/common/charts';
import { Data, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  data: Data[];

  imagePatternSize = 12;

  shapePatternSize = 6;

  constructor(service: Service) {
    this.data = service.getData();
  }

  customizePoint = (point) => {
    const color = point.series.getPointsByArg(point.argument)[0].getColor();
    let fillId;
    switch (point.argument) {
      case 'Stripes':
        fillId = this.getStrokePattern(color);
        break;
      case 'Grid':
        fillId = this.getSquarePattern(color);
        break;
      case 'Linear Gradient':
        fillId = this.getLinearGradient(color);
        break;
      case 'Radial Gradient':
        fillId = this.getRadialGradient(color);
        break;
      case 'Image':
        fillId = this.getPatternImage(color);
        break;
      default:
        break;
    }

    return { color: { fillId } };
  };

  customizeText = (info) => info.argument;

  private hexToRgb = (hex: string, opacity = 1) => {
    const hexColorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return `rgba(${parseInt(hexColorParts[1], 16)}, ${parseInt(hexColorParts[2], 16)}, ${parseInt(hexColorParts[3], 16)}, ${opacity})`;
  };

  private getGradient = (type: string, color1: string, color2: string) => registerGradient(type, {
    colors: [{
      offset: '20%',
      color: color1,
    }, {
      offset: '90%',
      color: color2,
    }],
  });

  private getLinearGradient = (color: string) => this.getGradient('linear', color, this.hexToRgb(color, 0.5));

  private getRadialGradient = (color: string) => this.getGradient('radial', this.hexToRgb(color, 0.5), color);

  private getPatternImage = (color: string) => registerPattern({
    width: this.imagePatternSize,
    height: this.imagePatternSize,
    template: (container) => {
      const rect = this.createRect(this.imagePatternSize, color, '', 0);
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('x', '0');
      image.setAttribute('y', '0');
      image.setAttribute('width', this.imagePatternSize.toString());
      image.setAttribute('height', this.imagePatternSize.toString());
      image.setAttribute('href', '../../../../images/Charts/PieWithCustomStyles/diamond.svg');
      image.setAttribute('opacity', '0.6');

      container.appendChild(rect);
      container.appendChild(image);
    },
  });

  private getStrokePattern = (color: string) => registerPattern({
    width: this.shapePatternSize,
    height: this.shapePatternSize,
    template: (container) => {
      const halfSize = this.shapePatternSize / 2;
      const oneAndAHalfSize = this.shapePatternSize * 1.5;
      const d = `M ${halfSize} ${-halfSize} L ${-halfSize} ${halfSize} M 0 ${
        this.shapePatternSize
      } L ${
        this.shapePatternSize
      } 0 M ${oneAndAHalfSize} ${halfSize} L ${halfSize} ${oneAndAHalfSize}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('d', d);
      container.appendChild(path);
    },
  });

  private getSquarePattern = (color: string) => registerPattern({
    width: this.shapePatternSize,
    height: this.shapePatternSize,
    template: (container) => {
      const rect = this.createRect(this.shapePatternSize, '', color, 2);
      container.appendChild(rect);
    },
  });

  private createRect = (size: number, fill: string, stroke: string, strokeWidth: number) => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.setAttribute('width', size.toString());
    rect.setAttribute('height', size.toString());
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth.toString());

    return rect;
  };
}

@NgModule({
  imports: [
    BrowserModule,
    DxPieChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
