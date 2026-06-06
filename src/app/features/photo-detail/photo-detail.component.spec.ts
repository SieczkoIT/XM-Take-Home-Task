import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { ActivatedRoute } from '@angular/router';

import { PhotoDetailComponent } from './photo-detail.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { Photo } from '../../core/models/photo';
import { routes } from '../../app.routes';

const PHOTO_ID = '42';

function createActivatedRouteStub(id: string) {
  return {
    snapshot: { paramMap: { get: () => id } },
  };
}

describe('PhotoDetailComponent', () => {
  let component: PhotoDetailComponent;
  let fixture: ComponentFixture<PhotoDetailComponent>;
  let favoritesService: FavoritesService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PhotoDetailComponent],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        { provide: ActivatedRoute, useValue: createActivatedRouteStub(PHOTO_ID) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoDetailComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the photo using its fullSizeUrl', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.src).toBe(new Photo(PHOTO_ID).fullSizeUrl);
  });

  it('should have the remove button disabled when photo is not a favorite', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should have the remove button enabled when photo is a favorite', () => {
    favoritesService.add(new Photo(PHOTO_ID));
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('should remove photo from favorites and navigate to /favorites on button click', () => {
    favoritesService.add(new Photo(PHOTO_ID));
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.removeFromFavorites();

    expect(favoritesService.isFavorite(PHOTO_ID)).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });

  it('should reflect isFavorite reactively', () => {
    expect(component.isFavorite()).toBe(false);
    favoritesService.add(new Photo(PHOTO_ID));
    expect(component.isFavorite()).toBe(true);
  });
});
