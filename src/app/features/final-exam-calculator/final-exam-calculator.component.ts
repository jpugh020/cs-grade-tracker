import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../core/models/course.model';
import { GradeCategory } from '../../core/models/grade.model';
import { GradeService } from '../../core/services/grade.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-final-exam-calculator',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="final-calculator-container">
      <h2>Final Exam Calculator</h2>
      
      @if (finalStatus.needsFinal) {
        <div class="status-card needs-final">
          <h3>Final Exam Required</h3>
          <p>{{ finalStatus.reason }}</p>
          
          @if (finalStatus.requiredGrade !== undefined) {
            <div class="required-grade">
              <span>To pass the course, you need at least</span>
              <div class="grade-value">{{ finalStatus.requiredGrade | number:'1.1-1' }}%</div>
              <span>on your final exam</span>
            </div>
          }
        </div>
      } @else {
        <div class="status-card exempt">
          <h3>Final Exam Exempt</h3>
          <p>{{ finalStatus.reason }}</p>
        </div>
      }
      
      <div class="simulation-section">
        <h3>Grade Simulator</h3>
        <p>See how different final exam scores would affect your overall grade:</p>
        
        <div class="slider-container">
          <label for="finalGradeSlider">Hypothetical Final Exam Grade: {{ hypotheticalGrade }}%</label>
          <input 
            type="range" 
            id="finalGradeSlider" 
            min="0" 
            max="100" 
            step="1" 
            [(ngModel)]="hypotheticalGrade"
            (ngModelChange)="updateSimulation()"
          >
        </div>
        
        <div class="simulation-result">
          <div class="result-label">Final Course Grade:</div>
          <div class="result-value">{{ simulatedFinalGrade | number:'1.1-1' }}%</div>
          <div class="result-letter">{{ calculateLetterGrade(simulatedFinalGrade) }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .final-calculator-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .status-card {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    
    .status-card.needs-final {
      background: #fff3cd;
      border: 1px solid #ffeeba;
    }
    
    .status-card.exempt {
      background: #d4edda;
      border: 1px solid #c3e6cb;
    }
    
    .required-grade {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 1rem;
      text-align: center;
    }
    
    .grade-value {
      font-size: 2rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    
    .simulation-section {
      margin-top: 2rem;
    }
    
    .slider-container {
      margin: 1.5rem 0;
    }
    
    input[type="range"] {
      width: 100%;
      margin: 0.5rem 0;
    }
    
    .simulation-result {
      display: flex;
      align-items: baseline;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }
    
    .result-label {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    
    .result-value {
      font-size: 1.5rem;
      font-weight: bold;
      margin-right: 0.5rem;
    }
    
    .result-letter {
      font-weight: bold;
      font-size: 1.2rem;
      color: #555;
    }
  `]
})
export class FinalExamCalculatorComponent implements OnChanges {
  @Input() course!: Course;
  @Input() categories: GradeCategory[] = [];
  
  finalStatus = {
    needsFinal: true,
    currentGrade: 0,
    requiredGrade: 90,
    reason: ''
  };
  
  hypotheticalGrade = 80;
  simulatedFinalGrade = 0;
  
  constructor(private gradeService: GradeService) {}
  
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['course'] || changes['categories']) && this.course) {
      this.finalStatus = this.gradeService.calculateFinalExamRequirement(this.course, this.categories);
      this.updateSimulation();
    }
  }
  
  updateSimulation() {
    this.simulatedFinalGrade = this.gradeService.simulateFinalGrade(
      this.course, 
      this.hypotheticalGrade
    );
  }
  
  calculateLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}