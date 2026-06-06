import { Injectable, signal } from '@angular/core';
import { Photo } from '../models/photo';

@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private readonly STORAGE_KEY = 'photo-favourites';

  private readonly _ids = signal<Set<string>>(this.load());
  readonly favouriteIds = this._ids.asReadonly();

  isFavourite(id: string): boolean {
    return this._ids().has(id);
  }

  add(photo: Photo): void {
    if (!this.isFavourite(photo.id)) {
      this._ids.update((s) => new Set([...s, photo.id]));
      this.persist();
    }
  }

  remove(id: string): void {
    this._ids.update((s) => new Set([...s].filter((i) => i !== id)));
    this.persist();
  }

  // I'm calling this synchronously after each update instead of using an effect, becuase effect() runs asynchronously and the tab could close before it fires, losing the data
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this._ids()]));
  }

  private load(): Set<string> {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
      return new Set(ids);
    } catch {
      return new Set();
    }
  }
}
