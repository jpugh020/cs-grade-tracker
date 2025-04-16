import { Pipe, PipeTransform } from '@angular/core';
import { GradeCategory } from '../../core/models/grade.model';

/**
 * Calculates weighted average from grade categories
 * Example usage: {{ gradeCategories | weightedAverage }}
 */
@Pipe({
  name: 'weightedAverage',
  standalone: true
})
export class WeightedAveragePipe implements PipeTransform {
  transform(categories: GradeCategory[]): number {
    if (!categories || categories.length === 0) return 0;
    
    let totalWeight = 0;
    let weightedSum = 0;
    
    categories.forEach(category => {
      // Skip categories with no items
      if (category.items.length === 0) return;
      
      totalWeight += category.weight;
      weightedSum += category.average * category.weight;
    });
    
    // Prevent division by zero
    if (totalWeight === 0) return 0;
    
    // Return weighted average rounded to 2 decimal places
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  }
}