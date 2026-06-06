import { computed, Injectable, signal } from '@angular/core';
import { Photo } from '../models/photo';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'photo-favorites';

  private readonly _ids = signal<Set<string>>(this.load());
  readonly favoriteIds = this._ids.asReadonly();
  readonly favoritePhotos = computed(() => [...this._ids()].map((id) => new Photo(id)));

  isFavorite(id: string): boolean {
    return this._ids().has(id);
  }

  add(photo: Photo): void {
    if (this.isFavorite(photo.id)) return;
    this._ids.update((s) => new Set([...s, photo.id]));
    this.persist();
  }

  remove(id: string): void {
    if (!this.isFavorite(id)) return;
    this._ids.update((s) => new Set([...s].filter((i) => i !== id)));
    this.persist();
  }

  // I'm calling this synchronously after each update instead of using an effect, becuase effect() runs asynchronously and the tab could close before it fires, losing the data
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...this._ids()]));
  }

  private load(): Set<string> {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
      const ids = Array.isArray(parsed) ? parsed : [];
      return new Set(ids.filter((x): x is string => typeof x === 'string'));
    } catch {
      return new Set();
    }
  }
}
