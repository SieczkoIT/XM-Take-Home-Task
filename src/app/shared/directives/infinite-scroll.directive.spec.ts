import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

// Host component gives the directive a real DOM element to attach to
@Component({
  standalone: true,
  imports: [InfiniteScrollDirective],
  template: `<div appInfiniteScroll (scrolled)="onScrolled()"></div>`,
})
class TestHostComponent {
  onScrolled = vi.fn();
}

class MockIntersectionObserver {
  static lastInstance: MockIntersectionObserver;
  static lastCallback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    MockIntersectionObserver.lastCallback = callback;
    MockIntersectionObserver.lastInstance = this;
  }
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should observe the host element on init', () => {
    const el = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(MockIntersectionObserver.lastInstance.observe).toHaveBeenCalledWith(el);
  });

  it('should emit scrolled when entry is intersecting', () => {
    MockIntersectionObserver.lastCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      MockIntersectionObserver.lastInstance as unknown as IntersectionObserver
    );
    expect(host.onScrolled).toHaveBeenCalledTimes(1);
  });

  it('should not emit scrolled when entry is not intersecting', () => {
    MockIntersectionObserver.lastCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      MockIntersectionObserver.lastInstance as unknown as IntersectionObserver
    );
    expect(host.onScrolled).not.toHaveBeenCalled();
  });

  it('should disconnect the observer on destroy', () => {
    fixture.destroy();
    expect(MockIntersectionObserver.lastInstance.disconnect).toHaveBeenCalled();
  });
});
