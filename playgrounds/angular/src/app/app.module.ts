import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DxPagerModule } from '@devexpress/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing-module';
import { PagerExampleModule } from './examples/pager-example';
import { SlideToggleExampleModule } from './examples/slide-toggle-example';
import { HomeComponent } from './home.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        DxPagerModule,
        RouterModule,
        AppRoutingModule,
        SlideToggleExampleModule,
        PagerExampleModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
