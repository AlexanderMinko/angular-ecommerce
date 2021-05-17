import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from '../../common/order';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  constructor(private orderService: OrderService) { }
  orders: Order[] = [];

  ngOnInit(): void {
    const account = <Account>JSON.parse(localStorage.getItem('account'));
    console.log(account.id);
    this.orderService.getOrdersByAccountId(+account.id).subscribe(data => {
      this.orders = data;
    });
  }

}
