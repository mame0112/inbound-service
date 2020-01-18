import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStartComponent } from './visit-start.component';

describe('VisitStartComponent', () => {
  let component: VisitStartComponent;
  let fixture: ComponentFixture<VisitStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
