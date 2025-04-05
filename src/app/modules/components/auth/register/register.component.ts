import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../../core/services/auth.service';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { StorageService } from '../../../../core/services/storage.service';
import { RegisterModel } from '../../../../core/models/authModels/register.model';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);

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
