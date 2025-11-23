export type ReadingStatus = 'planned' | 'reading' | 'completed';

export enum Category {
  NOVEL = '小说',
  SOCIAL_SCIENCE = '社科',
  PSYCHOLOGY = '心理',
  HISTORY = '历史',
  PHILOSOPHY = '哲学',
  SCIENCE = '科普',
  ECONOMICS = '经济',
  ART = '艺术',
  OTHER = '其他',
}

export interface Excerpt {
  id: string;
  text: string;
  image?: string; // Base64 string
  date: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: Category | string;
  tags: string[];
  status: ReadingStatus;
  
  // Detailed info / Notes
  intro?: string; // Author/Book intro
  coreViews?: string;
  excerpts: Excerpt[];
  thoughts?: string;
  addedAt: number;
}

export type ViewMode = 'category' | 'status';

export interface SearchResultBook {
  title: string;
  author: string;
  coverUrl?: string; // Optional, might not always get a real image from text gen
  intro?: string;
  category?: string;
}