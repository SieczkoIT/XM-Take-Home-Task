import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Photo } from '../../../core/models/photo';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCardComponent {
  photo = input.required<Photo>();
  isFavorite = input<boolean>(false);
  showOverlay = input<boolean>(true);
  cardClicked = output<Photo>();

  onClick(): void {
    this.cardClicked.emit(this.photo());
  }
}
