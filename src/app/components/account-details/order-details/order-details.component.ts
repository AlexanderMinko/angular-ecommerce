import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { OrderItem } from '../../../common/orderItem';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  orderItems: OrderItem[] = [];
  orderId: number;
  totalCost: number = 0;
  totalCount: number = 0;

  constructor(private orderService: OrderService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(() => {
      const orderId: number = +this.activatedRoute.snapshot.params.id;
      this.orderId = orderId;
      this.orderService.getOrderItemsByOrderId(orderId).subscribe(data => {
        this.orderItems = data;
        this.getTotaclCost();
        this.getTotalQuantity();
      })
    });
  }

  getTotaclCost() {
    let totalCost: number = 0;
    this.orderItems.forEach(el => {
      totalCost += el.product.unitPrice * el.count;
    })
    this.totalCost = totalCost;
  }

  getTotalQuantity() {
    let totalCount: number = 0;
    this.orderItems.forEach(el => {
      totalCount += +el.count;
    })
    this.totalCount = totalCount;
  }

}
