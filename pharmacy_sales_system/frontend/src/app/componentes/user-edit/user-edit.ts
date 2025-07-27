import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../services/user';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.css']
})
export class UserEdit implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private user: User,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      rol: ['', Validators.required]
    });

    this.user.getUser(this.userId).subscribe({
      next: user => this.userForm.patchValue(user),
      error: err => this.errorMessage = err.error.detail || 'Error al cargar usuario'
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.user.updateUser(this.userId, this.userForm.value).subscribe({
      next: () => {
        this.successMessage = 'Usuario actualizado correctamente.';
        setTimeout(() => this.router.navigate(['/users']), 1500);
      },
      error: err => this.errorMessage = err.error.detail || 'Error al actualizar usuario'
    });
  }
}
