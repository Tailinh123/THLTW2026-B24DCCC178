export type Difficulty = "Dễ" | "Trung bình" | "Khó" | "Rất khó";

export interface KnowledgeBlock {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface Question {
  id: string;
  subjectId: string;
  blockId: string;
  content: string;
  difficulty: Difficulty;
}

export interface Exam {
  id: string;
  subjectId: string;
  questions: Question[];
}
