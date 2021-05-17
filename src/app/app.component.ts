import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-ecommerce';

  constructor(
    private cartService: CartService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.cartService.checkStorage('cartItems');
  }
}
