import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ICityTemperature } from './inew-city';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-new-city',
  templateUrl: './new-city.component.html',
  styleUrls: ['./new-city.component.scss']
})
export class NewCityComponent implements OnInit {

  homeUrl = 'http://localhost:8000/temperature';

  cityName = "";
  cityId = "";

  Cities = [<ICityTemperature>{}];
  hideCitiesOutput = true;

  statusMsg = "";
  hideStatusOutput = true;


  constructor(private http: HttpClient) { }

  ngOnInit(){  }


  getDefaultCity() {
    this.Cities = [<ICityTemperature>{}]

    return this.http.get<ICityTemperature>(this.homeUrl).subscribe({
      next: data => {
        this.Cities[0] = data;
        this.hideCitiesOutput = false;
        this.hideStatusOutput = true;
      },
      error: err => {
        this.statusMsg = err["statusText"];
        this.hideCitiesOutput = true;
        this.hideStatusOutput = false;
      },
      complete: () => console.log(`Complete!`),
    })
  }


  getCityByName() {
    this.Cities = [<ICityTemperature>{}]

    const getCityByNameUrl = new URL(this.homeUrl);
    getCityByNameUrl.searchParams.append("q", this.cityName);

    return this.http.get<ICityTemperature>(getCityByNameUrl.href).subscribe({
      next: data => {
        this.Cities[0] = data;
        this.hideCitiesOutput = false;
        this.hideStatusOutput = true;
      },
      error: err => {
        this.statusMsg = `City with name "${this.cityName}": ${err["statusText"]}`;
        this.hideCitiesOutput = true;
        this.hideStatusOutput = false;
      },
      complete: () => console.log(`Complete!`),
    })
  }


  getCityById() {
    this.Cities = [<ICityTemperature>{}]

    const getCityByIdUrl = new URL(this.homeUrl);
    getCityByIdUrl.searchParams.append("id", this.cityId);

    return this.http.get<ICityTemperature>(getCityByIdUrl.href).subscribe({
      next: data => {
        this.Cities[0] = data;
        this.hideCitiesOutput = false;
        this.hideStatusOutput = true;
      },
      error: err => {
        this.statusMsg = `City with id "${this.cityId}": ${err["statusText"]}`;
        this.hideCitiesOutput = true;
        this.hideStatusOutput = false;
      },
      complete: () => console.log(`Complete!`),
    })
  }


  printSomeCities(){
    const printSomeCities = new URL(`${this.homeUrl}/print`);

    return this.http.get<[ICityTemperature]>(printSomeCities.href).subscribe({
      next: data => {
        this.Cities = data;
        this.hideCitiesOutput = false;
        this.hideStatusOutput = true;
      },
      error: err => {
        this.statusMsg = `Could not print: ${err["statusText"]}`;
        this.hideCitiesOutput = true;
        this.hideStatusOutput = false;
      },
      complete: () => console.log(`Complete!`),
    })
  }


  addCity(){
    if(this.cityCanBeAdded()){
      const addCityByNameUrl = new URL(`${this.homeUrl}/addCityByName`);

      var data =  this.http.post<any>(addCityByNameUrl.href, this.Cities[0].name).subscribe(response => {
        if(response == undefined){
          this.statusMsg = `${this.Cities[0].name} already saved.`;
        }
        else{
          this.statusMsg = `${this.Cities[0].name} saved.`;
        }
        }, err => {
          this.statusMsg = `Could not save: ${err["statusText"]}`;
        }
      );
    }
  }


  cityCanBeAdded(){
    this.hideCitiesOutput = true;
    this.hideStatusOutput = false;

    if (this.Cities[0].name === undefined){
      this.statusMsg = "Nothing to save";
      return false;
    }
    else if (this.Cities.length > 1){
      this.statusMsg = "What to save?";
      return false;
    }
    else{
      return true;
    }
  }
}
