import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api-service.service';
import { Course } from '../models/course.model';
import { GradeItem, GradeCategory } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class SkywardService {
  private readonly API_BASE = 'https://skyward-api.example.com/v1';

  constructor(private apiService: ApiService) {}

  getCourses(): Observable<Course[]> {
    return this.apiService.get<any>(`${this.API_BASE}/courses`)
      .pipe(
        map(response => {
          return response.courses.map((course: Course) => ({
            id: course.id,
            title: course.title,
            courseCode: course.courseCode,
            instructor: course.instructor,
            semester: course.semester,
            currentGrade: course.currentGrade,
            letterGrade: this.calculateLetterGrade(course.currentGrade),
            credits: course.credits,
            finalExemptThreshold: course.finalExemptThreshold,
            apiSource: 'skyward'
          }));
        }),
        catchError(error => {
          console.error('Error fetching Skyward courses:', error);
          return of([]);
        })
      );
  }

  getCourseDetails(courseId: string): Observable<{course: Course, categories: GradeCategory[]}> {
    return this.apiService.get<any>(`${this.API_BASE}/courses/${courseId}`)
      .pipe(
        map(response => {
          // Process and map the course details and grade categories
          // Implementation details...
          return {
            course: {} as Course, // Mapped course object
            categories: [] as GradeCategory[] // Mapped categories
          };
        })
      );
  }

  private calculateLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}