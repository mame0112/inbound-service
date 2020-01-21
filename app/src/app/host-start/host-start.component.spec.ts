import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostStartComponent } from './host-start.component';

describe('HostStartComponent', () => {
  let component: HostStartComponent;
  let fixture: ComponentFixture<HostStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
