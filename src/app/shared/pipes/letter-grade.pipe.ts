import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a numeric grade into a letter grade
 * Example usage: {{ 85 | letterGrade }}
 * Output: 'B'
 */
@Pipe({
  name: 'letterGrade',
  standalone: true
})
export class LetterGradePipe implements PipeTransform {
  transform(grade: number): string {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  }
}