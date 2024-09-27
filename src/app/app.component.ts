import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'app';

  logeado:boolean = false
  data:any

  constructor(private router: Router) {}

  sendData(data: string) {
    this.data = data
    if(this.data != undefined) {
        this.logeado = true
        //navegar hasta la otra ruta
        // this.router.navigate(['/chat']);
    } else {
      this.logeado = false
    }
  }

  sendData2(data:boolean) {
    if(data) {
      this.logeado = false
    } else {
      this.logeado = true
    }
  }

}
