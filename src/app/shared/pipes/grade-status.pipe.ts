import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gradeStatus',
  standalone: true
})
export class GradeStatusPipe implements PipeTransform {

   transform(grade: number, passingThreshold: number = 60): 'Passing' | 'Failing' {
    return grade >= passingThreshold ? 'Passing' : 'Failing';
  }

}
