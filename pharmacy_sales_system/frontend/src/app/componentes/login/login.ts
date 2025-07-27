import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);  

  form!: FormGroup;
  errorMessage = '';
  loading = false;

  ngOnInit(): void {
  this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  this.form.valueChanges.subscribe(() => {
    this.errorMessage = '';
  });
}
  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas';
        this.loading = false;
      },
    });
  }
}
