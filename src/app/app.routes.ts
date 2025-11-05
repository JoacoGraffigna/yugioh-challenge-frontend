import { Routes } from '@angular/router';
import { CardsUpload } from './components/cards-upload/cards-upload';
import { CardsList } from './components/cards-list/cards-list';
import { AdminGuard } from './guards/admin.guard';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: CardsList, title: 'Cartas Yu-Gi-Oh' },
  { path: 'login', component: Login, title: 'Iniciar Sesión' },
  { path: 'admin/upload', component: CardsUpload, title: 'Subir Carta (Admin)', canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' },
];