import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberChip } from './member-chip';

describe('MemberChip', () => {
  let component: MemberChip;
  let fixture: ComponentFixture<MemberChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberChip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberChip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
