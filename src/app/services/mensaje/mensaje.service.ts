import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  url = 'http://localhost:5131/mensajes'

  constructor(private httpClient: HttpClient) { }

  agregarMensaje(mensaje:any) {
    return this.httpClient.post(this.url, mensaje)
  }

  obtenerMensajes(idEmisor: number, idReceptor: number) {
    return this.httpClient.get(this.url + '?idEmisor=' + idEmisor + '&idReceptor=' + idReceptor)
  }
}
