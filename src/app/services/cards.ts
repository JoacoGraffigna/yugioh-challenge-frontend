import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Card {
  id?: number;
  name: string;
  cardId: string;
  seriesCode: string;
  type: string;
  subtype: string;
  atk?: number;
  def?: number;
  stars?: number;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private readonly CARDS_URL = `${environment.apiBaseUrl}/cards`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>(this.CARDS_URL);
  }

  getOne(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.CARDS_URL}/${id}`);
  }

  create(card: Card): Observable<Card> {
    const token = localStorage.getItem('token');
    return this.http.post<Card>(this.CARDS_URL, card, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  update(id: number, card: Partial<Card>): Observable<Card> {
    const token = localStorage.getItem('token');
    return this.http.put<Card>(`${this.CARDS_URL}/${id}`, card, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.CARDS_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
