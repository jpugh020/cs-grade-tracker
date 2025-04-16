import { Pipe, PipeTransform } from '@angular/core';

/**
 * Determines if a student is exempt from final based on course threshold
 * Example usage: {{ currentGrade | finalExempt:course.finalExemptThreshold }}
 * Output: true/false
 */
@Pipe({
  name: 'finalExempt',
  standalone: true
})
export class FinalExemptPipe implements PipeTransform {
  transform(currentGrade: number, exemptionThreshold?: number): boolean {
    if (!exemptionThreshold) return false;
    return currentGrade >= exemptionThreshold;
  }
}