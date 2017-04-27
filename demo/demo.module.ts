import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2GeoautocompleteModule } from '../src';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, Ng2GeoautocompleteModule.forRoot()],
  bootstrap: [DemoComponent]
})
export class DemoModule {}