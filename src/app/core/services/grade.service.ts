import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { SkywardService } from './skyward-service.service';
import { SchoologyService } from './schoology-service.service';
import { Course } from '../models/course.model';
import { GradeCategory } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  constructor(
    private skywardService: SkywardService,
    private schoologyService: SchoologyService
  ) {}

  getAllCourses(): Observable<Course[]> {
    return forkJoin([
      this.skywardService.getCourses(),
      this.schoologyService.getCourses()
    ]).pipe(
      map(([skywardCourses, schoologyCourses]) => {
        return [...skywardCourses, ...schoologyCourses];
      })
    );
  }

  getCourseDetails(courseId: string, source: 'skyward' | 'schoology'): Observable<{course: Course, categories: GradeCategory[]}> {
    if (source === 'skyward') {
      return this.skywardService.getCourseDetails(courseId);
    } else {
      return this.schoologyService.getCourseDetails(courseId);
    }
  }

  calculateFinalExamRequirement(course: Course, categories: GradeCategory[]): {
    needsFinal: boolean;
    currentGrade: number;
    requiredGrade: number;
    reason: string;
  } {
    // If no threshold is defined, student always takes final
    if (!course.finalExemptThreshold) {
      return {
        needsFinal: true,
        currentGrade: course.currentGrade,
        requiredGrade: 90,
        reason: 'No exemption policy in place for this course.'
      };
    }

    // Check if current grade meets exemption threshold
    if (course.currentGrade >= course.finalExemptThreshold) {
      return {
        needsFinal: false,
        currentGrade: course.currentGrade,
        requiredGrade: 90,
        reason: `Your grade of ${course.currentGrade}% exceeds the exemption threshold of ${course.finalExemptThreshold}%.`
      };
    }

    // Calculate what grade is needed on final to pass
    const passingGrade = 60; // Assuming 60% is passing grade
    const finalWeight = 0.2; // Assuming final is worth 20% of total grade
    const currentWeight = 1 - finalWeight;
    
    const requiredGrade = (passingGrade - (course.currentGrade * currentWeight)) / finalWeight;
    
    return {
      needsFinal: true,
      currentGrade: course.currentGrade,
      requiredGrade: Math.max(0, Math.min(100, requiredGrade)),
      reason: `Your current grade of ${course.currentGrade}% is below the exemption threshold of ${course.finalExemptThreshold}%.`
    };
  }

  simulateFinalGrade(course: Course, hypotheticalFinalGrade: number): number {
    const finalWeight = 0.2; // Assuming final is worth 20%
    const currentWeight = 0.8; // Assuming current grade is worth 80%
    
    return (course.currentGrade * currentWeight) + (hypotheticalFinalGrade * finalWeight);
  }
}