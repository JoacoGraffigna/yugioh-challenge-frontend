import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const mockResponse = { access_token: 'fake-jwt', role: 'ADMIN' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería hacer login y guardar token y role en localStorage', () => {
    service.login('test@test.com', '1234').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('fake-jwt');
      expect(localStorage.getItem('role')).toBe('ADMIN');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería registrar un usuario', () => {
    service.register('test@test.com', '1234').subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
  });

  it('debería eliminar token y role al hacer logout', () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('role', 'r');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('debería retornar true si hay token', () => {
    localStorage.setItem('token', 'jwt');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('debería retornar true si el rol es ADMIN', () => {
    localStorage.setItem('role', 'ADMIN');
    expect(service.isAdmin()).toBeTrue();
  });
});
