# Angular 4 compatible google autocomplete
[![Build Status](https://travis-ci.org/tanoy009/ng4-geoautocomplete.svg?branch=master)](https://travis-ci.org/tanoy009/ng4-geoautocomplete)
[![codecov](https://codecov.io/gh/tanoy009/ng4-geoautocomplete/branch/master/graph/badge.svg)](https://codecov.io/gh/tanoy009/ng4-geoautocomplete)
[![npm version](https://badge.fury.io/js/ng4-geoautocomplete.svg)](http://badge.fury.io/js/ng4-geoautocomplete)
[![devDependency Status](https://david-dm.org/tanoy009/ng4-geoautocomplete/dev-status.svg)](https://david-dm.org/tanoy009/ng4-geoautocomplete?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/tanoy009/ng4-geoautocomplete.svg)](https://github.com/tanoy009/ng4-geoautocomplete/issues)
[![GitHub stars](https://img.shields.io/github/stars/tanoy009/ng4-geoautocomplete.svg)](https://github.com/tanoy009/ng4-geoautocomplete/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/tanoy009/ng4-geoautocomplete/master/LICENSE)

## Demo
https://tanoy009.github.io/ng4-geoautocomplete/

## Test Case.
In Pipeline will be updated in a while.

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

angular 4 compatible google autocomplete with server side api support and AOT enabled

## Installation

Install through npm:
```
npm install --save ng4-geoautocomplete
```

Then include in your apps module:

```typescript
import { Component, NgModule } from '@angular/core';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  imports: [
    Ng4GeoautocompleteModule.forRoot()
  ]
})
export class MyModule {}
```
Add google place script in your main file generally referred to 'index.html' (Optional if you want to use google services).

```
<script type="text/javascript" src="https://maps.google.com/maps/api/js?sensor=true&key=XXReplace this with valid keyXX&libraries=places&language=en-US"></script>
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: '<ng4geo-autocomplete (componentCallback)="autoCompleteCallback1($event)"></ng4geo-autocomplete>'
})
export class MyComponent {
	autoCompleteCallback1(selectedData:any) {
		//do any necessery stuff.
	}
}
```

List of settings that can be used to configure the module (all config. are optional):
```typescript
	{
    geoPredictionServerUrl?: string;      //should be a server url which returns list of places upon input query (GET request)
    geoLatLangServiceUrl?: string;        //should be a server url which returns place object upon lat and lon. (GET request)
    geoLocDetailServerUrl?: string;       //should be a server url which returns place details upon placeID received by 'geoPredictionServerUrl' (GET request)
    geoCountryRestriction?: any;          //should be an array of country code where search should be restricted like ['in', 'us', 'pr', 'vi', 'gu', 'mp'] *(Default: 'no restriction')*
    geoTypes?: any;                       //should be an array of Place types defined by [Google api](https://developers.google.com/places/web-service/autocomplete#place_types).
    geoLocation?: any;                    //should be an array in the format [latitude,longitude]. This feature will not work if country restriction is implimented.
    geoRadius?: number;                   //should be a number and should only be used with 'geoLocation'.
    serverResponseListHierarchy?: any;    //should be an array of key from where 'geoPredictionServer' data should be extracted. (see Example.)
    serverResponseatLangHierarchy?: any;  //should be an array of key from where 'geoLatLangService' data should be extracted. (see Example.)
    serverResponseDetailHierarchy?: any;  //should be an array of key from where 'geoLocDetailSerice' data should be extracted. (see Example.)
    resOnSearchButtonClickOnly?: boolean; //when output should be emmited when search button clicked only.
    useGoogleGeoApi?: boolean;            //should set to 'false' when server urls to be used instade of google api. *(Default: true)*
    inputPlaceholderText?: string;        //Input Placeholder text can be changed *(Default: 'Enter Area Name')*
    inputString?: string;                 //Default selected input like prefefined address. *(Default: ''). See Example 3 in Demo after 10 sec*
    showSearchButton?: boolean;           //Search button to be visible or not. *(Default: true)*
    showRecentSearch?: boolean;           //Recent search to be saved & shown to user or not. *(Default: true)*
    showCurrentLocation?: boolean;        //current location option to be visible or not. *(Default: true)*
    recentStorageName?: string;           //Recent seraches are saved in browser localsorage. The key value which is used by the module to save can be changed. *(Default: 'recentSearches')*
    noOfRecentSearchSave?: number;        //Number of recent user entry to be saved . *(Default: 5)*
    currentLocIconUrl?: string;           //Current location icon can be changed *(Should be an image url or svg url)*
    searchIconUrl?: string;               //Search icon can be changed *(Should be an image url or svg url)*
    locationIconUrl?: string;             //Genetal Location icon can be changed *(Should be an image or svg url)*
	}
```
#### NOTE: Component settings can also be altered after component initialization. Please follow the below method to change.
```typescript
this.userSettings: any = {
  inputPlaceholderText: 'This is the placeholder text doring component initialization'
}

this.userSettings['inputPlaceholderText'] = 'This is the placeholder text after doing some external operation after some time';
this.userSettings = Object.assign({},this.userSettings) //Very Important Line to add after modifying settings.
```

#### NOTE: 
'geoTypes' can be used for multiple Place Types like `['(regions)', '(cities)']` OR `['(regions)', 'establishment', 'geocode']`. This will make individual api call for each Place Types to google to fetch lists and then it will merge the resuts with uniqueness.To know avalable Place Types please refer [Google api](https://developers.google.com/places/web-service/autocomplete#place_types).USE THIS FEATURE CAREFULLY<br/><br/>
### You may also find it useful to view the [demo source](https://github.com/tanoy009/ng4-geoautocomplete/blob/master/demo/demo.component.ts).

### You can change the component css in the below manner (You have to set encapsulation to None)
```
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'any-component-name',
  encapsulation: ViewEncapsulation.None,
  template: '<div class="demo"><ng4geo-autocomplete (componentCallback)="autoCompleteCallback1($event)"></ng4geo-autocomplete></div>',
  styles: ['
  .demo #search_places {
    height: 100px;
  }
']
})
```

### You can use it with system js as well

`'ng4-geoautocomplete': 'npm:ng4-geoautocomplete/bundles/ng4-geoautocomplete.umd.js'`

### Usage without a module bundler
```
<script src="node_modules/ng4-geoautocomplete/bundles/ng4-geoautocomplete.umd.js"></script>
<script>
    // everything is exported ng4Geoautocomplete namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://tanoy009.github.io/ng4-geoautocomplete/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
