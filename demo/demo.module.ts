import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGeoautocompleteModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, NgxGeoautocompleteModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}
