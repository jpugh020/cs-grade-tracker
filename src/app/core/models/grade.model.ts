export interface GradeItem {
id: string;
  title: string;
  category: string; 
  dueDate: Date;
  pointsEarned: number;
  pointsPossible: number;
  weight: number;
  isSubmitted: boolean;
  feedback?: string;

}

export interface GradeCategory {
  name: string;
  weight: number;
  average: number;
  items: GradeItem[];
}
