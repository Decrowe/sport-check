import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMembers } from './manage-members';

describe('ManageMembers', () => {
  let component: ManageMembers;
  let fixture: ComponentFixture<ManageMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMembers],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
