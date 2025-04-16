import { Pipe, PipeTransform } from '@angular/core';
import { GradeItem } from '../../core/models/grade.model';

/**
 * Analyzes grade items to determine grade trend
 * Example usage: {{ gradeItems | gradeTrend }}
 * Output: 'improving', 'declining', or 'stable'
 */
@Pipe({
  name: 'gradeTrend',
  standalone: true
})
export class GradeTrendPipe implements PipeTransform {
  transform(gradeItems: GradeItem[], recentCount: number = 3): 'improving' | 'declining' | 'stable' | 'insufficient' {
    if (!gradeItems || gradeItems.length < recentCount) {
      return 'insufficient';
    }
    
    // Sort items by date (newest first)
    const sortedItems = [...gradeItems].sort((a, b) => {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    });
    
    // Get recent and previous items
    const recentItems = sortedItems.slice(0, recentCount);
    const previousItems = sortedItems.slice(recentCount, recentCount * 2);
    
    // If we don't have enough items for comparison
    if (previousItems.length < recentCount) {
      return 'insufficient';
    }
    
    // Calculate averages
    const recentAvg = this.calculateAverage(recentItems);
    const previousAvg = this.calculateAverage(previousItems);
    
    // Determine trend
    const difference = recentAvg - previousAvg;
    if (Math.abs(difference) < 3) return 'stable'; // Less than 3% difference is considered stable
    return difference > 0 ? 'improving' : 'declining';
  }
  
  private calculateAverage(items: GradeItem[]): number {
    if (items.length === 0) return 0;
    
    let totalPercentage = 0;
    items.forEach(item => {
      const percentage = (item.pointsEarned / item.pointsPossible) * 100;
      totalPercentage += percentage;
    });
    
    return totalPercentage / items.length;
  }
}