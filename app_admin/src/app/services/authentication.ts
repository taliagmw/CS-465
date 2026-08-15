import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token: string | null = this.getToken();
      if (token) {
        try {
          const { email, name } = JSON.parse(atob(token.split('.')[1]));
          return { email, name } as User;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }

  // --- Realized HTTP API calls mapped directly to browser local storage updates ---

  public login(user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(this.baseUrl + 'login', formData).pipe(
      tap((authResp: AuthResponse) => this.saveToken(authResp.token))
    );
  }

  public register(user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(this.baseUrl + 'register', formData).pipe(
      tap((authResp: AuthResponse) => this.saveToken(authResp.token))
    );
  }
}

