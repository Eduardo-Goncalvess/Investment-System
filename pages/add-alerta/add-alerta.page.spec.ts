import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAlertaPage } from './add-alerta.page';

describe('AddAlertaPage', () => {
  let component: AddAlertaPage;
  let fixture: ComponentFixture<AddAlertaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAlertaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
