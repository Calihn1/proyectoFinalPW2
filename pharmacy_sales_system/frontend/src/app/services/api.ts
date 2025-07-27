import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseurl = 'http://localhost:8000/api';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseurl}${path}`, { 
      headers: this.httpHeaders,
      withCredentials: true
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseurl}${path}`, body, { 
      headers: this.httpHeaders,
      withCredentials: true
    });
  }

  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseurl}${path}`, body, {
      headers: this.httpHeaders,
      withCredentials: true
    });
  }
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseurl}${path}`, { 
      headers: this.httpHeaders,
      withCredentials: true
    });
  }
}