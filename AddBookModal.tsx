import React, { useState } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { searchBooksViaGemini } from './geminiService';
import { SearchResultBook, Book, Category } from './types';
import { Modal } from './Modal';
import { Button } from './Button';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onAddBook }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResultBook[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const books = await searchBooksViaGemini(query);
      setResults(books);
    } catch (error) {
      console.error("Failed to search", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (result: SearchResultBook) => {
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: result.title,
      author: result.author,
      // Use picsum with a deterministic seed based on title for consistent "fake" covers
      coverUrl: result.coverUrl || `https://picsum.photos/seed/${encodeURIComponent(result.title)}/300/400`,
      category: result.category || Category.OTHER,
      status: 'planned',
      tags: [],
      intro: result.intro,
      addedAt: Date.now(),
      coreViews: '',
      excerpts: [],
      thoughts: ''
    };
    onAddBook(newBook);
    // Reset state
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="新增书籍 (豆瓣搜索)">
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入书名或作者..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-douban-green focus:border-transparent outline-none"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            <span className="ml-2">搜索</span>
          </Button>
        </form>

        <div className="min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>正在从豆瓣书库匹配信息...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((book, idx) => (
                <div 
                  key={idx} 
                  className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 hover:border-douban-green cursor-pointer transition-all group"
                  onDoubleClick={() => handleSelectBook(book)}
                >
                  <img 
                    src={`https://picsum.photos/seed/${encodeURIComponent(book.title)}/100/140`} 
                    alt={book.title} 
                    className="w-16 h-24 object-cover rounded shadow-sm bg-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-douban-text text-lg group-hover:text-douban-green">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{book.author}</p>
                    <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
                      {book.category}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.intro}</p>
                  </div>
                  <div className="flex items-center">
                    <Button size="sm" variant="secondary" onClick={() => handleSelectBook(book)}>
                      <Plus size={16} className="mr-1"/> 添加
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center text-gray-500 py-10">
              未找到相关书籍，请尝试更换关键词。
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              输入关键词开始搜索
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};