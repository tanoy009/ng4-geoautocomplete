# Angular 4 compatable google autocomplete
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

angular 4 compatable google autocomplete with server side api support and AOT enabled

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

You may also find it useful to view the [demo source](https://github.com/tanoy009/ng4-geoautocomplete/blob/master/demo/demo.component.ts).

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
