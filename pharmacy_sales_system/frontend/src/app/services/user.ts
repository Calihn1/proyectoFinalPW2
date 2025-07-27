import { Injectable } from '@angular/core';
import { Api } from './api'

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private api: Api) {}

  public register(userData: any) {
    return this.api.post<any>('/register/', userData);
  }

  public getUsers() {
    return this.api.get<any>('/users/');
  }

  public getUser(id: number) {
    return this.api.get<any>(`/users/${id}/`);
  }

  public updateUser(id: number, data: any) {
    return this.api.patch<any>(`/users/${id}/`, data);
  }

  public deleteUser(id: number) {
    return this.api.delete<any>(`/users/${id}/`);
  }
}
