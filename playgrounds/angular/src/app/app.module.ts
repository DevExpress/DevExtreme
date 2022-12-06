import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RadioGroupExampleModule } from './examples/radio-group';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from './routing/app.routing-module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    // --- example modules ---
    RadioGroupExampleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
