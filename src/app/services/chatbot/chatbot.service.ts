import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  url = 'http://localhost:5131/chatbot'

  constructor(private httpClient : HttpClient) { }

  obtenerRespuesta(datos: any) {
    return this.httpClient.post(this.url, datos)
  }
}