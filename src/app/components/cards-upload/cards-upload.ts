import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card, CardsService } from '../../services/cards';
import { ImageUploadService } from '../../services/image-upload';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SpinnerService } from '../../services/spinner';

@Component({
  selector: 'app-cards-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cards-upload.html',
  styleUrl: './cards-upload.css',
})
export class CardsUpload {
  cards: Card[] = [];
  newCard: Partial<Card> = {};
  selectedFile?: File;
  imageUrlManual: string = '';
  loading = false;
  editing = false;
  editingId?: number;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private cardsService: CardsService,
    private imageService: ImageUploadService,
    private toastr: ToastrService,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.spinner.show();
    this.cardsService.getAll().subscribe({
      next: (data) => {
        this.cards = data;
        this.spinner.hide();
      },
      error: () => {
        this.toastr.error('Error al cargar las cartas.');
        this.spinner.hide();
      },
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async saveCard() {
    this.spinner.show();
    this.loading = true;

    if (
      !this.newCard.name?.trim() ||
      !this.newCard.cardId?.trim() ||
      !this.newCard.seriesCode?.trim() ||
      !this.newCard.type?.trim() ||
      !this.newCard.subtype?.trim() ||
      (!this.newCard.imageUrl && !this.imageUrlManual.trim())
    ) {
      this.message = 'Por favor, completa todos los campos obligatorios.';
      this.messageType = 'error';
      this.loading = false;
      this.spinner.hide();
      return;
    }

    try {
      let imageUrl = '';

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);
        const uploadResponse: any = await this.imageService.uploadImage(formData);
        imageUrl = uploadResponse.data.url;
      } else if (this.imageUrlManual.trim()) {
        imageUrl = this.imageUrlManual.trim();
      }

      const cardData: Card = {
        ...this.newCard as Card,
        imageUrl: imageUrl || this.newCard.imageUrl || '',
      };

      if (!this.editing) {
        this.cardsService.create(cardData).subscribe({
          next: () => {
            this.toastr.success('Carta creada correctamente.');
            this.resetForm();
            this.loadCards();
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Error al crear la carta.')
          },
        });
      } else {
        this.cardsService.update(this.editingId!, cardData).subscribe({
          next: () => {
            this.toastr.success('Carta actualizada correctamente.');
            this.resetForm();
            this.loadCards();
          },
          error: () => this.toastr.error('Error al actualizar la carta.'),
        });
      }
    } catch {
      this.toastr.error('Error al procesar la imagen.');
      this.spinner.hide();
    } finally {
      this.loading = false;
      this.spinner.hide();
    }
  }


  editCard(card: Card) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.newCard = { ...card };
    this.imageUrlManual = card.imageUrl;
    this.editing = true;
    this.editingId = card.id;
  }

  deleteCard(id: number) {
    Swal.fire({
      title: '¿Eliminar carta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'my-popup',
        confirmButton: 'my-confirm-btn',
        cancelButton: 'my-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.cardsService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Carta eliminada correctamente.');
            this.loadCards();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          error: () => this.toastr.error('Error al eliminar la carta.'),
        });
      }
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.newCard = {};
    this.imageUrlManual = '';
    this.selectedFile = undefined;
    this.editing = false;
    this.editingId = undefined;
    this.loading = false;
  }
}
