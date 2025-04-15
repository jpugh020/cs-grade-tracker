import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GradeService } from '../../core/services/grade.service';
import { Course } from '../../core/models/course.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h1>CS Grade Tracker</h1>
      
      <div class="summary-cards">
        <div class="card overall-gpa">
          <h2>Overall GPA</h2>
          <div class="gpa-value">{{ calculateGPA() | number:'1.2-2' }}</div>
        </div>
        
        <div class="card finals-status">
          <h2>Finals Status</h2>
          <div class="finals-count">
            {{ getExemptCount() }} of {{ courses.length }} courses exempt
          </div>
        </div>
      </div>
      
      <h2>Your Courses</h2>
      
      <div class="course-list">
        @for (course of courses; track course.id) {
          <div class="course-card" [routerLink]="['/course', course.id, course.apiSource]">
            <div class="course-header">
              <h3>{{ course.title }}</h3>
              <span class="course-code">{{ course.courseCode }}</span>
            </div>
            
            <div class="course-details">
              <div class="grade-display">
                <div class="grade-value">{{ course.currentGrade | number:('1.1-1') }}%</div>
                <div class="letter-grade">{{ course.letterGrade }}</div>
              </div>
              
              <div class="final-status" [class.exempt]="isFinalExempt(course)">
                {{ isFinalExempt(course) ? 'Final Exempt' : 'Final Required' }}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }
    
    .summary-cards {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      flex: 1;
    }
    
    .gpa-value, .finals-count {
      font-size: 2rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }
    
    .course-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .course-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .course-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .course-code {
      color: #666;
      font-size: 0.9rem;
    }
    
    .course-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .grade-display {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    
    .grade-value {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .letter-grade {
      font-size: 1.2rem;
      font-weight: bold;
      color: #555;
    }
    
    .final-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: #ffc107;
      color: #000;
      font-weight: 500;
    }
    
    .final-status.exempt {
      background: #4caf50;
      color: white;
    }
  `]
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];

  constructor(private gradeService: GradeService) {}

  ngOnInit() {
    this.gradeService.getAllCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  calculateGPA(): number {
    if (this.courses.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    this.courses.forEach(course => {
      let points = 0;
      if (course.letterGrade === 'A') points = 4.0;
      else if (course.letterGrade === 'B') points = 3.0;
      else if (course.letterGrade === 'C') points = 2.0;
      else if (course.letterGrade === 'D') points = 1.0;
      
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  getExemptCount(): number {
    return this.courses.filter(course => this.isFinalExempt(course)).length;
  }

  isFinalExempt(course: Course): boolean {
    return course.finalExemptThreshold !== undefined && 
           course.currentGrade >= course.finalExemptThreshold;
  }
}