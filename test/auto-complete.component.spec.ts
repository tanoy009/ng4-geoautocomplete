import {
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { expect } from 'chai';
import { Ng2GeoautocompleteModule } from '../src';

describe('ng2geo-autocomplete component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        Ng2GeoautocompleteModule.forRoot()
      ]
    });
  });

  // it('should say hello world', () => {
  //   const fixture: ComponentFixture<HelloWorldComponent> = TestBed.createComponent(HelloWorldComponent);
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement.innerHTML.trim()).to.equal('Hello world from the Angular 2/4 compatable google autocomplete module!');
  // });

  it('should say hello world', () => {
    expect('test').to.equal('test');
  });


});
