import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api-service.service';
import { Course } from '../models/course.model';
import { GradeItem, GradeCategory } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class SchoologyService {
  private readonly API_BASE = 'https://api.schoology.com/v1';

  constructor(private apiService: ApiService) {}

  getCourses(): Observable<Course[]> {
    return this.apiService.get<any>(`${this.API_BASE}/sections`)
      .pipe(
        map(response => {
          return response.section.map((section: Course) => ({
            id: section.id,
            title: section.title,
            courseCode: section.courseCode,
            instructor: section.instructor,
            semester: section.semester,
            currentGrade: section.currentGrade,
            letterGrade: section.letterGrade,
            credits: section.credits || 0,
            finalExemptThreshold: section.finalExemptThreshold,
            apiSource: 'schoology'
          }));
        }),
        catchError(error => {
          console.error('Error fetching Schoology courses:', error);
          return of([]);
        })
      );
  }

  getCourseDetails(courseId: string): Observable<{course: Course, categories: GradeCategory[]}> {
    return this.apiService.get<any>(`${this.API_BASE}/sections/${courseId}/grades`)
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
}