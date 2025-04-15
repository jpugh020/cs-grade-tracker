import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalExamCalculatorComponent } from './final-exam-calculator.component';

describe('FinalExamCalculatorComponent', () => {
  let component: FinalExamCalculatorComponent;
  let fixture: ComponentFixture<FinalExamCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalExamCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalExamCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
