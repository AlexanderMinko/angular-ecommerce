import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

interface ResponseProduct {
  products: Product[],
  totalEl: number
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products = new Subject<ResponseProduct>();

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(`${this.baseUrl}/?page=0&size=100`).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(productId: number) {
    //build URL based on product id
    const productURl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productURl);
  }

  searchProductsPaginate(page: number,
                         pageSize: number,
                         keyWord: string): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}` +
      `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductListPaginate(page: number,
                        pageSize: number,
                        categoryId: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` +
      `&page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getAllProductListPaginate(page: number, pageSize: number) {
    const searchUrl = `${this.baseUrl}/?page=${page}&size=${pageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

//   testing(page: number, pageSize: number): Observable<ResponseProduct> {
//     const searchUrl = `${this.baseUrl}/?page=${page}&size=${pageSize}`;
//     return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
//       map(response => {
//         const res: ResponseProduct = {
//             products: response._embedded.products,
//             totalEl: response.page.totalElements
//           }
//           return res;
//         }),
//       tap(response => this.products.next(response)),
//     );
//   }

//   testing2(productId: number): Observable<Product> {
//     //build URL based on product id
//     const productURl = `${this.baseUrl}/${productId}`;
//     return this.httpClient.get<Product>(productURl);
//   }

}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    currentPage: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}