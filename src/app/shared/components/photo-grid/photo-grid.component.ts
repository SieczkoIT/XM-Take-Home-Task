import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Photo } from '../../../core/models/photo';
import { PhotoCardComponent } from '../photo-card/photo-card.component';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  imports: [PhotoCardComponent],
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridComponent {
  photos = input.required<Photo[]>();
  favoriteIds = input<Set<string>>(new Set());
  showOverlay = input<boolean>(true);
  cardClicked = output<Photo>();
}
