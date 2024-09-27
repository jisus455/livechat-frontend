import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'http://localhost:5131/usuarios'

  constructor(private httpClient: HttpClient) { }

  acceso(usuario:any) {
    return this.httpClient.post(this.url + '/login', usuario)
  }

  agregarUsuario(usuario:any) {
    return this.httpClient.post(this.url, usuario)
  }

  obtenerUsuarios(rol:any) {
    return this.httpClient.get(this.url + '?rol=' + rol)
  }
}
