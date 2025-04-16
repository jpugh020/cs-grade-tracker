import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a numeric grade into an appropriate CSS color class
 * Example usage: {{ 85 | gradeColor }}
 * Output: 'grade-b' (a CSS class name)
 */
@Pipe({
  name: 'gradeColor',
  standalone: true
})
export class GradeColorPipe implements PipeTransform {
  transform(grade: number): string {
    if (grade >= 90) return 'grade-a';
    if (grade >= 80) return 'grade-b';
    if (grade >= 70) return 'grade-c';
    if (grade >= 60) return 'grade-d';
    return 'grade-f';
  }
}