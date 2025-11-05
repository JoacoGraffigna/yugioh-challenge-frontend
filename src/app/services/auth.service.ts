import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

interface LoginResponse {
    access_token: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly AUTH_URL = `${environment.apiBaseUrl}/auth`;

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, { email, password }).pipe(
            tap((res) => {
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('role', res.role);
            })
        );
    }

    register(email: string, password: string): Observable<any> {
        return this.http.post(`${this.AUTH_URL}/register`, { email, password });
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.getRole() === 'ADMIN';
    }
}
