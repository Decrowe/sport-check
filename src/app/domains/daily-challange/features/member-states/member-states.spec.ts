import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStates } from './member-states';

describe('MemberStates', () => {
  let component: MemberStates;
  let fixture: ComponentFixture<MemberStates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberStates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
