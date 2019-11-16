import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDebtPageComponent } from './pay-debt-page.component';

describe('PayDebtPageComponent', () => {
  let component: PayDebtPageComponent;
  let fixture: ComponentFixture<PayDebtPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDebtPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayDebtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
