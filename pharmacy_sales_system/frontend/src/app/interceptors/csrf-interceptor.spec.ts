import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CsrfInterceptor } from './csrf-interceptor';

describe('CsrfInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([CsrfInterceptor]))
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería agregar X-CSRFToken en POST si la cookie existe', () => {
    spyOnProperty(document, 'cookie', 'get').and.returnValue('csrftoken=TEST_CSRF_TOKEN');

    http.post('/api/test', {}).subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('X-CSRFToken')).toBeTrue();
    expect(req.request.headers.get('X-CSRFToken')).toBe('TEST_CSRF_TOKEN');

    req.flush({});
  });

  it('no debería agregar X-CSRFToken en GET', () => {
    spyOnProperty(document, 'cookie', 'get').and.returnValue('csrftoken=TEST_CSRF_TOKEN');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('X-CSRFToken')).toBeFalse();

    req.flush({});
  });
});
