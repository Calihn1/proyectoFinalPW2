import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-user-list',
  imports: [ CommonModule, RouterLink, RouterModule, Navbar],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {
  users: any[] = [];
  error: string | null = null;

  constructor(private user: User, private router: Router) {}

  ngOnInit(): void {
    this.user.getUsers().subscribe({
      next: data => this.users = data,
      error: err => this.error = err.error.detail || 'Error cargando usuarios'
    });
  }

  editUser(userId: number) {
    this.router.navigate(['/users/edit', userId]);
  }

  confirmDeleteUser(user: any): void {
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.first_name} ${user.last_name}" (ID: ${user.id})?`);

    if (confirmacion) {
      this.deleteUser(user.id);
    }
  }

  private deleteUser(userId: number): void {
    this.user.deleteUser(userId).subscribe({
      next: () => {
        console.log(`Usuario con ID ${userId} eliminado con éxito.`);
        this.users = this.users.filter(u => u.id !== userId);
      },
      error: err => {
        console.error(`Error al eliminar usuario con ID ${userId}`, err);
        alert(err.error.detail || 'Error al eliminar el usuario.');
      }
    });
  }
}