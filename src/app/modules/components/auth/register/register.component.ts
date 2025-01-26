import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Router } from '@angular/router';
import { RegisterModel } from '../../../../core/models/authModels/register.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  @Output() registerSuccessEvent: EventEmitter<void> = new EventEmitter();

  regModel: RegisterModel = {
    username: '',
    password: '',
    email: ''
  }

  constructor(
    private authService: AuthService,
    private toastr : ToastrService,
    private storageService: StorageService,
    private router: Router
  ) { }


  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.regModel = this.registerForm.value;

      this.authService.register(this.regModel).subscribe({
        next: result => {
          if (result) {
            this.registerSuccessEvent.emit();
          }
        },
        error: () => console.log('error HERE')
      })
    }
    console.log(this.regModel);
  }

}
