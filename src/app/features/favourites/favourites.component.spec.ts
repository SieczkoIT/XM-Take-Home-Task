import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { FavouritesComponent } from './favourites.component';
import { FavouritesService } from '../../core/services/favourites.service';
import { Photo } from '../../core/models/photo';
import { routes } from '../../app.routes';

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let favouritesService: FavouritesService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [FavouritesComponent],
      providers: [provideRouter(routes), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    favouritesService = TestBed.inject(FavouritesService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty message when there are no favourites', () => {
    const empty = fixture.nativeElement.querySelector('.favourites__empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('No favourites yet');
  });

  it('should not show grid when there are no favourites', () => {
    expect(fixture.debugElement.query(By.css('app-photo-grid'))).toBeNull();
  });

  it('should show grid when there are favourites', () => {
    favouritesService.add(new Photo('1'));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-photo-grid'))).toBeTruthy();
  });

  it('should hide empty message when there are favourites', () => {
    favouritesService.add(new Photo('1'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.favourites__empty')).toBeNull();
  });

  it('should navigate to photo detail when a card is clicked', async () => {
    favouritesService.add(new Photo('42'));
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onPhotoClicked(new Photo('42'));

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', '42']);
  });

  it('should update the grid reactively when a favourite is removed', () => {
    favouritesService.add(new Photo('1'));
    favouritesService.add(new Photo('2'));
    fixture.detectChanges();

    favouritesService.remove('1');
    fixture.detectChanges();

    expect(component.favouritePhotos().length).toBe(1);
    expect(component.favouritePhotos()[0].id).toBe('2');
  });
});
