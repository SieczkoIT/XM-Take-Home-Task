import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a photo and report it as favorite', () => {
    service.add(new Photo('42'));
    expect(service.isFavorite('42')).toBe(true);
  });

  it('should not add duplicate IDs', () => {
    service.add(new Photo('1'));
    service.add(new Photo('1'));
    expect(service.favoriteIds().size).toBe(1);
  });

  it('should remove a photo', () => {
    service.add(new Photo('7'));
    service.remove('7');
    expect(service.isFavorite('7')).toBe(false);
  });

  it('should persist IDs to localStorage', () => {
    service.add(new Photo('5'));
    const stored = JSON.parse(localStorage.getItem('photo-favorites') ?? '[]');
    expect(stored).toContain('5');
  });

  it('should load persisted IDs on init', () => {
    localStorage.setItem('photo-favorites', JSON.stringify(['99', '100']));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(FavoritesService);
    expect(fresh.isFavorite('99')).toBe(true);
    expect(fresh.isFavorite('100')).toBe(true);
  });
});
