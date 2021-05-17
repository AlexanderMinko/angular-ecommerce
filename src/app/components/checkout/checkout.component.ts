import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { MyShopService } from 'src/app/services/my-shop.service';
import { CountryService } from 'src/app/services/country.service';
import { Account } from '../../common/account';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  isSubmitted: boolean = false;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];

  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private myShopService: MyShopService,
              private countryService: CountryService,
              private authService: AuthService,
              private orderService: OrderService,
              private router: Router) { }

  ngOnInit(): void {
    const account = <Account>JSON.parse(localStorage.getItem('account'));
 
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);

    this.myShopService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    this.myShopService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonth = data
    );
    
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(account.firstName, [Validators.required, Validators.minLength(3), this.notOnlyWhitespace]),
        lastName: new FormControl(account.lastName, [Validators.required, Validators.minLength(3), this.notOnlyWhitespace]),
        email: new FormControl(account.email,
         [Validators.required, Validators.pattern('[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,4}')]),
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', Validators.required),
        city: new FormControl({value: '', disabled: true}, Validators.required),
        state: new FormControl({value: '', disabled: true}, Validators.required),
        street: new FormControl('', [Validators.required, Validators.minLength(3), this.notOnlyWhitespace]),
        code: new FormControl('', [Validators.required, Validators.minLength(3), this.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        type: new FormControl('', Validators.required),
        number: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        expirationMonth: new FormControl(Validators.required),
        expirationYear: new FormControl(Validators.required),
        secret: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
      }),
    });
    this.countries = this.countryService.getCountries();
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCode() { return this.checkoutFormGroup.get('shippingAddress.code'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.type'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.number'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  get creditCardSecret() { return this.checkoutFormGroup.get('creditCard.secret'); }

  notOnlyWhitespace(control: FormControl): ValidationErrors {
    if((control.value != null) && (control.value.trim().length === 0)) {
      return { 'notOnlyWhitespace' : true};
    } else {
      return null;
    }
  }

  onGetStates() {
    this.checkoutFormGroup.get('shippingAddress.state').enable();
    const selectedCountry: string = this.checkoutFormGroup.get('shippingAddress').value.country;
    this.states = this.countryService.getStatesByCountry(selectedCountry);
  }

  onGetCities() {
    this.checkoutFormGroup.get('shippingAddress.city').enable();
    const selectedState: string = this.checkoutFormGroup.get('shippingAddress').value.state
    this.cities = this.countryService.getCitiesByState(selectedState);
  }

  onSubmit() {
    let cartItems = this.cartService.cartItems;
    const account: Account = <Account>JSON.parse(localStorage.getItem('account'));
    this.orderService.makeOrder(cartItems, account.username).subscribe(
      data => {
        let orderId: number = +data;
        this.router.navigate(['/order-details', orderId]);
        this.cartService.clearStorage('cartItems')
        console.log('ORDER SUCCESFULLY MADE');
      }
    );
    
    this.isSubmitted = true;
    console.log('Submitting form');
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log(this.checkoutFormGroup.get('shippingAddress').value);
    // console.log(this.checkoutFormGroup.get('creditCard').value);
  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.myShopService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonth = data
    );

  }
  
}
