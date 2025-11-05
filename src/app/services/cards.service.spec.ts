import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';
import { Card, CardsService } from './cards';

describe('CardsService', () => {
  let service: CardsService;
  let httpMock: HttpTestingController;

  const mockCards: Card[] = [
    { id: 1, name: 'Dark Magician', cardId: 'DM-001', seriesCode: 'SC1', type: 'Monster', subtype: 'Spellcaster', description: '', imageUrl: '' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardsService],
    });
    service = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener todas las cartas', () => {
    service.getAll().subscribe(cards => {
      expect(cards.length).toBe(1);
      expect(cards[0].name).toBe('Dark Magician');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cards`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('debería obtener una carta por id', () => {
    service.getOne(1).subscribe(card => {
      expect(card.name).toBe('Dark Magician');
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cards/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCards[0]);
  });

  it('debería crear una carta con el header Authorization', () => {
    const newCard = { ...mockCards[0], id: undefined };

    service.create(newCard).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cards`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('debería actualizar una carta', () => {
    service.update(1, { name: 'Blue Eyes' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cards/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('debería eliminar una carta', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/cards/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
  });
});
