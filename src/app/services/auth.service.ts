import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Account } from '../common/account';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl: string = 'http://localhost:8080/api/accounts';
  private loginUrl: string = 'http://localhost:8080/account/login';
  account: BehaviorSubject<Account> = new BehaviorSubject<Account>(null);

  constructor(private http: HttpClient,
    private router: Router) { }

  registerAccount(account: Account) {
    return this.http.post<Account>(this.registerUrl, account).pipe(
      tap(data => {
        this.handleAuth(data);
      })
    );
  }

  loginAccount(username: string, password: string) {
    return this.http.post<{ username: string, password: string }>(this.loginUrl,
      {
        username: username,
        password: password
      }).pipe(catchError((errorResponse: HttpErrorResponse) => {
        console.log(errorResponse.error);
        return throwError(errorResponse.error);
      }),
        tap((data: Account) => {
          this.handleAuth(data);
        })
      )
  }

  private handleAuth(account: Account) {
    localStorage.setItem('account', JSON.stringify(account));
    this.account.next(account);
  }

  logoutAccount() {
    localStorage.removeItem('account');
    this.account.next(null);
    this.router.navigate(['/login']);
  }
}
