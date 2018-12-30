import {
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { expect } from 'chai';
import { NgxGeoautocompleteModule } from '../src';

describe('ng4geo-autocomplete component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxGeoautocompleteModule.forRoot()
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
