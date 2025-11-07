import { Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad, Provincia } from '../../models/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  
  provinciasURL = enviroment.provinciaURL
  ciudadesURL = enviroment.ciudadURL

  constructor(private httpClient: HttpClient){}

   public obtenerProvincia(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.provinciasURL);
  }

  obtenerCiudadesPorProvincia(id: number) {
  return this.httpClient.get<any[]>(`${this.provinciasURL}/${id}/ciudades/`);
}


  public idProvincia(id_provincia: number): Observable<Provincia> {
    return this.httpClient.get<Provincia>(`${this.provinciasURL}/${id_provincia}`);
  }

  public agregarProvincia(nuevaProvincia: Provincia): Observable<any> {
    return this.httpClient.post<any>(`${this.provinciasURL}`, nuevaProvincia);
  }

  public editProvincia(id_provincia: number, Provincia: Provincia): Observable<any> {
    return this.httpClient.patch<any>(`${this.provinciasURL}/${id_provincia}`, Provincia);
  }

  public borrarProvincia(id_provincia: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.provinciasURL}/${id_provincia}`);
  }

}
