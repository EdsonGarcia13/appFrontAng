import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/getUsers`;
  private apiUrlC = `${environment.apiUrl}/createUsers`;

  constructor(private http: HttpClient) {}

  getUser(email: string): Observable<User> {
    const params = new HttpParams().set('email', email);
    return this.http.get<User>(this.apiUrl, { params });
  }

  createUser(email: string): Observable<User> {
    return this.http.post<User>(this.apiUrlC, { email });
  }
}
