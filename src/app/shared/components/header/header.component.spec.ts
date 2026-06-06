import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { HeaderComponent } from './header.component';
import { routes } from '../../../app.routes';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render two navigation buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.header__btn'));
    expect(buttons.length).toBe(2);
  });

  it('should render a Photos button linking to /', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.header__btn'));
    const photosBtn = buttons[0];
    const routerLink = photosBtn.injector.get(RouterLink);
    expect(photosBtn.nativeElement.textContent.trim()).toBe('Photos');
    expect(routerLink.urlTree?.toString()).toBe('/');
  });

  it('should render a Favorites button linking to /favorites', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.header__btn'));
    const favoritesBtn = buttons[1];
    const routerLink = favoritesBtn.injector.get(RouterLink);
    expect(favoritesBtn.nativeElement.textContent.trim()).toBe('Favorites');
    expect(routerLink.urlTree?.toString()).toBe('/favorites');
  });

  it('should mark Photos button active on / route', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/']);
    fixture.detectChanges();
    const photosBtn = fixture.debugElement.query(By.css('.header__btn'));
    expect(photosBtn.nativeElement.classList).toContain('header__btn--active');
  });

  it('should mark Favorites button active on /favorites route', async () => {
    const router = TestBed.inject(Router);
    await router.navigate(['/favorites']);
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('.header__btn'));
    expect(buttons[1].nativeElement.classList).toContain('header__btn--active');
    expect(buttons[0].nativeElement.classList).not.toContain('header__btn--active');
  });

  it('should render inside a <header> element', () => {
    expect(fixture.debugElement.query(By.css('header.header'))).toBeTruthy();
  });

  it('should render a <nav> inside the header', () => {
    expect(fixture.debugElement.query(By.css('nav.header__nav'))).toBeTruthy();
  });
});
