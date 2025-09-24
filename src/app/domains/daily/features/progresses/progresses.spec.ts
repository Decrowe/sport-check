import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Progresses } from './progresses';

describe('Progresses', () => {
  let component: Progresses;
  let fixture: ComponentFixture<Progresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Progresses],
    }).compileComponents();

    fixture = TestBed.createComponent(Progresses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
