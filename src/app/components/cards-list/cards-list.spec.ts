import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsList } from './cards-list';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('CardsList', () => {
  let component: CardsList;
  let fixture: ComponentFixture<CardsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsList,HttpClientTestingModule,ToastrModule.forRoot(),RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
