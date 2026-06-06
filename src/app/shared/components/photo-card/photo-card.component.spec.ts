import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoCardComponent } from './photo-card.component';
import { Photo } from '../../../core/models/photo';

const mockPhoto = new Photo('1');

describe('PhotoCardComponent', () => {
  let component: PhotoCardComponent;
  let fixture: ComponentFixture<PhotoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', mockPhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the photo image with thumbnailUrl', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(mockPhoto.thumbnailUrl);
    expect(img.alt).toBe('Photo 1');
  });

  it('should not show favourite badge by default', () => {
    expect(fixture.nativeElement.querySelector('.photo-card__badge')).toBeNull();
  });

  it('should show favourite badge when isFavourite is true', () => {
    fixture.componentRef.setInput('isFavourite', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.photo-card__badge')).toBeTruthy();
  });

  it('should show overlay by default', () => {
    expect(fixture.nativeElement.querySelector('.photo-card__overlay')).toBeTruthy();
  });

  it('should hide overlay when showOverlay is false', () => {
    fixture.componentRef.setInput('showOverlay', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.photo-card__overlay')).toBeNull();
  });

  it('should show favorite_border icon in overlay when not a favourite', () => {
    const icon = fixture.nativeElement.querySelector('.photo-card__overlay-icon');
    expect(icon.textContent.trim()).toBe('favorite_border');
  });

  it('should show favorite icon in overlay when isFavourite is true', () => {
    fixture.componentRef.setInput('isFavourite', true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.photo-card__overlay-icon');
    expect(icon.textContent.trim()).toBe('favorite');
  });

  it('should emit cardClicked with the photo on click', () => {
    let emitted: Photo | undefined;
    fixture.componentInstance.cardClicked.subscribe((p: Photo) => (emitted = p));
    fixture.nativeElement.querySelector('.photo-card').click();
    expect(emitted).toEqual(mockPhoto);
  });
});
