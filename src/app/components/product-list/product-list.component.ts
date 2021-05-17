import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  isAllCategories: boolean = false;
  isLoading: boolean = false;

  currentCategoryName: string;
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 8;
  totalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService,
              private authService: AuthService) { }

  ngOnInit(): void { 
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.listProducts();
    }); 
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    this.searchMode ? this.handleSearchProducts() : this.handleListProducts();
  }

  handleSearchProducts() {
    this.isAllCategories = true;
    const keyWord: string = this.route.snapshot.paramMap.get('keyword');
    if(this.previousKeyword != keyWord) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyWord;
    this.productService
    .searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyWord)
    .subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.params.id;
      this.currentCategoryName = this.route.snapshot.params.name;
      if(this.previousCategoryId != this.currentCategoryId) {
        this.pageNumber = 1;
      }
      this.previousCategoryId = this.currentCategoryId;
      this.productService
      .getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(this.processResult());
    } else {
      this.isAllCategories = true;
      this.productService
      .getAllProductListPaginate(this.pageNumber - 1, this.pageSize)
      .subscribe(this.processResult());
    }
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.totalElements = data.page.totalElements;
      this.isLoading = false;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const cartItem: CartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
