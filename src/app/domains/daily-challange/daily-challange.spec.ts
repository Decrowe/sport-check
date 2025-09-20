import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyChallange } from './daily-challange';

describe('DailyChallange', () => {
  let component: DailyChallange;
  let fixture: ComponentFixture<DailyChallange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyChallange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyChallange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
