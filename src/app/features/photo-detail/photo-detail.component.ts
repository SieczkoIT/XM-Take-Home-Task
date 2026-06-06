import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Photo } from '../../core/models/photo';
import { FavouritesService } from '../../core/services/favourites.service';

@Component({
  selector: 'app-photo-detail',
  standalone: true,
  imports: [MatButton, MatIconModule],
  templateUrl: './photo-detail.component.html',
  styleUrl: './photo-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favouritesService = inject(FavouritesService);

  readonly photo = new Photo(this.route.snapshot.paramMap.get('id') ?? '');
  readonly isFavourite = computed(() => this.favouritesService.isFavourite(this.photo.id));

  removeFromFavourites(): void {
    this.favouritesService.remove(this.photo.id);
    this.router.navigate(['/favourites']);
  }
}
