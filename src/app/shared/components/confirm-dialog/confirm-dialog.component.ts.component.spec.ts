import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponentTsComponent } from './confirm-dialog.component.ts.component';

describe('ConfirmDialogComponentTsComponent', () => {
  let component: ConfirmDialogComponentTsComponent;
  let fixture: ComponentFixture<ConfirmDialogComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponentTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDialogComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
