/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FavouritesService } from './favourites.service';

describe('Service: Favourites', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavouritesService]
    });
  });

  it('should ...', inject([FavouritesService], (service: FavouritesService) => {
    expect(service).toBeTruthy();
  }));
});
