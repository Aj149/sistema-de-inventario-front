import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  
private apiUrl = 'http://localhost:8000/api'; // Tu API de Django

  constructor(private http: HttpClient) { }

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
    return this.http.patch(`${this.apiUrl}/products/${productId}/`, formData);
  }

}
