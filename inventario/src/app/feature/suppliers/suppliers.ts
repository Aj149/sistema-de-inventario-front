import { ChangeDetectorRef, Component } from '@angular/core';
import { Footer } from "../../shared/footer/footer";
import { NavbarComponent } from "../../shared/navbar/navbar";
import { SuppliersService } from '../../core/service/suppliers.service';
import { RouterLink } from "@angular/router";
import { Proveedor } from '../../models/Suppliers';

@Component({
  selector: 'app-suppliers',
  imports: [Footer, NavbarComponent, RouterLink],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers {


  proveedor: Proveedor[] =[];
  proveedores: Proveedor[]=[]

  constructor(
    private suppliersService: SuppliersService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.traerProveedor();
}


  traerProveedor():void{
    this.suppliersService.obtenerProveedor().subscribe(
  (data) => {
    console.log('Proveedores recibidos:', data);
    this.proveedores = data;
    this.cdr.detectChanges();
  },
  (error) => {
    console.error('Error al traer al proveedor', error);
  }
);

  }


}
