import { Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from '../../models/provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  
  provinciasURL = enviroment.provinciaURL

  constructor(private httpClient: HttpClient){}

   public obtenerProvincia(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.provinciasURL);
  }

  public idProvincia(id_persona: number): Observable<Provincia> {
    return this.httpClient.get<Provincia>(`${this.provinciasURL}/${id_persona}`);
  }

  public agregarProvincia(nuevaPersona: Provincia): Observable<any> {
    return this.httpClient.post<any>(`${this.provinciasURL}`, nuevaPersona);
  }

  public editProvincia(id_persona: number, Persona: Provincia): Observable<any> {
    return this.httpClient.patch<any>(`${this.provinciasURL}/${id_persona}`, Persona);
  }

  public borrarProvincia(id_persona: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.provinciasURL}/${id_persona}`);
  }

}
