import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { PhotoService } from './photo.service';
import { Photo } from '../models/photo';

const PICSUM_URL = 'https://picsum.photos/v2/list';
const picsumResponse = [{ id: '1' }, { id: '2' }, { id: '3' }];

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the correct URL with page and limit params', () => {
    service.getPhotos(2).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === PICSUM_URL && r.params.get('page') === '2' && r.params.get('limit') === '30',
    );
    expect(req.request.method).toBe('GET');
    req.flush(picsumResponse);
    vi.advanceTimersByTime(300);
  });

  it('should map the API response to Photo instances', () => {
    let result: Photo[] = [];
    service.getPhotos(1).subscribe((photos) => (result = photos));

    httpMock.expectOne((r) => r.url === PICSUM_URL).flush(picsumResponse);
    vi.advanceTimersByTime(300);

    expect(result.length).toBe(3);
    expect(result[0]).toBeInstanceOf(Photo);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('should construct correct thumbnailUrl from id', () => {
    let result: Photo[] = [];
    service.getPhotos(1).subscribe((photos) => (result = photos));

    httpMock.expectOne((r) => r.url === PICSUM_URL).flush([{ id: '42' }]);
    vi.advanceTimersByTime(300);

    expect(result[0].thumbnailUrl).toBe('https://picsum.photos/id/42/400/300');
  });

  it('should not emit before 200ms have passed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    let emitted = false;
    service.getPhotos(1).subscribe(() => (emitted = true));

    httpMock.expectOne((r) => r.url === PICSUM_URL).flush(picsumResponse);

    vi.advanceTimersByTime(199);
    expect(emitted).toBe(false);

    vi.advanceTimersByTime(1);
    expect(emitted).toBe(true);
  });

  it('should emit within 300ms maximum', () => {
    let emitted = false;
    service.getPhotos(1).subscribe(() => (emitted = true));

    httpMock.expectOne((r) => r.url === PICSUM_URL).flush(picsumResponse);
    vi.advanceTimersByTime(300);

    expect(emitted).toBe(true);
  });

  it('should return an empty array when API responds with empty list', () => {
    let result: Photo[] = [new Photo('stub')];
    service.getPhotos(1).subscribe((photos) => (result = photos));

    httpMock.expectOne((r) => r.url === PICSUM_URL).flush([]);
    vi.advanceTimersByTime(300);

    expect(result).toEqual([]);
  });
});
