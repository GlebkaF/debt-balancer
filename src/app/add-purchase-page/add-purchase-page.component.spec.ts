import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchasePageComponent } from './add-purchase-page.component';

describe('AddPurchasePageComponent', () => {
  let component: AddPurchasePageComponent;
  let fixture: ComponentFixture<AddPurchasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPurchasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
