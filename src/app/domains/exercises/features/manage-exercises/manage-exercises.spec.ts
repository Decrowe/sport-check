import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExercises } from './manage-exercises';

describe('ManageExercises', () => {
  let component: ManageExercises;
  let fixture: ComponentFixture<ManageExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExercises],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageExercises);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
