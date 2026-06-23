import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCompraPage } from './add-compra.page';

describe('AddCompraPage', () => {
  let component: AddCompraPage;
  let fixture: ComponentFixture<AddCompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
