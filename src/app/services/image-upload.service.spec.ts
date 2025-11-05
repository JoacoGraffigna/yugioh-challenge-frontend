import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment';
import { ImageUploadService } from './image-upload';

describe('ImageUploadService', () => {
  let service: ImageUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageUploadService],
    });
    service = TestBed.inject(ImageUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería subir una imagen correctamente', async () => {
    const formData = new FormData();
    const mockResponse = { data: { url: 'http://img.com/test.png' } };

    const promise = service.uploadImage(formData);
    const req = httpMock.expectOne(`https://api.imgbb.com/1/upload?key=${environment.API_KEY_IMAGE_CLOUD}`);
    expect(req.request.method).toBe('POST');

    req.flush(mockResponse);
    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it('debería rechazar la promesa si hay error en la subida', async () => {
    const formData = new FormData();
    const promise = service.uploadImage(formData);
    const req = httpMock.expectOne(`https://api.imgbb.com/1/upload?key=${environment.API_KEY_IMAGE_CLOUD}`);

    req.error(new ProgressEvent('error'));
    await expectAsync(promise).toBeRejected();
  });
});
