import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistercardComponent } from './registercard.component';

describe('RegistercardComponent', () => {
  let component: RegistercardComponent;
  let fixture: ComponentFixture<RegistercardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistercardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
