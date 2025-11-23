import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, BookOpen, Layers, Plus, Grid, List, Edit, Download, Upload, FileJson } from 'lucide-react';
import { Book, Category, ViewMode, ReadingStatus } from './types';
import { INITIAL_BOOKS, CATEGORIES, STATUS_LABELS, STATUS_COLORS } from './constants';
import { Button } from './Button';
import { AddBookModal } from './AddBookModal';
import { BookDetailModal } from './BookDetailModal';

// --- Header Component ---
const Header = ({ 
  onSearch, 
  onAddClick,
  viewMode,
  setViewMode,
  onExport,
  onImport
}: { 
  onSearch: (q: string) => void, 
  onAddClick: () => void,
  viewMode: ViewMode,
  setViewMode: (m: ViewMode) => void,
  onExport: () => void,
  onImport: () => void
}) => (
  <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-douban-green tracking-tight flex items-center gap-2">
          <BookOpen className="fill-current" />
          我的读书
          <span className="text-xs font-normal text-gray-500 self-end mb-1 ml-1 hidden sm:inline">My Corner</span>
        </h1>
      </div>

      <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
         <input
           type="text"
           placeholder="搜索书名、作者..."
           onChange={(e) => onSearch(e.target.value)}
           className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-douban-green focus:bg-white transition-all"
         />
         <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Data Management Buttons */}
        <div className="flex items-center mr-2 border-r pr-4 border-gray-200">
           <button 
             onClick={onImport}
             className="p-2 text-gray-500 hover:text-douban-green hover:bg-green-50 rounded-full transition-colors flex flex-col items-center group"
             title="导入数据备份"
           >
             <Upload size={18} />
           </button>
           <button 
             onClick={onExport}
             className="p-2 text-gray-500 hover:text-douban-green hover:bg-green-50 rounded-full transition-colors flex flex-col items-center group"
             title="导出数据备份"
           >
             <Download size={18} />
           </button>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('category')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'category' ? 'bg-white shadow text-douban-green' : 'text-gray-500 hover:text-gray-700'}`}
            title="按分类查看"
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('status')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'status' ? 'bg-white shadow text-douban-green' : 'text-gray-500 hover:text-gray-700'}`}
            title="按状态查看"
          >
            <List size={18} />
          </button>
        </div>
        <Button onClick={onAddClick} size="sm" className="hidden sm:flex">
          <Plus size={16} className="mr-1" /> 新增书籍
        </Button>
        <button onClick={onAddClick} className="sm:hidden p-2 bg-douban-green text-white rounded-full shadow-lg">
          <Plus size={20} />
        </button>
      </div>
    </div>
  </header>
);

// --- Book Card Component ---
const BookCard = ({ book, onClick, onEdit }: { book: Book, onClick: () => void, onEdit: (e: React.MouseEvent) => void }) => (
  <div 
    className="group relative flex flex-col w-full bg-white rounded shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
    onClick={onClick}
  >
    <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
       <img 
         src={book.coverUrl} 
         alt={book.title} 
         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
         loading="lazy"
       />
       <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[book.status]}`}>
         {STATUS_LABELS[book.status]}
       </div>
    </div>
    
    <div className="p-3 flex flex-col flex-1">
      <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={book.title}>{book.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{book.author}</p>
      
      <div className="mt-auto flex items-center justify-between">
         <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 truncate max-w-[80px]">
           {book.category}
         </span>
         <button 
           onClick={onEdit}
           className="p-1.5 text-gray-400 hover:text-douban-green hover:bg-green-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
           title="快速修改"
         >
           <Edit size={14} />
         </button>
      </div>
    </div>
  </div>
);

// --- Section Component ---
const BookSection = ({ title, books, onBookClick, onBookEdit }: { title: string, books: Book[], onBookClick: (b: Book) => void, onBookEdit: (b: Book, e: React.MouseEvent) => void }) => {
  if (books.length === 0) return null;
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-xl text-douban-text font-medium flex items-center gap-2">
          {title} 
          <span className="text-sm text-gray-400 font-normal">({books.length})</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {books.map(book => (
          <BookCard 
            key={book.id} 
            book={book} 
            onClick={() => onBookClick(book)}
            onEdit={(e) => onBookEdit(book, e)}
          />
        ))}
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  // State
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('my_reading_corner_books');
    const loadedBooks = saved ? JSON.parse(saved) : INITIAL_BOOKS;

    // Migration logic for old string-based excerpts
    return loadedBooks.map((b: any) => {
      // If excerpts is a string (old format), convert to array of one excerpt
      if (typeof b.excerpts === 'string' && b.excerpts.length > 0) {
        return {
          ...b,
          excerpts: [{
            id: `legacy-${b.id}`,
            text: b.excerpts,
            date: b.addedAt
          }]
        };
      } 
      // If excerpts is missing or empty string, ensure empty array
      else if (!b.excerpts || (typeof b.excerpts === 'string' && b.excerpts === '')) {
         return { ...b, excerpts: [] };
      }
      // If already array, keep it
      return b;
    });
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // File Import Ref
  const fileImportRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('my_reading_corner_books', JSON.stringify(books));
  }, [books]);

  // Handlers
  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };
  
  const handleBookEdit = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger card click
    setSelectedBook(book);
    setIsDetailModalOpen(true); // Re-use detail modal which has edit capabilities
  };

  // --- Export / Import Handlers ---
  const handleExportData = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-books-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileImportRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          if (confirm(`准备导入 ${json.length} 本书籍。这将覆盖当前数据（建议先导出备份）。确定继续吗？`)) {
            setBooks(json);
            alert("数据导入成功！");
          }
        } else {
          alert("文件格式不正确，必须是书籍数组 JSON。");
        }
      } catch (err) {
        alert("无法解析文件，请确保选择了正确的 JSON 备份文件。");
        console.error(err);
      }
      // Reset input
      if (fileImportRef.current) fileImportRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Filter Logic
  const filteredBooks = useMemo(() => {
    const lowerQ = searchQuery.toLowerCase();
    return books.filter(b => 
      b.title.toLowerCase().includes(lowerQ) || 
      b.author.toLowerCase().includes(lowerQ) ||
      b.tags.some(t => t.toLowerCase().includes(lowerQ))
    );
  }, [books, searchQuery]);

  // Grouping Logic
  const groupedBooks = useMemo(() => {
    if (viewMode === 'status') {
      const groups: Record<string, Book[]> = {
        reading: [],
        planned: [],
        completed: []
      };
      filteredBooks.forEach(b => {
        if (groups[b.status]) groups[b.status].push(b);
      });
      return [
        { title: '正在阅读', data: groups.reading },
        { title: '计划阅读', data: groups.planned },
        { title: '完成阅读', data: groups.completed },
      ];
    } else {
      // Category mode
      const groups: Record<string, Book[]> = {};
      CATEGORIES.forEach(c => groups[c] = []);
      groups['其他'] = []; // Ensure other exists

      filteredBooks.forEach(b => {
        // If category matches one of our enums, put it there, else '其他'
        const catKey = CATEGORIES.includes(b.category as Category) ? b.category : '其他';
        if (!groups[catKey]) groups[catKey] = [];
        groups[catKey].push(b);
      });

      return Object.entries(groups)
        .filter(([_, list]) => list.length > 0)
        .map(([title, data]) => ({ title, data }));
    }
  }, [filteredBooks, viewMode]);

  return (
    <div className="min-h-screen pb-20">
      <Header 
        onSearch={setSearchQuery} 
        onAddClick={() => setIsAddModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExport={handleExportData}
        onImport={handleImportClick}
      />
      
      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileImportRef}
        onChange={handleFileImport}
        className="hidden"
        accept=".json"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats / Welcome */}
        {!searchQuery && (
           <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-douban-green">
                <span className="text-gray-500 text-xs uppercase">总藏书</span>
                <p className="text-2xl font-bold text-gray-800">{books.length}</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-400">
                 <span className="text-gray-500 text-xs uppercase">已读完</span>
                 <p className="text-2xl font-bold text-gray-800">{books.filter(b => b.status === 'completed').length}</p>
              </div>
           </div>
        )}

        {/* Book Grid Sections */}
        {groupedBooks.length > 0 ? (
          groupedBooks.map(group => (
            <BookSection 
              key={group.title} 
              title={group.title} 
              books={group.data} 
              onBookClick={handleBookClick}
              onBookEdit={handleBookEdit}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">没有找到相关书籍</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddModalOpen(true)}>
              添加一本新书
            </Button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddBook={handleAddBook} 
      />

      <BookDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        book={selectedBook}
        onUpdate={handleUpdateBook}
        onDelete={handleDeleteBook}
      />
    </div>
  );
}