import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsUpload } from './cards-upload';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('CardsUpload', () => {
  let component: CardsUpload;
  let fixture: ComponentFixture<CardsUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsUpload,HttpClientTestingModule,ToastrModule.forRoot(),RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
