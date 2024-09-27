import { Component, OnInit, ViewChild } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { UsuarioService } from '../../services/usuario/usuario.service';
import { MensajeService } from '../../services/mensaje/mensaje.service';
import { ChatbotService } from '../../services/chatbot/chatbot.service';

import { Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';

import { Toast, Modal } from 'bootstrap'


@Component({
  selector: 'app-chat',

  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {

  mensaje: any
  emisor: any
  receptor: any

  conversation: NewMessage[] = []
  notification: any = {}
  received: any = {}

  usuarios: any
  mensajes: any

  cerrar: any
  userSelect: any
  nombre: any

  progreso:any
  usuariosConectados:any = {}
  userStatus:any

  @Input() datalogin: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  @ViewChild('myModal', { static: true }) modalEl: any
  modal: any

  @ViewChild('myToast', { static: true }) toastEl: any
  toast: any

  private connection: HubConnection;

  constructor(private usuarioService: UsuarioService, 
    private mensajeService: MensajeService, private chatbotService: ChatbotService) {
    this.connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5131/chat')
      .build();

    this.connection.on("NewUser", message => this.newUser(message));
    this.connection.on("NewMessage", message => this.newMessage(message));
    
    //this.connection.on("OnConnectedAsync", message => console.log(message));
    this.connection.on("OnDisconnectedAsync", message => console.log(message));
    this.connection.on("UpdateConnection", message => this.userConnected(message));

    //this.connection.on("LeftUser", message => this.leftUser(message));
  }

  ngOnInit(): void {
    this.toast = new Toast(this.toastEl.nativeElement, {})
    this.modal = new Modal(this.modalEl.nativeElement, {})

    this.connection.start()
      .then(_ => {
        console.log('Connection Started');
        this.progreso = "33%"

        //actualizar el connection id
        this.getConnection(this.datalogin.id)

        //obtener los usuarios
        // this.getUsuarios(this.datalogin.rol)

      }).catch(error => {
        return console.error(error);
      });
  }

  //funciones de signalr
  getConnection(usuario: any) {
    this.connection.invoke('GetConnection', usuario)
      .then(_ => this.progreso = "66%")
      .then(_ => this.getUsuarios(this.datalogin.rol))
  }

  sendMessage() {
    // if (this.mensaje == undefined) {
    //   alert("Ingrese un mensaje")
    //   return
    // }

    //agregamos el mensaje del lado del emisor
    const newMessage: NewMessage = {
      emisor: this.datalogin.nombre,
      mensaje: this.mensaje,
      fecha: new Date().toLocaleTimeString()
    }

    this.conversation.push(newMessage);

    const messages:any = document.getElementById('messages')
    messages.scrollTop = messages.scrollHeight;

    //asignamos el id del usuario logeado al emisor
    this.emisor = this.datalogin.id
    this.receptor = this.userSelect.id

    //enviamos el mensaje al receptor
    const sendMessage: SendMessage = {
      emisor: this.emisor,
      receptor: this.receptor,
      mensaje: this.mensaje
    };

    if(this.userSelect.rol == "ASISTENTE") {
      const sendQuestion = {
        name: this.userSelect.nombre, 
        question: this.mensaje
      }
      this.chatbotService.obtenerRespuesta(sendQuestion).subscribe((res:any) => {
        //agregamos el mensaje de respuesta del asistente
        const newMessageA: NewMessage = {
          emisor: res.name,
          mensaje: res.answer,
          fecha: res.datetime
        }
        this.mensaje = ''
        this.conversation.push(newMessageA)
        this.agregarMensaje(sendMessage)

        //guardamos el mensaje de respuesta del asistente
        const sendMessageA: SendMessage = {
          emisor: this.emisor,
          receptor: this.receptor, 
          mensaje: res.answer
        }
        this.agregarMensaje(sendMessageA)
      })

    } else {
      this.connection.invoke('SendMessage', sendMessage)
      .then(_ => this.mensaje = '')
      .then(_ => this.agregarMensaje(sendMessage))
    }


  }


  //eventos de signalr
  private newMessage(message: NewMessage) {
    //alerta de sonido
    this.playSound1()

    //alertas de mensajes
    this.notification.emisor = message.emisor
    this.notification.mensaje = message.mensaje
    this.toast.show()

    //mensajes no leidos
    this.received[message.emisor] += 1

    if (this.userSelect.nombre == message.emisor) {
      this.conversation.push(message);
      this.received[message.emisor] = 0

      const messages:any = document.getElementById('messages')
      messages.scrollTop = messages.scrollHeight;
    }
  }

  private newUser(message: string) {
    //alerta de sonido
    this.playSound2()

    //alertas de usuarios
    this.notification.emisor = "Usuarios"
    this.notification.mensaje = message
    this.toast.show()

    //actualizamos los usuario
    this.getUsuarios(this.datalogin.rol)
  }

  private userConnected(message: string) {
    //vaciamos el dicc
    this.usuariosConectados = {}

    //lo volvemos a llenar con los nuevos valores
    let conexiones = JSON.parse(message)
    conexiones.forEach((element:any) => {
      this.usuariosConectados[element.id] = element.estado
    });
  }


  //funciones que interactuan con la base de datos
  getUsuarios(rol: any) {
    this.usuarioService.obtenerUsuarios(rol).subscribe(x => {
      this.usuarios = x

      //setear los valores de recibidos en 0
      this.usuarios.forEach((user: any) => {
        this.received[user.nombre] = 0
      });

      this.progreso = "100%"
    })
  }

  getMensajes(idEmisor: number, idReceptor: number) {
    this.mensajeService.obtenerMensajes(idEmisor, idReceptor).subscribe(x => {
      this.mensajes = x

      //cargamos los mensajes guardados
      this.conversation = this.mensajes;

      //setear el valor de recibido en 0
      this.received[this.userSelect.nombre] = 0
    });
  }

  agregarMensaje(sendMessage: SendMessage) {
    this.mensajeService.agregarMensaje(sendMessage).subscribe(x => {
      console.log(x)
    })
  }

  //funciones creadas
  select(user: any) {
    this.userSelect = user
    this.nombre = user.nombre

    //obtener los mensajes
    this.getMensajes(this.datalogin.id, this.userSelect.id)
  }

  cambiarEstado() {
    console.log("OK")

    this.connection.invoke('OnWriting')
      .then(_ =>  console.log("El usuario esta escribiendo"))
    
    setTimeout(() => {
      this.connection.invoke('OnConnect')
        .then(_ => console.log("El usuario esta conectado"))
    }, 3000)
  }

  salir() {
    this.cerrar = true
    this.newItemEvent.emit(this.cerrar);
  }

  playSound1() {
    let audio = new Audio();
    audio.src = "assets/audio/tono-mensaje-1.mp3";
    audio.load();
    audio.play();
  }

  playSound2() {
    let audio = new Audio();
    audio.src = "assets/audio/tono-mensaje-2.mp3";
    audio.load();
    audio.play();
  }
  
}

interface SendMessage {
  emisor: number,
  receptor: number,
  mensaje: string
}

interface NewMessage {
  emisor: string;
  mensaje: string;
  fecha: string;
}
