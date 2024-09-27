import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../services/usuario/usuario.service';

import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, delay } from 'rxjs';

@Component({
  selector: 'app-login',

  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  nombre:any
  email:any
  clave:any

  dataLogin:any

  login: boolean = true
  signin:boolean = false

  alert:boolean = false
  alertMessage:any

  @Output() newItemEvent = new EventEmitter<string>();

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {}

  registro() {
    if(this.nombre == undefined || this.email == undefined || this.clave == undefined) {
      this.alertMessage = "Debe completar todos los campos"  
      this.alert = true  
      setTimeout(() => {
        this.alert = false
      }, 2000);  
      return
    }

    let usuario = {
      nombre: this.nombre,  
      email: this.email,
      clave: this.clave
    }

    this.usuarioService.agregarUsuario(usuario).subscribe(x => {
      this.alertMessage = "Cuenta creada correctamente"  
      this.alert = true  
      setTimeout(() => {
        this.alert = false
        this.clave = undefined
      }, 2000);  
      return
    })

  }

  iniciarSesion() {
    if(this.email == undefined || this.clave == undefined) {
      this.alertMessage = "Debe completar todos los campos"  
      this.alert = true  
      setTimeout(() => {
        this.alert = false
      }, 2000);  
      return
    }

    let usuario = {
      email: this.email, 
      clave: this.clave
    }

    this.usuarioService.acceso(usuario).subscribe(x => {
      this.dataLogin = x;
      
      if(this.dataLogin.length == 0) {
        this.alertMessage = "Los datos ingresados son incorrectos"  
        this.alert = true  
        setTimeout(() => {
          this.alert = false
          this.email = undefined
          this.clave = undefined
        }, 2000);
        return 
      } else {
        //eviamos los datos de login al appcomponent
        this.newItemEvent.emit(this.dataLogin[0]);
      }
    })
  }

}
