import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/photos/photos.component').then(m => m.PhotosComponent) },
  { path: 'favourites', loadComponent: () => import('./features/favourites/favourites.component').then(m => m.FavouritesComponent) },
  { path: 'photos/:id', loadComponent: () => import('./features/photo-detail/photo-detail.component').then(m => m.PhotoDetailComponent) },
  { path: '**', redirectTo: '' }
];