import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatButtonModule,
    LoginComponent,
    RegisterComponent,
    CommonModule,
    MatDividerModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  isRegistered : boolean = false;

  constructor(
  ) {}
  
  switchAuth(){
    this.isRegistered = !this.isRegistered;
  }

}
