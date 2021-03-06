import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.totalPrice = this.cartService.totalPrice;
    this.totalQuantity = this.cartService.totalQuantity;
    this.updateCartStatus();
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
