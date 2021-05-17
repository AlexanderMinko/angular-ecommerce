import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  isLoggined: boolean = false;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor(
    private cartService: CartService,
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem('account')) {
      this.isLoggined = true;
    }
    this.cartItems = this.cartService.cartItems;
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
    this.updateCartStatus();
  }

  onIncrease(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  onDecrease(cartItem: CartItem) {
    cartItem.quantity--;
    if( cartItem.quantity === 0) {
      this.cartService.removeFromCart(cartItem);
    } else {
      this.cartService.calculateCartTotals();
    }
  }

  onRemove(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
  }

  updateCartStatus() {
    this.cartService.totalPriceChange.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantityChange.subscribe(
      data => this.totalQuantity = data
    )
  }
}
