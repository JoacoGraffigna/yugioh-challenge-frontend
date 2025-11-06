import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card, CardsService } from '../../services/cards';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cards-list.html',
  styleUrl: './cards-list.css',
})
export class CardsList {
  cards: Card[] = [];
  filteredCards: Card[] = [];
  types: string[] = [];
  searchTerm = '';
  typeFilter = '';
  currentPage = 1;
  cardsPerPage = 3;
  subtypes: string[] = [];
  subtypeFilter = '';
  atkMin: number | null = null;
  atkMax: number | null = null;

  constructor(private cardsService: CardsService, public authService: AuthService, private router: Router, private spinner: SpinnerService) { }

  ngOnInit(): void {
    this.loadCards();
    console.log('API URL:', environment.apiBaseUrl);
  }

  loadCards() {
    this.spinner.show();
    this.cardsService.getAll().subscribe({
      next: (data) => {
        this.cards = data;
        this.types = [...new Set(this.cards.map((c) => c.type))];
        this.subtypes = [...new Set(this.cards.map((c) => c.subtype))];
        this.applyFilters();
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });
  }

  applyFilters() {
    this.filteredCards = this.cards.filter((card) => {
      const matchesName = card.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.typeFilter ? card.type === this.typeFilter : true;
      const matchesSubtype = this.subtypeFilter ? card.subtype === this.subtypeFilter : true;

      const atkValue = card.atk ?? 0;
      const matchesAtkMin = this.atkMin !== null ? atkValue >= this.atkMin : true;
      const matchesAtkMax = this.atkMax !== null ? atkValue <= this.atkMax : true;

      return matchesName && matchesType && matchesSubtype && matchesAtkMin && matchesAtkMax;
    });
    this.currentPage = 1;
  }


  get paginatedCards() {
    const start = (this.currentPage - 1) * this.cardsPerPage;
    return this.filteredCards.slice(start, start + this.cardsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  get totalPages() {
    return Math.ceil(this.filteredCards.length / this.cardsPerPage);
  }

  logout() {
    this.authService.logout();
  }
}
