import { Component, PLATFORM_ID, Inject, Input, Output, EventEmitter, OnInit, OnChanges, ElementRef } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { GlobalRef } from './windowRef.service';
import { AutoCompleteSearchService } from './auto-complete.service';

export interface Settings {
  geoPredictionServerUrl?: string;
  geoLatLangServiceUrl?: string;
  geoLocDetailServerUrl?: string;
  geoCountryRestriction?: any;
  geoTypes?: any;
  geoLocation?: any;
  geoRadius?: number;
  serverResponseListHierarchy?: any;
  serverResponseatLangHierarchy?: any;
  serverResponseDetailHierarchy?: any;
  resOnSearchButtonClickOnly?: boolean;
  useGoogleGeoApi?: boolean;
  inputPlaceholderText?: string;
  inputString?: string;
  showSearchButton?: boolean;
  showRecentSearch?: boolean;
  showCurrentLocation?: boolean;
  recentStorageName?: string;
  noOfRecentSearchSave?: number;
  currentLocIconUrl?: string;
  searchIconUrl?: string;
  locationIconUrl?: string;
  useCurrentLocationLabel?: string;
  locationsLabel?: string;
  recentSearchesLabel?: string;
}

@Component({
  selector: 'ng4geo-autocomplete',
  template: `
    <div class="custom-autocomplete" *ngIf="!isSettingsError">
      <div class="custom-autocomplete__container" >
        <div class="custom-autocomplete__input" [ngClass]="{'button-included':settings.showSearchButton}">
          <input  [(ngModel)]="locationInput" (click)="searchinputClickCallback($event)"  (keyup)="searchinputCallback($event)"
           type="search" name="search" id="search_places" placeholder="{{settings.inputPlaceholderText}}" autocomplete="off">
          <button class="search-icon" *ngIf="settings.showSearchButton" (click)="userQuerySubmit()">
            <i *ngIf="settings.searchIconUrl" [ngStyle]="{'background-image': 'url(' + settings.searchIconUrl + ')'}"></i>
            <i *ngIf="!settings.searchIconUrl" class="search-default-icon"></i>
          </button>
        </div>
        <pre class="custom-autocomplete__loader" *ngIf="gettingCurrentLocationFlag"><i class="gif"></i></pre>
      </div>
      <ul class="custom-autocomplete__dropdown" *ngIf="dropdownOpen && (settings.showCurrentLocation || queryItems.length)">
        <li *ngIf="settings.showCurrentLocation" class="currentlocation">
          <a href="javascript:;" (click)="currentLocationSelected()">
            <i class="location-icon" *ngIf="settings.currentLocIconUrl" [ngStyle]="{'background-image': 'url(' + settings.currentLocIconUrl + ')'}"></i>{{settings.useCurrentLocationLabel}}
            <i class="location-icon current-default-icon" *ngIf="!settings.currentLocIconUrl"></i>
          </a>
        </li>
        <li class="heading heading-recent" *ngIf="!recentDropdownOpen && queryItems.length"><span>{{settings.locationsLabel}}</span><span class="line line-location"></span></li>
        <li class="heading heading-recent" *ngIf="recentDropdownOpen && queryItems.length">
          <span>{{settings.recentSearchesLabel}}</span><span class="line line-recent"></span>
        </li>
        <li *ngFor = "let data of queryItems;let $index = index" [ngClass]="{'active': data.active}">
          <a href="javascript:;" (mouseover)="activeListNode($index)" (click)="selectedListNode($index)">
            <i class="custom-icon" *ngIf="settings.locationIconUrl" [ngStyle]="{'background-image': 'url(' + settings.locationIconUrl + ')'}"></i>
            <i class="custom-icon location-default-icon" *ngIf="!settings.locationIconUrl"></i>
              <span class="main-text">
                {{data.structured_formatting?.main_text ? data.structured_formatting.main_text : data.description}}
              </span>
              <span class="secondary_text" *ngIf="data.structured_formatting?.secondary_text">{{data.structured_formatting.secondary_text}}</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="custom-autocomplete--error" *ngIf="isSettingsError">{{settingsErrorMsg}}</div>
  `,
  styles: [`
    .custom-autocomplete {
      display: block;
      position: relative;
      width: 100%;
      float: left;
    }

    .custom-autocomplete a, .custom-autocomplete a:hover {
      text-decoration: none;
    }

    .custom-autocomplete--error {
      color: #fff;
      background-color: #fd4f4f;
      padding: 10px;
    }

    .custom-autocomplete__dropdown {
      position: absolute;
      background: #fff;
      margin: 0;
      padding: 0;
      width: 100%;
      list-style: none;
      border: 1px solid #909090;
      z-index: 99;
      top: 50px;
    }
    .custom-autocomplete__dropdown li {
      float: left;
      width: 100%;
      font-size: 15px;
    }
    .custom-autocomplete__dropdown a {
      width: 100%;
      color: #353535;
      float: left;
      padding: 8px 10px;
    }
    .custom-autocomplete__dropdown a:hover {
      text-decoration: none;
    }
    .custom-autocomplete__dropdown .currentlocation {
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .custom-autocomplete__dropdown .currentlocation a {
      padding: 10px 10px 10px 13px;
      font-size: 14px;
    }
    .custom-autocomplete__dropdown .currentlocation a:hover {
      background-color: #eeeded;
    }
    .custom-autocomplete__dropdown .currentlocation .location-icon {
      width: 16px;
      height: 16px;
      background-size: cover;
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDg3Ljg1OSA4Ny44NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDg3Ljg1OSA4Ny44NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iTWFya2VyIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTgwLjkzOCw0MC40ODNDNzkuMjk0LDIyLjcxMyw2NS4wOTMsOC41MjgsNDcuMzEyLDYuOTE3VjBoLTYuNzU3djYuOTE4QzIyLjc3Myw4LjUyOCw4LjU3MiwyMi43MTQsNi45Myw0MC40ODNIMHY2Ljc1NyAgICAgaDYuOTE5YzEuNTgyLDE3LjgzOCwxNS44MSwzMi4wODcsMzMuNjM2LDMzLjcwMXY2LjkxOGg2Ljc1N3YtNi45MThjMTcuODI2LTEuNjEzLDMyLjA1NC0xNS44NjIsMzMuNjM2LTMzLjcwMWg2LjkxMXYtNi43NTcgICAgIEg4MC45Mzh6IE00Ny4zMTIsNzQuMTQ2di02LjU1OGgtNi43NTd2Ni41NThDMjYuNDU3LDcyLjU4LDE1LjI0Miw2MS4zNDUsMTMuNzA4LDQ3LjI0aDYuNTY2di02Ljc1N2gtNi41NDkgICAgIGMxLjU5MS0xNC4wNDEsMTIuNzc3LTI1LjIxLDI2LjgyOS0yNi43NzF2Ni41NjRoNi43NTZ2LTYuNTY0YzE0LjA1MywxLjU2LDI1LjIzOSwxMi43MjksMjYuODMsMjYuNzcxaC02LjU1NnY2Ljc1N2g2LjU3MyAgICAgQzcyLjYyNSw2MS4zNDUsNjEuNDA5LDcyLjU4LDQ3LjMxMiw3NC4xNDZ6IE00My45MzQsMzMuNzI3Yy01LjU5NSwwLTEwLjEzNSw0LjUzMy0xMC4xMzUsMTAuMTMxICAgICBjMCw1LjU5OSw0LjU0LDEwLjEzOSwxMC4xMzUsMTAuMTM5czEwLjEzNC00LjU0LDEwLjEzNC0xMC4xMzlDNTQuMDY4LDM4LjI2LDQ5LjUyNywzMy43MjcsNDMuOTM0LDMzLjcyN3oiIGZpbGw9IiMwMDAwMDAiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
      float: left;
      margin-right: 10px;
    }
    .custom-autocomplete__dropdown .heading {
      padding: 13px 10px 7px 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 13px;
      position: relative;
    }
    .custom-autocomplete__dropdown .heading .line {
      border-top: 1px solid #c2c2c2;
      width: calc(100% - 115px);
      display: inline-block;
      position: absolute;
      top: 21px;
      left: 100px;
    }

    .custom-autocomplete__dropdown .heading .line-location {
      left: 100px;
      top: 16px;
      width: calc(100% - 110px);
    }

    .custom-autocomplete__dropdown .heading .line-recent {
      left: 158px;
      top: 16px;
      width: calc(100% - 168px);
    }
    .custom-autocomplete__dropdown .heading-recent {
      padding-top: 8px;
    }
    .custom-autocomplete__dropdown .custom-icon {
      width: 16px;
      height: 16px;
      background-size: cover;
      vertical-align: bottom;
      display: inline-block;
      margin-right: 4px;
    }
    .custom-autocomplete__dropdown .main-text {
      padding-right: 4px;
      font-weight: 700;
    }
    .custom-autocomplete__dropdown .secondary_text {
      font-size: 12px;
      color: #909090;
    }
    .custom-autocomplete__dropdown .active a {
      background-color: #ffe0cd;
    }
    .custom-autocomplete__loader {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      background: white;
    }
    .custom-autocomplete__loader .gif {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLXJpcHBsZSI+PHBhdGggZmlsbD0ibm9uZSIgY2xhc3M9ImJrIiBkPSJNMCAwaDEwMHYxMDBIMHoiLz48Zz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjBzIiBrZXlUaW1lcz0iMDswLjMzOzEiIHZhbHVlcz0iMTsxOzAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjYWZhZmI3IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwcyIga2V5VGltZXM9IjA7MC4zMzsxIiB2YWx1ZXM9IjA7MjI7NDQiLz48L2NpcmNsZT48L2c+PGc+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIxcyIga2V5VGltZXM9IjA7MC4zMzsxIiB2YWx1ZXM9IjE7MTswIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iI2ZmYTYzMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMXMiIGtleVRpbWVzPSIwOzAuMzM7MSIgdmFsdWVzPSIwOzIyOzQ0Ii8+PC9jaXJjbGU+PC9nPjwvc3ZnPg==);
      background-size: cover;
      width: 30px;
      height: 30px;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      position: absolute;
    }
    .custom-autocomplete__container,.custom-autocomplete__input {
      width: inherit;
      float: inherit;
      position: relative;
    }

    .custom-autocomplete__input input{
      margin: 0;
      padding: 10px;
      height: 50px;
      border: 1px solid #ccc;
      display: block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      &::-webkit-input-placeholder {
         color: #868484;
      }

      &:-moz-placeholder { /* Firefox 18- */
         color: #868484;
      }

      &::-moz-placeholder {  /* Firefox 19+ */
         color: #868484;
      }

      &:-ms-input-placeholder {
         color: #868484;
      }
    }

    .button-included input{
      padding-right: 60px;
    }

    .search-icon {
      position: absolute;
      right: 0;
      width: 55px;
      top: 0;
      height: 100%;
      background-color: transparent;
      border-bottom: 0;
      border-top: 0;
      border-right: 0;
      border-left: 1px solid #ccc;
    }

    .search-icon i {
      background-size: cover;
      height: 23px;
      width: 23px;
      display: inline-block;
    }

    .search-default-icon {
      background-image: url('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K');
    }

    .location-default-icon {
      background-image: url('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4Ny43MjQgNDg3LjcyNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDg3LjcyNCA0ODcuNzI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIzNi45MjUsMC4xMjRjLTk2LjksMy40LTE3Ny40LDc5LTE4Ni43LDE3NS41Yy0xLjksMTkuMy0wLjgsMzgsMi42LDU1LjlsMCwwYzAsMCwwLjMsMi4xLDEuMyw2LjEgICAgYzMsMTMuNCw3LjUsMjYuNCwxMy4xLDM4LjZjMTkuNSw0Ni4yLDY0LjYsMTIzLjUsMTY1LjgsMjA3LjZjNi4yLDUuMiwxNS4zLDUuMiwyMS42LDBjMTAxLjItODQsMTQ2LjMtMTYxLjMsMTY1LjktMjA3LjcgICAgYzUuNy0xMi4yLDEwLjEtMjUuMSwxMy4xLTM4LjZjMC45LTMuOSwxLjMtNi4xLDEuMy02LjFsMCwwYzIuMy0xMiwzLjUtMjQuMywzLjUtMzYuOUM0MzguNDI1LDg0LjcyNCwzNDcuNTI1LTMuNzc2LDIzNi45MjUsMC4xMjQgICAgeiBNMjQzLjgyNSwyOTEuMzI0Yy01Mi4yLDAtOTQuNS00Mi4zLTk0LjUtOTQuNXM0Mi4zLTk0LjUsOTQuNS05NC41czk0LjUsNDIuMyw5NC41LDk0LjVTMjk2LjAyNSwyOTEuMzI0LDI0My44MjUsMjkxLjMyNHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K');
    }

    .current-default-icon {
      background-image: url('data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDg3Ljg1OSA4Ny44NTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDg3Ljg1OSA4Ny44NTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iTWFya2VyIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTgwLjkzOCw0MC40ODNDNzkuMjk0LDIyLjcxMyw2NS4wOTMsOC41MjgsNDcuMzEyLDYuOTE3VjBoLTYuNzU3djYuOTE4QzIyLjc3Myw4LjUyOCw4LjU3MiwyMi43MTQsNi45Myw0MC40ODNIMHY2Ljc1NyAgICAgaDYuOTE5YzEuNTgyLDE3LjgzOCwxNS44MSwzMi4wODcsMzMuNjM2LDMzLjcwMXY2LjkxOGg2Ljc1N3YtNi45MThjMTcuODI2LTEuNjEzLDMyLjA1NC0xNS44NjIsMzMuNjM2LTMzLjcwMWg2LjkxMXYtNi43NTcgICAgIEg4MC45Mzh6IE00Ny4zMTIsNzQuMTQ2di02LjU1OGgtNi43NTd2Ni41NThDMjYuNDU3LDcyLjU4LDE1LjI0Miw2MS4zNDUsMTMuNzA4LDQ3LjI0aDYuNTY2di02Ljc1N2gtNi41NDkgICAgIGMxLjU5MS0xNC4wNDEsMTIuNzc3LTI1LjIxLDI2LjgyOS0yNi43NzF2Ni41NjRoNi43NTZ2LTYuNTY0YzE0LjA1MywxLjU2LDI1LjIzOSwxMi43MjksMjYuODMsMjYuNzcxaC02LjU1NnY2Ljc1N2g2LjU3MyAgICAgQzcyLjYyNSw2MS4zNDUsNjEuNDA5LDcyLjU4LDQ3LjMxMiw3NC4xNDZ6IE00My45MzQsMzMuNzI3Yy01LjU5NSwwLTEwLjEzNSw0LjUzMy0xMC4xMzUsMTAuMTMxICAgICBjMCw1LjU5OSw0LjU0LDEwLjEzOSwxMC4xMzUsMTAuMTM5czEwLjEzNC00LjU0LDEwLjEzNC0xMC4xMzlDNTQuMDY4LDM4LjI2LDQ5LjUyNywzMy43MjcsNDMuOTM0LDMzLjcyN3oiIGZpbGw9IiMwMDAwMDAiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==');
    }

    .custom-autocomplete__container .searchpage {
      margin-top: 0;
      padding: 0;
      height: 55px;
      border: none;
    }

  `],
  host: {
    '(document:click)': 'closeAutocomplete($event)',
  }
})
export class AutoCompleteComponent implements OnInit, OnChanges {
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
  public settings: Settings = {};
  private moduleinit: boolean = false;
  private selectedDataIndex: number = -1;
  private recentSearchData: any = [];
  private userSelectedOption: any = '';
  private defaultSettings: Settings = {
    geoPredictionServerUrl: '',
    geoLatLangServiceUrl: '',
    geoLocDetailServerUrl: '',
    geoCountryRestriction: [],
    geoTypes: [],
    geoLocation: [],
    geoRadius: 0,
    serverResponseListHierarchy: [],
    serverResponseatLangHierarchy: [],
    serverResponseDetailHierarchy: [],
    resOnSearchButtonClickOnly: false,
    useGoogleGeoApi: true,
    inputPlaceholderText: 'Enter Area Name',
    inputString: '',
    showSearchButton: true,
    showRecentSearch: true,
    showCurrentLocation: true,
    recentStorageName: 'recentSearches',
    noOfRecentSearchSave: 5,
    currentLocIconUrl: '',
    searchIconUrl: '',
    locationIconUrl: '',
    useCurrentLocationLabel: 'Use Current Location',
    locationsLabel: 'Locations',
    recentSearchesLabel: 'Recent Searches'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private _elmRef: ElementRef, private _global: GlobalRef,
  private _autoCompleteSearchService: AutoCompleteSearchService) {

  }

  ngOnInit(): any {
    if (!this.moduleinit) {
      this.moduleInit();
    }
  }

  ngOnChanges(): any {
    this.moduleinit = true;
    this.moduleInit();
  }


  //function called when click event happens in input box. (Binded with view)
  searchinputClickCallback(event: any): any {
    event.target.select();
    this.searchinputCallback(event);
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
      if (this.userSelectedOption) {
        this.userQuerySubmit('false');
      }
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
  userQuerySubmit(selectedOption?: any): any {
    let _userOption: any = selectedOption === 'false' ? '' : this.userSelectedOption;
    if (_userOption) {
      this.componentCallback.emit({'response': true, 'data': this.userSelectedOption});
    }else {
      this.componentCallback.emit({'response': false, 'reason': 'No user input'});
    }
  }

  //function to get user current location from the device.
  currentLocationSelected(): any {
    if (isPlatformBrowser(this.platformId)) {
      this.gettingCurrentLocationFlag = true;
      this.dropdownOpen = false;
      this._autoCompleteSearchService.getGeoCurrentLocation().then((result: any) => {
        if (!result) {
          this.gettingCurrentLocationFlag = false;
          this.componentCallback.emit({'response': false, 'reason': 'Failed to get geo location'});
        }else {
          this.getCurrentLocationInfo(result);
        }
      });
    }
  }

  //module initialization happens. function called by ngOninit and ngOnChange
  private moduleInit(): any {
    this.settings = this.setUserSettings();
    //condition to check if Radius is set without location detail.
    if (this.settings.geoRadius) {
        if (this.settings.geoLocation.length !== 2) {
          this.isSettingsError = true;
          this.settingsErrorMsg = this.settingsErrorMsg +
          'Radius should be used with GeoLocation. Please use "geoLocation" key to set lat and lng. ';
        }
    }

    //condition to check if lat and lng is set and radious is not set then it will set to 20,000KM by default
    if ((this.settings.geoLocation.length === 2) && !this.settings.geoRadius) {
      this.settings.geoRadius = 20000000;
    }
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
    this.locationInput = this.settings.inputString;
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
      let _tempParams: any = {
        'query': value,
        'countryRestriction': this.settings.geoCountryRestriction,
        'geoTypes': this.settings.geoTypes
      };
      if (this.settings.geoLocation.length === 2) {
        _tempParams.geoLocation = this.settings.geoLocation;
        _tempParams.radius = this.settings.geoRadius;
      }
      this._autoCompleteSearchService.getGeoPrediction(_tempParams).then((result) => {
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
    } else {
      this.processSearchQuery();
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
    data = JSON.parse(JSON.stringify(data));
    data.description = data.description ? data.description : data.formatted_address;
    data.active = false;
    this.selectedDataIndex = -1;
    this.locationInput = data.description;
    if (this.settings.showRecentSearch) {
      this._autoCompleteSearchService.addRecentList(this.settings.recentStorageName, data, this.settings.noOfRecentSearchSave);
      this.getRecentLocations();
    }
    this.userSelectedOption = data;
    //below code will execute only when user press enter or select any option selection and it emit a callback to the parent component.
    if (!this.settings.resOnSearchButtonClickOnly) {
      this.componentCallback.emit({'response': true, 'data': data});
    }
  }

  //function to retrive the stored recent user search from the localstorage.
  private getRecentLocations(): any {
    this._autoCompleteSearchService.getRecentList(this.settings.recentStorageName).then((data: any) => {
      this.recentSearchData = (data && data.length) ? data : [];
    });
  }
}
