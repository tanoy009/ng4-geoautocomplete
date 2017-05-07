import { Component } from '@angular/core';

@Component({
  selector: 'ng2geo-autocomplete-demoapp',
  templateUrl: './demo/demo.component.html'
})
export class DemoComponent {
	public componentData1: any = '';
    public componentData2: any = '';
    public componentData3: any = '';
    public componentData4: any = '';
    public componentData5: any = '';
    public userSettings2: any = {
        showRecentSearch: false,
        searchIconUrl: 'http://downloadicons.net/sites/default/files/identification-search-magnifying-glass-icon-73159.png'
    };
    public userSettings3: any = {
        showCurrentLocation: false,
        resOnSearchButtonClickOnly: true,
        inputPlaceholderText: 'Type anything and you will get a location',
        recentStorageName: 'componentData3'
    };
    public userSettings4: any = {
        showSearchButton: false,
        currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
        locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
        recentStorageName: 'componentData4'
    };
    public userSettings5: any = {
        useGoogleGeoApi: false,
        geoLocDetailServerUrl: 'https://www.simplymovein.com/api/v4/get-location',
        geoPredictionServerUrl: 'https://www.simplymovein.com/api/v4/search-location',
        geoLatLangServiceUrl: 'https://www.simplymovein.com/api/v4/geocode',
        serverResponseListHierarchy: ['data', 'items'],
        serverResponseatLangHierarchy: ['data'],
        serverResponseDetailHierarchy: ['data'],
        recentStorageName: 'componentData5'
    };

    public userSettings5_1: any = {
        useGoogleGeoApi: false,
        geoLocDetailServerUrl: 'https://www.XXX.com/api/v4/get-location',
        geoPredictionServerUrl: 'https://www.XXX.com/api/v4/search-location',
        geoLatLangServiceUrl: 'https://www.XXX.com/api/v4/geocode',
        serverResponseListHierarchy: ['data', 'items'],
        serverResponseatLangHierarchy: ['data'],
        serverResponseDetailHierarchy: ['data'],
        recentStorageName: 'componentData5'
    };

	constructor() {
    console.log('in demo component');
  }

    getCodeHtml(data: any): any {
        let _temp: any = JSON.stringify(data);
        _temp = _temp.split(',').join(',<br>');
        _temp = _temp.split('{').join('{<br>');
        _temp = _temp.split('}').join('<br>}');
        return _temp;
    }
	autoCompleteCallback1(data: any): any {
		this.componentData1 = JSON.stringify(data);
	}

    autoCompleteCallback2(data: any): any {
        this.componentData2 = JSON.stringify(data);
    }

    autoCompleteCallback3(data: any): any {
        this.componentData3 = JSON.stringify(data);
    }

    autoCompleteCallback4(data: any): any {
        this.componentData4 = JSON.stringify(data);
    }

    autoCompleteCallback5(data: any): any {
        this.componentData5 = JSON.stringify(data);
    }
}
