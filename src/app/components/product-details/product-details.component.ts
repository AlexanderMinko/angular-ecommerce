import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => this.handleProductDatails());
  }

  handleProductDatails() {
    this.productService;
    //get id para string and conver to a number
    const productId: number = +this.route.snapshot.params.id;
    this.productService.getProduct(productId).subscribe(
      data => this.product = data
    );
  }

  onAddToCart() {
    let cartItem: CartItem = new CartItem(this.product)
    this.cartService.addToCart(cartItem);
  }

}
