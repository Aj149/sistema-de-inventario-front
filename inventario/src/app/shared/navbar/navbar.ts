import { Component, AfterViewInit } from '@angular/core';
import  ApexCharts from 'apexcharts';
import type { ApexOptions } from 'apexcharts';
import { RouterLink, RouterOutlet } from "@angular/router";




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  imports: [RouterLink]
})
export class NavbarComponent {

  notificationCount: number = 1;
  
  addNotification() {
    this.notificationCount++;
    // En una aplicación real, esta función se llamaría desde un servicio
  }
  

  
}

