import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../common/cart-item';
import { Order } from '../common/order';
import { OrderItem } from '../common/orderItem';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private makeOrderUrl: string = 'http://localhost:8080/order/make';
  private getOrdersUrl: string = 'http://localhost:8080/api/orders/search/findByAccountId?id=';
  private getOrderItemsUrl: string = 'http://localhost:8080/order/orderItem/';

  constructor(private http: HttpClient) { }

  makeOrder(cartItem: CartItem[], username: string) {
    let responseCartItems: ResponseCartItem[] = [];
    console.log(cartItem);
    cartItem.forEach(el => {
      responseCartItems.push(new ResponseCartItem(+el.id, el.quantity));
    })
    console.log(responseCartItems);
    return this.http.post<{username: string, cartItems: ResponseCartItem[]}>(this.makeOrderUrl,
      {
        username: username,
        cartItems: responseCartItems
      });
  }

  getOrdersByAccountId(accountId: number) {
    return this.http.get<OrderResponse>(`${this.getOrdersUrl}${accountId}`).pipe(
      map(data => data._embedded.orders)
    );
  }

  getOrderItemsByOrderId(orderId: number) {
    return this.http.get<OrderItem[]>(`${this.getOrderItemsUrl}${orderId}`);
  }

}

class ResponseCartItem {
  constructor(
    public id: number, 
    public quantity: number
    ) {}
}

interface OrderResponse {
  _embedded: {
    orders: Order[];
  }
}
