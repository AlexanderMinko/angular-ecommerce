import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../common/account';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private acivatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
      const url: string = this.router.url;
      if(url === '/login') {
        this.isLoginMode = true;
      } else if(url === '/logout') {
        this.authService.logoutAccount();
      }

  }

  onSubmitLogin(form: NgForm) {
    const username: string = form.value.username;
    const password: string = form.value.password;
    console.log(form.value);

    this.authService.loginAccount(username, password).subscribe(
      data => {
        console.log(`SUCCESFULLY LOGINED: ${JSON.stringify(data)}`);
        this.router.navigate(['/products']);
      },
      errorMessage => {
        this.isError = true;
        this.errorMessage = errorMessage;
      }
    )
  }

  onSubmitRegister(form: NgForm) {
    const username: string = form.value.username;
    const firstname: string = form.value.firstname;
    const lastname: string = form.value.lastname;
    const email: string = form.value.email;
    const password: string = form.value.password;
    let account: Account = new Account(
     0, username, firstname, lastname, email, password);

    this.authService.registerAccount(account).subscribe(
      data => {
        console.log(`SUCCESFULLY REGISTERED: ${JSON.stringify(data)}`);
        this.router.navigate(['/products']);
      }
    );
  }

}
