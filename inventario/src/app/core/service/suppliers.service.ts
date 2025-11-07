import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../environments/environment';
import { Proveedor } from '../../models/Suppliers';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  suppliersURL = enviroment.suppliersURL

  constructor(private httpclient: HttpClient) { }



  public crearProveedor(nuevoProveedor: Proveedor): Observable<any>{
    return this.httpclient.post<any>(`${this.suppliersURL}`,nuevoProveedor);
  }

  // Función para subir la imagen
  uploadImage(productId: number, file: File): Observable<any> {
    
    // 1. Necesitas FormData para enviar archivos
    const formData = new FormData();
    
    // 2. 'image' debe coincidir con el nombre de tu modelo (`image = ...`)
    formData.append('image', file, file.name);

    // (Opcional) Si también quieres actualizar el nombre
    // formData.append('name', 'Nuevo Nombre Desde Angular');

    // 3. Envía un PATCH
    // Usamos PATCH porque solo queremos actualizar un campo (la imagen),
    // no todo el objeto.
    return this.httpclient.patch(`${this.suppliersURL}/products/${productId}/`, formData);
  }

}
