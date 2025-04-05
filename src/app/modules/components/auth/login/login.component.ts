import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { LoginModel } from '../../../../core/models/authModels/login.model';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  hide = true;
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private loadingService = inject(LoadingService);


  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });


  logModel: LoginModel = {
    username: '',
    password: ''
  }

  togglePasswordVisibility(event: MouseEvent){
    event.preventDefault();
    this.hide = !this.hide;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.logModel = this.loginForm.value;
      this.authService.login(this.logModel).subscribe({
        next: result => {
          if (result) {
            
            this.storageService.setToken(result);
            this.authService.isLoggedIn$.next(true);
            this.toastr.success('Welcome, ' + this.storageService.getUsername(), 'Success')
            this.router.navigate(['projects']);
            this.loadingService.hide();
          }
        },
        error: () => {
          this.toastr.error('Username or password is incorrect!', 'Error')
          this.loadingService.hide();
        }
      })
    }
  }

  someAsyncAction() {
    
  
    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);
  }

}
