import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeComponent } from './overtime.component';

describe('OvertimeComponent', () => {
  let component: OvertimeComponent;
  let fixture: ComponentFixture<OvertimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OvertimeComponent]
    });
    fixture = TestBed.createComponent(OvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
