import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(imageData: FormData): Promise<any> {
    const url = `https://api.imgbb.com/1/upload?key=${environment.API_KEY_IMAGE_CLOUD}`;

    return new Promise((resolve, reject) => {
      this.http.post(url, imageData).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }
}
