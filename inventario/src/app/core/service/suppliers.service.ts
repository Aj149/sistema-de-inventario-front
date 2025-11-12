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

  constructor(private httpClient: HttpClient) { }



    public crearProveedor(formData: FormData): Observable<any> {
  return this.httpClient.post<any>(`${this.suppliersURL}`, formData);
}
    public obtenerProveedor(): Observable<Proveedor[]> {
    return this.httpClient.get<Proveedor[]>(this.suppliersURL);
  }

  public id_proveedor(id_proveedor: number): Observable<Proveedor> {
    return this.httpClient.get<Proveedor>(`${this.suppliersURL}/${id_proveedor}`);
  }

  public eliminarProveedor(id_proveedor: number): Observable<any> {
return this.httpClient.delete<any>(`${this.suppliersURL}/${id_proveedor}`);
}


  public update(id_proveedor: number, proveedor: Proveedor): Observable<any> {
    return this.httpClient.patch<any>(`${this.suppliersURL}/${id_proveedor}`, proveedor);
  }

}
