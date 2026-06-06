import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';
import { FavouritesService } from '../../core/services/favourites.service';
import { Photo } from '../../core/models/photo';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.scss',
  standalone: true,
  imports: [PhotoGridComponent, MatIconModule],
})
export class FavouritesComponent {
  private readonly favouritesService = inject(FavouritesService);
  private readonly router = inject(Router);

  readonly favouritePhotos = this.favouritesService.favouritePhotos;

  onPhotoClicked(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
