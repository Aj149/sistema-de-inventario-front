import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar";
import { Proveedor } from '../../../models/Suppliers';
import { SuppliersService } from '../../../core/service/suppliers.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-view-suppliers',
  imports: [NavbarComponent, RouterLink],
  templateUrl: './view-suppliers.html',
  styleUrl: './view-suppliers.css'
})
export class ViewSuppliers {

  proveedor: Proveedor[] =[];
    proveedores: Proveedor[]=[]
     encodeURIComponent = encodeURIComponent; 

    constructor(
    private suppliersService: SuppliersService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.traerProveedor();
}



    traerProveedor():void{
    this.suppliersService.obtenerProveedor().subscribe(
  (data) => {
    this.proveedores = data;
    this.cdr.detectChanges();
  },
  (error) => {
    console.error('Error al traer al proveedor', error);
  }
);
}

}
