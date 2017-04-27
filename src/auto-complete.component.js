"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var windowRef_service_1 = require("./windowRef.service");
var auto_complete_service_1 = require("./auto-complete.service");
var AutoCompleteComponent = (function () {
    function AutoCompleteComponent(platformId, _elmRef, _global, _autoCompleteSearchService) {
        this.platformId = platformId;
        this._elmRef = _elmRef;
        this._global = _global;
        this._autoCompleteSearchService = _autoCompleteSearchService;
        this.componentCallback = new core_1.EventEmitter();
        this.locationInput = '';
        this.gettingCurrentLocationFlag = false;
        this.dropdownOpen = false;
        this.recentDropdownOpen = false;
        this.currentLocationFlag = false;
        this.queryItems = [];
        this.isSettingsError = false;
        this.settingsErrorMsg = '';
        this.selectedDataIndex = -1;
        this.recentSearchData = [];
        this.settings = {};
        this.defaultSettings = {
            geoPredictionServerUrl: '',
            geoLatLangServiceUrl: '',
            geoLocDetailServerUrl: '',
            serverResponseListHierarchy: [],
            serverResponseatLangHierarchy: [],
            serverResponseDetailHierarchy: [],
            useGoogleGeoApi: true,
            inputPlaceholderText: 'Enter Area Name',
            showSearchButton: true,
            showRecentSearch: true,
            showCurrentLocation: true,
            recentStorageName: 'recentSearches',
            currentLocIconUrl: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDg3Ljg1OSA4Ny44NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDg3Ljg1OSA4Ny44NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iTWFya2VyIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTgwLjkzOCw0MC40ODNDNzkuMjk0LDIyLjcxMyw2NS4wOTMsOC41MjgsNDcuMzEyLDYuOTE3VjBoLTYuNzU3djYuOTE4QzIyLjc3Myw4LjUyOCw4LjU3MiwyMi43MTQsNi45Myw0MC40ODNIMHY2Ljc1NyAgICAgaDYuOTE5YzEuNTgyLDE3LjgzOCwxNS44MSwzMi4wODcsMzMuNjM2LDMzLjcwMXY2LjkxOGg2Ljc1N3YtNi45MThjMTcuODI2LTEuNjEzLDMyLjA1NC0xNS44NjIsMzMuNjM2LTMzLjcwMWg2LjkxMXYtNi43NTcgICAgIEg4MC45Mzh6IE00Ny4zMTIsNzQuMTQ2di02LjU1OGgtNi43NTd2Ni41NThDMjYuNDU3LDcyLjU4LDE1LjI0Miw2MS4zNDUsMTMuNzA4LDQ3LjI0aDYuNTY2di02Ljc1N2gtNi41NDkgICAgIGMxLjU5MS0xNC4wNDEsMTIuNzc3LTI1LjIxLDI2LjgyOS0yNi43NzF2Ni41NjRoNi43NTZ2LTYuNTY0YzE0LjA1MywxLjU2LDI1LjIzOSwxMi43MjksMjYuODMsMjYuNzcxaC02LjU1NnY2Ljc1N2g2LjU3MyAgICAgQzcyLjYyNSw2MS4zNDUsNjEuNDA5LDcyLjU4LDQ3LjMxMiw3NC4xNDZ6IE00My45MzQsMzMuNzI3Yy01LjU5NSwwLTEwLjEzNSw0LjUzMy0xMC4xMzUsMTAuMTMxICAgICBjMCw1LjU5OSw0LjU0LDEwLjEzOSwxMC4xMzUsMTAuMTM5czEwLjEzNC00LjU0LDEwLjEzNC0xMC4xMzlDNTQuMDY4LDM4LjI2LDQ5LjUyNywzMy43MjcsNDMuOTM0LDMzLjcyN3oiIGZpbGw9IiMwMDAwMDAiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==',
            searchIconUrl: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K',
            locationIconUrl: 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Ny43MjQgNDg3LjcyNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg3LjcyNCA0ODcuNzI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIzNi45MjUsMC4xMjRjLTk2LjksMy40LTE3Ny40LDc5LTE4Ni43LDE3NS41Yy0xLjksMTkuMy0wLjgsMzgsMi42LDU1LjlsMCwwYzAsMCwwLjMsMi4xLDEuMyw2LjEgICAgYzMsMTMuNCw3LjUsMjYuNCwxMy4xLDM4LjZjMTkuNSw0Ni4yLDY0LjYsMTIzLjUsMTY1LjgsMjA3LjZjNi4yLDUuMiwxNS4zLDUuMiwyMS42LDBjMTAxLjItODQsMTQ2LjMtMTYxLjMsMTY1LjktMjA3LjcgICAgYzUuNy0xMi4yLDEwLjEtMjUuMSwxMy4xLTM4LjZjMC45LTMuOSwxLjMtNi4xLDEuMy02LjFsMCwwYzIuMy0xMiwzLjUtMjQuMywzLjUtMzYuOUM0MzguNDI1LDg0LjcyNCwzNDcuNTI1LTMuNzc2LDIzNi45MjUsMC4xMjQgICAgeiBNMjQzLjgyNSwyOTEuMzI0Yy01Mi4yLDAtOTQuNS00Mi4zLTk0LjUtOTQuNXM0Mi4zLTk0LjUsOTQuNS05NC41czk0LjUsNDIuMyw5NC41LDk0LjVTMjk2LjAyNSwyOTEuMzI0LDI0My44MjUsMjkxLjMyNHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K'
        };
    }
    AutoCompleteComponent.prototype.ngOnInit = function () {
        if (this.userSettings && typeof (this.userSettings) === 'object') {
            this.setUserSettings();
        }
        else {
            this.settings = this.defaultSettings;
        }
        if (this.settings.showRecentSearch) {
            this.getRecentLocations();
        }
        if (!this.settings.useGoogleGeoApi) {
            if (!this.settings.geoPredictionServerUrl) {
                this.isSettingsError = true;
                this.settingsErrorMsg = this.settingsErrorMsg + 'Prediction custom server url is not defined. Please use "geoPredictionServerUrl" key to set. ';
            }
            if (!this.settings.geoLatLangServiceUrl) {
                this.isSettingsError = true;
                this.settingsErrorMsg = this.settingsErrorMsg + 'Latitude and longitude custom server url is not defined. Please use "geoLatLangServiceUrl" key to set. ';
            }
            if (!this.settings.geoLocDetailServerUrl) {
                this.isSettingsError = true;
                this.settingsErrorMsg = this.settingsErrorMsg + 'Location detail custom server url is not defined. Please use "geoLocDetailServerUrl" key to set. ';
            }
        }
        this.currentLocationFlag = this.settings.showCurrentLocation;
    };
    //function to set user settings if it is available.
    AutoCompleteComponent.prototype.setUserSettings = function () {
        var keys = Object.keys(this.defaultSettings);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var value = keys_1[_i];
            this.settings[value] = (this.userSettings[value] != undefined) ? this.userSettings[value] : this.defaultSettings[value];
        }
    };
    //function called when there is a change in input. (Binded with view)
    AutoCompleteComponent.prototype.searchinputCallback = function (event) {
        var inputVal = this.locationInput;
        if ((event.keyCode === 40) || (event.keyCode === 38) || (event.keyCode === 13)) {
            this.navigateInList(event.keyCode);
        }
        else if (inputVal) {
            this.getListQuery(inputVal);
        }
        else {
            this.queryItems = [];
            if (this.settings.showRecentSearch) {
                this.showRecentSearch();
            }
            else {
                this.dropdownOpen = false;
            }
        }
    };
    //function to get the autocomplete list based on user input.
    AutoCompleteComponent.prototype.getListQuery = function (value) {
        var _this = this;
        this.recentDropdownOpen = false;
        if (this.settings.useGoogleGeoApi) {
            this._autoCompleteSearchService.getGeoPrediction(value).then(function (result) {
                _this.updateListItem(result);
            });
        }
        else {
            this._autoCompleteSearchService.getPredictions(this.settings.geoPredictionServerUrl, value).then(function (result) {
                result = _this.extractServerList(_this.settings.serverResponseListHierarchy, result);
                _this.updateListItem(result);
            });
        }
    };
    //function to extratc custom data which is send by the server.
    AutoCompleteComponent.prototype.extractServerList = function (arrayList, data) {
        if (arrayList.length) {
            var _tempData = data;
            for (var _i = 0, arrayList_1 = arrayList; _i < arrayList_1.length; _i++) {
                var key = arrayList_1[_i];
                _tempData = _tempData[key];
            }
            return _tempData;
        }
        else {
            return data;
        }
    };
    //function to update the predicted list.
    AutoCompleteComponent.prototype.updateListItem = function (listData) {
        this.queryItems = listData ? listData : [];
        this.dropdownOpen = true;
    };
    //function to show the recent search result.
    AutoCompleteComponent.prototype.showRecentSearch = function () {
        var _this = this;
        this.recentDropdownOpen = true;
        this.dropdownOpen = true;
        this._autoCompleteSearchService.getRecentList(this.settings.recentStorageName).then(function (result) {
            if (result) {
                _this.queryItems = result;
            }
            else {
                _this.queryItems = [];
            }
        });
    };
    //function to navigate through list when up and down keyboard key is pressed;
    AutoCompleteComponent.prototype.navigateInList = function (keyCode) {
        var arrayIndex = 0;
        //arrow down
        if (keyCode == 40) {
            if (this.selectedDataIndex >= 0) {
                arrayIndex = ((this.selectedDataIndex + 1) <= (this.queryItems.length - 1)) ? (this.selectedDataIndex + 1) : 0;
            }
            this.activeListNode(arrayIndex);
        }
        else if (keyCode == 38) {
            if (this.selectedDataIndex >= 0) {
                arrayIndex = ((this.selectedDataIndex - 1) >= 0) ? (this.selectedDataIndex - 1) : (this.queryItems.length - 1);
            }
            else {
                arrayIndex = this.queryItems.length - 1;
            }
            this.activeListNode(arrayIndex);
        }
    };
    //function to process the search query when pressed enter.
    AutoCompleteComponent.prototype.processSearchQuery = function () {
        if (this.queryItems.length) {
            if (this.selectedDataIndex > -1) {
                this.selectedListNode(this.selectedDataIndex);
            }
            else {
                this.selectedListNode(0);
            }
        }
    };
    //function to get user current location from the device.
    AutoCompleteComponent.prototype.currentLocationSelected = function () {
        var _this = this;
        if (common_1.isPlatformBrowser(this.platformId)) {
            this.gettingCurrentLocationFlag = true;
            this.dropdownOpen = false;
            this._autoCompleteSearchService.getGeoCurrentLocation().then(function (result) {
                if (!result) {
                    _this.gettingCurrentLocationFlag = false;
                }
                else {
                    _this.getCurrentLocationInfo(result);
                }
            });
        }
    };
    //function to execute to get location detail based on latitude and longitude.
    AutoCompleteComponent.prototype.getCurrentLocationInfo = function (latlng) {
        var _this = this;
        if (this.settings.useGoogleGeoApi) {
            this._autoCompleteSearchService.getGeoLatLngDetail(latlng).then(function (result) {
                if (result) {
                    _this.setRecentLocation(result);
                }
                _this.gettingCurrentLocationFlag = false;
            });
        }
        else {
            this._autoCompleteSearchService.getLatLngDetail(this.settings.geoLatLangServiceUrl, latlng.lat, latlng.lng).then(function (result) {
                if (result) {
                    result = _this.extractServerList(_this.settings.serverResponseatLangHierarchy, result);
                    _this.setRecentLocation(result);
                }
                _this.gettingCurrentLocationFlag = false;
            });
        }
    };
    //function to execute when user hover over autocomplete list.(binded with view)
    AutoCompleteComponent.prototype.activeListNode = function (index) {
        for (var i = 0; i < this.queryItems.length; i++) {
            if (index === i) {
                this.queryItems[i].active = true;
                this.selectedDataIndex = index;
            }
            else {
                this.queryItems[i].active = false;
            }
        }
    };
    //function to execute when user select the autocomplete list.(binded with view)
    AutoCompleteComponent.prototype.selectedListNode = function (index) {
        this.dropdownOpen = false;
        if (this.recentDropdownOpen) {
            this.setRecentLocation(this.queryItems[index]);
        }
        else {
            this.getPlaceLocationInfo(this.queryItems[index]);
        }
    };
    //function to retrive the location info based on goovle place id.
    AutoCompleteComponent.prototype.getPlaceLocationInfo = function (selectedData) {
        var _this = this;
        if (this.settings.useGoogleGeoApi) {
            this._autoCompleteSearchService.getGeoPlaceDetail(selectedData.place_id).then(function (data) {
                if (data) {
                    _this.setRecentLocation(data);
                }
            });
        }
        else {
            this._autoCompleteSearchService.getPlaceDetails(this.settings.geoLocDetailServerUrl, selectedData.place_id).then(function (result) {
                if (result) {
                    result = _this.extractServerList(_this.settings.serverResponseDetailHierarchy, result);
                    _this.setRecentLocation(result);
                }
            });
        }
    };
    //function to store the selected user search in the localstorage.
    AutoCompleteComponent.prototype.setRecentLocation = function (data) {
        data.description = data.description ? data.description : data.formatted_address;
        data.active = false;
        this.selectedDataIndex = -1;
        this.locationInput = data.description;
        console.log(this.locationInput);
        if (this.settings.showRecentSearch) {
            this._autoCompleteSearchService.addRecentList(this.settings.recentStorageName, data);
            this.getRecentLocations();
        }
        //below code will execute only when user press enter and it emit a callbakc to the parent component.
        this.componentCallback.emit(data);
    };
    //function to retrive the stored recent user search from the localstorage.
    AutoCompleteComponent.prototype.getRecentLocations = function () {
        var _this = this;
        this._autoCompleteSearchService.getRecentList(this.settings.recentStorageName).then(function (data) {
            _this.recentSearchData = (data && data.length) ? data : [];
        });
    };
    //function to close the autocomplete list when clicked outside. (binded with view)
    AutoCompleteComponent.prototype.closeAutocomplete = function (event) {
        if (!this._elmRef.nativeElement.contains(event.target)) {
            this.selectedDataIndex = -1;
            this.dropdownOpen = false;
        }
    };
    return AutoCompleteComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AutoCompleteComponent.prototype, "userSettings", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], AutoCompleteComponent.prototype, "componentCallback", void 0);
AutoCompleteComponent = __decorate([
    core_1.Component({
        selector: 'ng2Geo-autocomplete',
        templateUrl: './src/auto-complete.component.html',
        styleUrls: ['./src/auto-complete.component.css'],
        host: {
            '(document:click)': 'closeAutocomplete($event)',
        }
    }),
    __param(0, core_1.Inject(core_1.PLATFORM_ID)),
    __metadata("design:paramtypes", [Object, core_1.ElementRef, windowRef_service_1.GlobalRef, auto_complete_service_1.AutoCompleteSearchService])
], AutoCompleteComponent);
exports.AutoCompleteComponent = AutoCompleteComponent;
//# sourceMappingURL=auto-complete.component.js.map