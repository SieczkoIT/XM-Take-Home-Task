import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PhotosComponent } from './photos.component';
import { PhotoService } from '../../core/services/photo.service';
import { FavouritesService } from '../../core/services/favourites.service';
import { Photo } from '../../core/models/photo';

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(public callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }
}

const mockPhotos = [new Photo('1', 'https://picsum.photos/id/1/400/300'), new Photo('2', 'https://picsum.photos/id/2/400/300')];

describe('PhotosComponent', () => {
  let component: PhotosComponent;
  let fixture: ComponentFixture<PhotosComponent>;
  let photoServiceSpy: { getPhotos: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localStorage.clear();
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    photoServiceSpy = { getPhotos: vi.fn().mockReturnValue(of(mockPhotos)) };

    await TestBed.configureTestingModule({
      imports: [PhotosComponent],
      providers: [{ provide: PhotoService, useValue: photoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load first page on init', () => {
    fixture.detectChanges();
    expect(component.photos()).toEqual(mockPhotos);
    expect(photoServiceSpy.getPhotos).toHaveBeenCalledWith(1);
  });

  it('should set isLoading to false after photos are returned', () => {
    fixture.detectChanges();
    expect(component.isLoading()).toBe(false);
  });

  it('should load next page when onScrolled is called', () => {
    fixture.detectChanges();
    component.onScrolled();
    expect(photoServiceSpy.getPhotos).toHaveBeenCalledTimes(2);
    expect(photoServiceSpy.getPhotos).toHaveBeenCalledWith(2);
    expect(component.photos().length).toBe(4);
  });

  it('should add photo to favourites when onAddToFavourites is called', () => {
    fixture.detectChanges();
    component.onAddToFavourites(mockPhotos[0]);
    expect(TestBed.inject(FavouritesService).isFavourite('1')).toBe(true);
  });

  it('should reflect favourite state from service signal', () => {
    fixture.detectChanges();
    const svc = TestBed.inject(FavouritesService);
    expect(component.favouriteIds().has('1')).toBe(false);
    svc.add(mockPhotos[0]);
    expect(component.favouriteIds().has('1')).toBe(true);
  });

  it('should attach IntersectionObserver to the sentinel element', () => {
    fixture.detectChanges();
    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalled();
  });
});
