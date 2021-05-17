import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states/search/findByCountryName?name=';
  private cityUrl = 'http://localhost:8080/api/cities/search/findByStateName?name=';

  constructor(private httpClient: HttpClient) { }

  getCountries() {
    let countries: string[] = [];
    this.httpClient.get<any>(`${this.countriesUrl}/?page=0&size=246`).pipe(
      map(data => data._embedded.countries),
      tap(data => {
        for (let el of data) {
          countries.push(el.name);
        }
      })
    ).subscribe();
    return countries;
  }

  getStatesByCountry(country: string) {
    let states: string[] = [];
    this.httpClient.get<any>(`${this.statesUrl}${country}`).pipe(
      map(data => data._embedded.states),
      tap(data => {
        for (let el of data) {
          states.push(el.name);
        }
      })
    ).subscribe();
    return states;
  }

  getCitiesByState(state: string) {
    let cities: string[] = [];
    this.httpClient.get<any>(`${this.cityUrl}${state}`).pipe(
      map(data => data._embedded.cities),
      tap(data => {
        for (let el of data) {
          cities.push(el.name);
        }
      })
    ).subscribe();
    return cities;
  }

}
