import { Component, PLATFORM_ID, Inject, Input, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { GlobalRef } from './windowRef.service';
import { AutoCompleteSearchService } from './auto-complete.service';

export interface Settings {
  geoPredictionServerUrl?: string;
  geoLatLangServiceUrl?: string;
  geoLocDetailServerUrl?: string;
  geoComponentRestriction?: string;
  serverResponseListHierarchy?: any;
  serverResponseatLangHierarchy?: any;
  serverResponseDetailHierarchy?: any;
  resOnSearchButtonClickOnly?: boolean;
  useGoogleGeoApi?: boolean;
  inputPlaceholderText?: string;
  showSearchButton?: boolean;
  showRecentSearch?: boolean;
  showCurrentLocation?: boolean;
  recentStorageName?: string;
  currentLocIconUrl?: string;
  searchIconUrl?: string;
  locationIconUrl?: string;
}

@Component({
  selector: 'ng4geo-autocomplete',
  templateUrl: './src/auto-complete.component.html',
  styleUrls: ['./src/auto-complete.component.css'],
  host: {
    '(document:click)': 'closeAutocomplete($event)',
  }
})
export class AutoCompleteComponent implements OnInit {
	@Input() userSettings: Settings;
  @Output()
  componentCallback: EventEmitter<any> = new EventEmitter<any>();

  public locationInput: string = '';
  public gettingCurrentLocationFlag: boolean = false;
  public dropdownOpen: boolean = false;
  public recentDropdownOpen: boolean  = false;
  public queryItems: any = [];
  public isSettingsError: boolean = false;
  public settingsErrorMsg: string = '';
  private selectedDataIndex: number = -1;
  private recentSearchData: any = [];
  private userSelectedOption: any = '';
  private settings: Settings = {};
  private defaultSettings: Settings = {
    geoPredictionServerUrl: '',
    geoLatLangServiceUrl: '',
    geoLocDetailServerUrl: '',
    geoComponentRestriction: 'in',
    serverResponseListHierarchy: [],
    serverResponseatLangHierarchy: [],
    serverResponseDetailHierarchy: [],
    resOnSearchButtonClickOnly: false,
    useGoogleGeoApi: true,
    inputPlaceholderText: 'Enter Area Name',
    showSearchButton: true,
    showRecentSearch: true,
    showCurrentLocation: true,
    recentStorageName: 'recentSearches',
    currentLocIconUrl: '',
    searchIconUrl: '',
    locationIconUrl: ''
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private _elmRef: ElementRef, private _global: GlobalRef,
  private _autoCompleteSearchService: AutoCompleteSearchService) {

  }

  ngOnInit(): any {
    this.settings = this.setUserSettings();

    if (this.settings.showRecentSearch) {
      this.getRecentLocations();
    }
    if (!this.settings.useGoogleGeoApi) {
      if (!this.settings.geoPredictionServerUrl) {
        this.isSettingsError = true;
        this.settingsErrorMsg = this.settingsErrorMsg +
        'Prediction custom server url is not defined. Please use "geoPredictionServerUrl" key to set. ';
      }
      if (!this.settings.geoLatLangServiceUrl) {
        this.isSettingsError = true;
        this.settingsErrorMsg = this.settingsErrorMsg +
        'Latitude and longitude custom server url is not defined. Please use "geoLatLangServiceUrl" key to set. ';
      }
      if (!this.settings.geoLocDetailServerUrl) {
        this.isSettingsError = true;
        this.settingsErrorMsg = this.settingsErrorMsg +
        'Location detail custom server url is not defined. Please use "geoLocDetailServerUrl" key to set. ';
      }
    }
  }

  //function called when there is a change in input. (Binded with view)
  searchinputCallback(event: any): any {
    let inputVal: any = this.locationInput;
    if ((event.keyCode === 40) || (event.keyCode === 38) || (event.keyCode === 13)) {
      this.navigateInList(event.keyCode);
    } else if (inputVal) {
      this.getListQuery(inputVal);
    } else {
      this.queryItems = [];
      this.userSelectedOption = '';
      if (this.settings.showRecentSearch) {
        this.showRecentSearch();
      }else {
        this.dropdownOpen = false;
      }
    }
  }

  //function to execute when user hover over autocomplete list.(binded with view)
  activeListNode(index: number): any {
    for (let i: number = 0; i < this.queryItems.length; i++) {
      if (index === i) {
        this.queryItems[i].active = true;
        this.selectedDataIndex = index;
      }else {
        this.queryItems[i].active = false;
      }
    }
  }

  //function to execute when user select the autocomplete list.(binded with view)
  selectedListNode(index: number): any {
    this.dropdownOpen = false;
    if (this.recentDropdownOpen) {
      this.setRecentLocation(this.queryItems[index]);
    }else {
      this.getPlaceLocationInfo(this.queryItems[index]);
    }
  }

  //function to close the autocomplete list when clicked outside. (binded with view)
  closeAutocomplete(event: any): any {
    if (!this._elmRef.nativeElement.contains(event.target)) {
      this.selectedDataIndex = -1;
      this.dropdownOpen = false;
    }
  }

  //function to manually trigger the callback to parent component when clicked search button.
  userQuerySubmit(): any {
    if (this.userSelectedOption) {
      this.componentCallback.emit(this.userSelectedOption);
    }else {
      this.componentCallback.emit(false);
    }
  }

  //function to set user settings if it is available.
  private setUserSettings(): Settings {
    let _tempObj: any = {};
    if (this.userSettings && typeof(this.userSettings) === 'object') {
      let keys: string[] = Object.keys(this.defaultSettings);
      for (let value of keys) {
        _tempObj[value] = (this.userSettings[value] !== undefined) ? this.userSettings[value] : this.defaultSettings[value];
      }
      return _tempObj;
    }else {
      return this.defaultSettings;
    }
  }

  //function to get the autocomplete list based on user input.
  private getListQuery(value: string): any {
    this.recentDropdownOpen = false;
    if (this.settings.useGoogleGeoApi) {
      this._autoCompleteSearchService.getGeoPrediction(value, this.settings.geoComponentRestriction).then((result) => {
        this.updateListItem(result);
      });
    }else {
      this._autoCompleteSearchService.getPredictions(this.settings.geoPredictionServerUrl, value).then((result) => {
        result = this.extractServerList(this.settings.serverResponseListHierarchy, result);
        this.updateListItem(result);
      });
    }
  }

  //function to extratc custom data which is send by the server.
  private extractServerList(arrayList: any, data: any): any {
    if (arrayList.length) {
      let _tempData: any = data;
      for (let key of arrayList) {
        _tempData = _tempData[key];
      }
      return _tempData;
    }else {
      return data;
    }
  }

  //function to update the predicted list.
  private updateListItem(listData: any): any {
    this.queryItems = listData ? listData : [];
    this.dropdownOpen = true;
  }

  //function to show the recent search result.
  private showRecentSearch(): any {
    this.recentDropdownOpen = true;
    this.dropdownOpen = true;
    this._autoCompleteSearchService.getRecentList(this.settings.recentStorageName).then((result: any) => {
      if (result) {
        this.queryItems = result;
      }else {
        this.queryItems = [];
      }
    });
  }

  //function to get user current location from the device.
  private currentLocationSelected(): any {
    if (isPlatformBrowser(this.platformId)) {
      this.gettingCurrentLocationFlag = true;
      this.dropdownOpen = false;
      this._autoCompleteSearchService.getGeoCurrentLocation().then((result: any) => {
        if (!result) {
          this.gettingCurrentLocationFlag = false;
        }else {
          this.getCurrentLocationInfo(result);
        }
      });
    }
  }

  //function to navigate through list when up and down keyboard key is pressed;
  private navigateInList(keyCode: number): any {
    let arrayIndex: number = 0;
    //arrow down
    if (keyCode === 40) {
      if (this.selectedDataIndex >= 0) {
        arrayIndex = ((this.selectedDataIndex + 1) <= (this.queryItems.length - 1)) ? (this.selectedDataIndex + 1) : 0;
      }
      this.activeListNode(arrayIndex);
    }else if (keyCode === 38) {//arrow up
      if (this.selectedDataIndex >= 0) {
        arrayIndex = ((this.selectedDataIndex - 1) >= 0) ? (this.selectedDataIndex - 1) : (this.queryItems.length - 1);
      }else {
        arrayIndex = this.queryItems.length - 1;
      }
      this.activeListNode(arrayIndex);
    }
  }

  //function to process the search query when pressed enter.
  private processSearchQuery(): any {
    if (this.queryItems.length) {
      if (this.selectedDataIndex > -1) {
        this.selectedListNode(this.selectedDataIndex);
      }else {
        this.selectedListNode(0);
      }
    }
  }

  //function to execute to get location detail based on latitude and longitude.
  private getCurrentLocationInfo(latlng: any): any {
    if (this.settings.useGoogleGeoApi) {
      this._autoCompleteSearchService.getGeoLatLngDetail(latlng).then((result: any) => {
        if (result) {
         this.setRecentLocation(result);
        }
        this.gettingCurrentLocationFlag = false;
      });
    }else {
      this._autoCompleteSearchService.getLatLngDetail(this.settings.geoLatLangServiceUrl, latlng.lat, latlng.lng).then((result: any) => {
        if (result) {
          result = this.extractServerList(this.settings.serverResponseatLangHierarchy, result);
          this.setRecentLocation(result);
        }
        this.gettingCurrentLocationFlag = false;
      });
    }
  }

  //function to retrive the location info based on goovle place id.
  private getPlaceLocationInfo(selectedData: any): any {
    if (this.settings.useGoogleGeoApi) {
      this._autoCompleteSearchService.getGeoPlaceDetail(selectedData.place_id).then((data: any) => {
        if (data) {
          this.setRecentLocation(data);
        }
      });
    }else {
      this._autoCompleteSearchService.getPlaceDetails(this.settings.geoLocDetailServerUrl, selectedData.place_id).then((result: any) => {
        if (result) {
          result = this.extractServerList(this.settings.serverResponseDetailHierarchy, result);
          this.setRecentLocation(result);
        }
      });
    }
  }

  //function to store the selected user search in the localstorage.
  private setRecentLocation(data: any): any {
    data.description = data.description ? data.description : data.formatted_address;
    data.active = false;
    this.selectedDataIndex = -1;
    this.locationInput = data.description;
    if (this.settings.showRecentSearch) {
      this._autoCompleteSearchService.addRecentList(this.settings.recentStorageName, data);
      this.getRecentLocations();
    }
    this.userSelectedOption = data;
    //below code will execute only when user press enter or select any option selection and it emit a callback to the parent component.
    if (!this.settings.resOnSearchButtonClickOnly) {
      this.componentCallback.emit(data);
    }
  }

  //function to retrive the stored recent user search from the localstorage.
  private getRecentLocations(): any {
    this._autoCompleteSearchService.getRecentList(this.settings.recentStorageName).then((data: any) => {
      this.recentSearchData = (data && data.length) ? data : [];
    });
  }
}
