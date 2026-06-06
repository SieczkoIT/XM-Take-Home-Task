import { TestBed } from '@angular/core/testing';
import { FavouritesService } from './favourites.service';
import { Photo } from '../models/photo';

describe('FavouritesService', () => {
  let service: FavouritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a photo and report it as favourite', () => {
    service.add(new Photo('42', 'https://picsum.photos/id/42/400/300'));
    expect(service.isFavourite('42')).toBe(true);
  });

  it('should not add duplicate IDs', () => {
    service.add(new Photo('1', 'https://picsum.photos/id/1/400/300'));
    service.add(new Photo('1', 'https://picsum.photos/id/1/400/300'));
    expect(service.favouriteIds().size).toBe(1);
  });

  it('should remove a photo', () => {
    service.add(new Photo('7', 'https://picsum.photos/id/7/400/300'));
    service.remove('7');
    expect(service.isFavourite('7')).toBe(false);
  });

  it('should persist IDs to localStorage', () => {
    service.add(new Photo('5', 'https://picsum.photos/id/5/400/300'));
    const stored = JSON.parse(localStorage.getItem('photo-favourites') ?? '[]');
    expect(stored).toContain('5');
  });

  it('should load persisted IDs on init', () => {
    localStorage.setItem('photo-favourites', JSON.stringify(['99', '100']));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavouritesService);
    expect(fresh.isFavourite('99')).toBe(true);
    expect(fresh.isFavourite('100')).toBe(true);
  });
});
