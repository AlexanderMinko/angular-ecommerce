import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/common/account';
import { ProductCategory } from 'src/app/common/product-category'
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[];
  isAuth: boolean = false;
  username: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.account.subscribe(data => {
      this.isAuth = !!data
      const account = <Account>JSON.parse(localStorage.getItem('account'));
      if(account) {
        this.isAuth = true;
        this.username = account.username;
      }
    });
    this.listProductCategories();
  }
  
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log('Product categories=' + JSON.stringify(data));
        this.productCategories = data;
      });
  }
}
