import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyShopService {

  constructor() { }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    
    return of(data);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for(let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }
}
