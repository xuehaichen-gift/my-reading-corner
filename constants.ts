import { Book, Category, ReadingStatus } from './types';

export const CATEGORIES = Object.values(Category);

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  planned: '计划阅读',
  reading: '正在阅读',
  completed: '完成阅读',
};

export const STATUS_COLORS: Record<ReadingStatus, string> = {
  planned: 'bg-gray-100 text-gray-600',
  reading: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: '活着',
    author: '余华',
    coverUrl: 'https://picsum.photos/seed/alive/200/300',
    category: Category.NOVEL,
    tags: ['中国文学', '经典', '人生'],
    status: 'completed',
    intro: '《活着》讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，可他嗜赌如命，终于赌光了家业，一贫如洗...',
    coreViews: '人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。',
    excerpts: [
      {
        id: 'init-1',
        text: '少年去游荡，中年想掘藏，老年做和尚。',
        date: Date.now()
      }
    ],
    thoughts: '非常震撼，读完后久久不能平静。',
    addedAt: Date.now(),
  },
  {
    id: '2',
    title: '置身事内',
    author: '兰小欢',
    coverUrl: 'https://picsum.photos/seed/econ/200/300',
    category: Category.ECONOMICS,
    tags: ['中国经济', '政府', '宏观'],
    status: 'reading',
    intro: '本书将经济学原理与中国经济发展的实践有机结合，介绍中国政府在经济发展中扮演的角色。',
    excerpts: [],
    addedAt: Date.now() - 100000,
  },
  {
    id: '3',
    title: '被讨厌的勇气',
    author: '岸见一郎',
    coverUrl: 'https://picsum.photos/seed/courage/200/300',
    category: Category.PSYCHOLOGY,
    tags: ['阿德勒', '心理学', '成长'],
    status: 'planned',
    intro: '一名深谙阿德勒心理学的“哲人”，与一位烦恼诸多的“青年”，通过对话的形式... ',
    excerpts: [],
    addedAt: Date.now() - 200000,
  }
];