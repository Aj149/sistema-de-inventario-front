import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar";
import { Footer } from "../../shared/footer/footer";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory',
  imports: [NavbarComponent, Footer, CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory {

}
