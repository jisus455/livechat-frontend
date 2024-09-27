import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ChatComponent } from "./pages/chat/chat.component";
import { LoginComponent } from "./pages/login/login.component";


@NgModule({
  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    LoginComponent,
    ChatComponent,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
