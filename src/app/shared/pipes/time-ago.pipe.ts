import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a date into a relative time string (e.g., "2 days ago")
 * Example usage: {{ assignment.dueDate | timeAgo }}
 */
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    
    // Convert input to Date if it's a string
    const date = typeof value === 'string' ? new Date(value) : value;
    
    // Get time difference in seconds
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    // Time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    // For future dates
    if (seconds < 0) {
      const absSeconds = Math.abs(seconds);
      if (absSeconds < intervals.minute) return 'Just now';
      if (absSeconds < intervals.hour) return `In ${Math.floor(absSeconds / intervals.minute)} minutes`;
      if (absSeconds < intervals.day) return `In ${Math.floor(absSeconds / intervals.hour)} hours`;
      if (absSeconds < intervals.week) return `In ${Math.floor(absSeconds / intervals.day)} days`;
      if (absSeconds < intervals.month) return `In ${Math.floor(absSeconds / intervals.week)} weeks`;
      if (absSeconds < intervals.year) return `In ${Math.floor(absSeconds / intervals.month)} months`;
      return `In ${Math.floor(absSeconds / intervals.year)} years`;
    }
    
    // For past dates
    if (seconds < intervals.minute) return 'Just now';
    if (seconds < intervals.hour) return `${Math.floor(seconds / intervals.minute)} minutes ago`;
    if (seconds < intervals.day) return `${Math.floor(seconds / intervals.hour)} hours ago`;
    if (seconds < intervals.week) return `${Math.floor(seconds / intervals.day)} days ago`;
    if (seconds < intervals.month) return `${Math.floor(seconds / intervals.week)} weeks ago`;
    if (seconds < intervals.year) return `${Math.floor(seconds / intervals.month)} months ago`;
    return `${Math.floor(seconds / intervals.year)} years ago`;
  }
}