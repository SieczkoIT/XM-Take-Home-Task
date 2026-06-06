import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { FavoritesComponent } from './favorites.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { Photo } from '../../core/models/photo';
import { routes } from '../../app.routes';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesService: FavoritesService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [provideRouter(routes), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    favoritesService = TestBed.inject(FavoritesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty message when there are no favorites', () => {
    const empty = fixture.nativeElement.querySelector('.favorites__empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('No favorites yet');
  });

  it('should not show grid when there are no favorites', () => {
    expect(fixture.debugElement.query(By.css('app-photo-grid'))).toBeNull();
  });

  it('should show grid when there are favorites', () => {
    favoritesService.add(new Photo('1'));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-photo-grid'))).toBeTruthy();
  });

  it('should hide empty message when there are favorites', () => {
    favoritesService.add(new Photo('1'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.favorites__empty')).toBeNull();
  });

  it('should navigate to photo detail when a card is clicked', async () => {
    favoritesService.add(new Photo('42'));
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onPhotoClicked(new Photo('42'));

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', '42']);
  });

  it('should update the grid reactively when a favorite is removed', () => {
    favoritesService.add(new Photo('1'));
    favoritesService.add(new Photo('2'));
    fixture.detectChanges();

    favoritesService.remove('1');
    fixture.detectChanges();

    expect(component.favoritePhotos().length).toBe(1);
    expect(component.favoritePhotos()[0].id).toBe('2');
  });
});
