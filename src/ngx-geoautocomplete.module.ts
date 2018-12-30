import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AutoCompleteComponent } from './auto-complete.component';
import { AutoCompleteSearchService } from './auto-complete.service';
import { LocalStorageService } from './storage.service';
import { GlobalRef, BrowserGlobalRef } from './windowRef.service';
@NgModule({
  declarations: [
    AutoCompleteComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    AutoCompleteComponent
  ],
  providers : [{ provide: GlobalRef, useClass: BrowserGlobalRef }, AutoCompleteSearchService, LocalStorageService]
})
export class NgxGeoautocompleteModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxGeoautocompleteModule
    };
  }

}
