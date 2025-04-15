export interface Course {
id: string;
title: string;
courseCode: string;
instructor: string;
semester: string;
currentGrade: number;
letterGrade: string;
credits: number;
finalExemptThreshold?: number;
apiSource: 'skyward' | 'schoology';

}
