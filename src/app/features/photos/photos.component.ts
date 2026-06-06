import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Photo } from '../../core/models/photo';
import { PhotoService } from '../../core/services/photo.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { PhotoGridComponent } from '../../shared/components/photo-grid/photo-grid.component';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [PhotoGridComponent, InfiniteScrollDirective, MatProgressSpinnerModule],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosComponent implements OnInit {
  private readonly photoService = inject(PhotoService);
  private readonly favouritesService = inject(FavouritesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal(false);
  readonly favouriteIds = this.favouritesService.favouriteIds;

  private currentPage = 1;

  ngOnInit(): void {
    this.loadPhotos();
  }

  onScrolled(): void {
    if (!this.isLoading()) {
      this.loadPhotos();
    }
  }

  onAddToFavourites(photo: Photo): void {
    this.favouritesService.add(photo);
  }

  private loadPhotos(): void {
    this.isLoading.set(true);

    this.photoService
      .getPhotos(this.currentPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: newPhotos => {
          this.photos.update(current => [...current, ...newPhotos]);
          this.currentPage++;
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}
