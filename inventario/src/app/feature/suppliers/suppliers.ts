import { Component } from '@angular/core';
import { Footer } from "../../shared/footer/footer";
import { NavbarComponent } from "../../shared/navbar/navbar";
import { SuppliersService } from '../../core/service/suppliers.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-suppliers',
  imports: [Footer, NavbarComponent, RouterLink],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.css'
})
export class Suppliers {


selectedFile: File | null = null;
  productId = 1; // ID del producto que quieres actualizar (debe existir en tu BBDD)

  constructor(private suppliersService: SuppliersService) { }

  // 1. Captura el archivo cuando el usuario lo selecciona
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  // 2. Llama al servicio cuando se presiona el botón
  onUpload(): void {
    if (this.selectedFile) {
      console.log('Subiendo...', this.selectedFile.name);
      
      this.suppliersService.uploadImage(this.productId, this.selectedFile)
        .subscribe({
          next: (response) => {
            console.log('¡Subida exitosa!', response);
            // 'response' contendrá el objeto del producto con la nueva URL de S3
            // Ej: response.image = "https://.../media/products/mi-imagen.jpg"
          },
          error: (err) => {
            console.error('Error en la subida', err);
          }
        });
    }
  }


}
