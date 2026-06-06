import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { Photo } from '../../core/models/photo';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  standalone: true,
  imports: [PhotoGridComponent, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly router = inject(Router);

  readonly favoritePhotos = this.favoritesService.favoritePhotos;

  onPhotoClicked(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
