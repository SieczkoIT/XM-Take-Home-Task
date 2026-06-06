import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PhotoGridComponent } from './photo-grid.component';
import { Photo } from '../../../core/models/photo';

const mockPhotos = [new Photo('1'), new Photo('2')];

describe('PhotoGridComponent', () => {
  let fixture: ComponentFixture<PhotoGridComponent>;
  let component: PhotoGridComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGridComponent);
    fixture.componentRef.setInput('photos', mockPhotos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each photo', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-photo-card'));
    expect(cards.length).toBe(2);
  });

  it('should emit cardClicked when a card is clicked', () => {
    let emitted: Photo | undefined;
    component.cardClicked.subscribe((p: Photo) => (emitted = p));
    fixture.debugElement.query(By.css('.photo-card')).nativeElement.click();
    expect(emitted).toEqual(mockPhotos[0]);
  });

  it('should mark a photo as favorite when its id is in favoriteIds', () => {
    fixture.componentRef.setInput('favoriteIds', new Set(['1']));
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('app-photo-card'));

    expect(cards[0].nativeElement.querySelector('.photo-card__badge')).toBeTruthy();
    expect(cards[1].nativeElement.querySelector('.photo-card__badge')).toBeNull();
  });

  it('should forward showOverlay=false to card', () => {
    fixture.componentRef.setInput('showOverlay', false);
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('app-photo-card'));
    expect(card.nativeElement.querySelector('.photo-card__overlay')).toBeNull();
  });
});
