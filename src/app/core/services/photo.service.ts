import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Photo } from '../models/photo';

interface PicsumPhoto {
  id: string;
  download_url: string;
}

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly http = inject(HttpClient);
  private readonly PAGE_SIZE = 30;

  getPhotos(page: number): Observable<Photo[]> {
    return this.http
      .get<PicsumPhoto[]>('https://picsum.photos/v2/list', {
        params: { page: String(page), limit: String(this.PAGE_SIZE) },
      })
      .pipe(
        delay(this.randomDelay()),
        map((items) => items.map((item) => new Photo(item.id, item.download_url))),
      );
  }

  private randomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
