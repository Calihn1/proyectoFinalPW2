import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from '../../services/user';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirms = control.get('confirms');

  if (!password || !confirms || !confirms.value) {
    return null;
  }
  
  return password.value === confirms.value ? null : { mismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit, OnDestroy {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  
  private fb = inject(FormBuilder);
  private user = inject(User);
  private passwordSubscription: Subscription | undefined;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      rol: ['vendedor', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirms: ['', Validators.required]
    }, { 
      validators: passwordMatchValidator 
    });
  }

  ngOnInit(): void {
    const confirmsControl = this.registerForm.get('confirms');
    if (confirmsControl) {
      this.passwordSubscription = confirmsControl.valueChanges.subscribe(() => {
        this.registerForm.get('password')?.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(): void {
    this.passwordSubscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
        if (this.registerForm.errors?.['mismatch']) {
            console.error('Error de validación del frontend: Las contraseñas no coinciden.');
        }
        return;
    }
    
    this.successMessage = null;
    this.errorMessage = null;

    this.user.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.detail || 'Usuario creado exitosamente.';
        this.registerForm.reset({ rol: 'vendedor' });
      },
      error: (err) => {
        this.errorMessage = err.error.detail || 'Ocurrió un error al registrar el usuario.';
      }
    });
  }
}