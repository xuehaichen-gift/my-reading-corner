import React, { useState, useEffect, useRef } from 'react';
import { Book, Category, ReadingStatus, Excerpt } from './types';
import { Modal } from './Modal';
import { Button } from './Button';
import { STATUS_LABELS, CATEGORIES } from './constants';
import { Save, Trash2, Tag, Image as ImageIcon, X } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBook: Book) => void;
  onDelete: (bookId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, isOpen, onClose, onUpdate, onDelete 
}) => {
  const [formData, setFormData] = useState<Book | null>(null);
  const [newTag, setNewTag] = useState('');
  
  // State for new excerpt
  const [newExcerptText, setNewExcerptText] = useState('');
  const [newExcerptImage, setNewExcerptImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(book);
    // Reset excerpt form
    setNewExcerptText('');
    setNewExcerptImage(null);
  }, [book, isOpen]);

  if (!book || !formData) return null;

  const handleChange = (field: keyof Book, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(t => t !== tagToRemove));
  };

  // Excerpt Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewExcerptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExcerpt = () => {
    if (!newExcerptText.trim() && !newExcerptImage) return;
    
    const newExcerpt: Excerpt = {
      id: crypto.randomUUID(),
      text: newExcerptText,
      image: newExcerptImage || undefined,
      date: Date.now()
    };

    const currentExcerpts = formData.excerpts || [];
    handleChange('excerpts', [...currentExcerpts, newExcerpt]);
    
    // Reset inputs
    setNewExcerptText('');
    setNewExcerptImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateExcerptText = (id: string, text: string) => {
    const currentExcerpts = formData.excerpts || [];
    handleChange('excerpts', currentExcerpts.map(e => e.id === id ? { ...e, text } : e));
  };

  const handleRemoveExcerpt = (id: string) => {
    const currentExcerpts = formData.excerpts || [];
    handleChange('excerpts', currentExcerpts.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (formData) {
      onUpdate(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm('确定要删除这本书吗？')) {
      onDelete(book.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="书籍详情 & 笔记" maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Metadata */}
        <div className="md:col-span-4 space-y-4">
          <div className="relative aspect-[2/3] w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <img 
              src={formData.coverUrl} 
              alt={formData.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">书名</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-douban-green focus:border-douban-green"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">作者</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full p-2 border rounded text-sm text-douban-green font-medium cursor-pointer hover:underline"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">阅读状态</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as ReadingStatus)}
                className="w-full p-2 border rounded text-sm bg-white"
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">分类</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-2 border rounded text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">标签</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-douban-green text-xs">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="添加标签..."
                  className="flex-1 p-1 text-xs border rounded"
                />
                <Button size="sm" variant="secondary" onClick={handleAddTag}>+</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content & Notes */}
        <div className="md:col-span-8 space-y-6">
          
          <div>
             <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">作者简介 / 书籍简介</h3>
             <textarea
                value={formData.intro || ''}
                onChange={(e) => handleChange('intro', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors focus:ring-1 focus:ring-douban-green outline-none resize-y"
                placeholder="暂无简介..."
             />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">核心观点</h3>
            <textarea
              value={formData.coreViews || ''}
              onChange={(e) => handleChange('coreViews', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-douban-green outline-none resize-y"
              placeholder="这本书主要讲了什么..."
            />
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">重要段落摘抄</h3>
            
            <div className="space-y-4">
              {/* List of existing excerpts */}
              {(formData.excerpts || []).map((excerpt) => (
                <div key={excerpt.id} className="relative group bg-yellow-50/40 p-4 rounded-lg border border-yellow-100/50 hover:border-yellow-200 transition-colors">
                  <button 
                    onClick={() => handleRemoveExcerpt(excerpt.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                  
                  <textarea
                    value={excerpt.text}
                    onChange={(e) => handleUpdateExcerptText(excerpt.id, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-serif text-gray-800 leading-relaxed resize-none outline-none"
                    rows={excerpt.text.split('\n').length + 1}
                    placeholder="输入摘抄..."
                  />
                  
                  {excerpt.image && (
                    <div className="mt-2">
                      <img 
                        src={excerpt.image} 
                        alt="Excerpt" 
                        className="max-h-64 rounded-md shadow-sm border border-gray-100 object-contain" 
                      />
                    </div>
                  )}
                  
                  <div className="mt-2 text-[10px] text-gray-400">
                    {new Date(excerpt.date).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Add New Excerpt Form */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 focus-within:ring-1 focus-within:ring-douban-green focus-within:bg-white transition-colors">
                 <textarea
                   value={newExcerptText}
                   onChange={e => setNewExcerptText(e.target.value)}
                   placeholder="添加一段新的摘抄..."
                   className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm min-h-[60px] resize-none outline-none font-serif"
                 />
                 
                 {newExcerptImage && (
                   <div className="relative inline-block mt-2">
                     <img src={newExcerptImage} className="h-24 w-auto rounded border border-gray-200" />
                     <button 
                       onClick={() => setNewExcerptImage(null)}
                       className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 hover:bg-black"
                     >
                       <X size={12} />
                     </button>
                   </div>
                 )}

                 <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                   <div className="flex gap-2">
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="p-1.5 text-gray-500 hover:text-douban-green hover:bg-green-50 rounded transition-colors"
                       title="上传图片"
                     >
                       <ImageIcon size={18} />
                     </button>
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                     />
                   </div>
                   <Button size="sm" onClick={handleAddExcerpt} disabled={!newExcerptText && !newExcerptImage}>
                     添加摘抄
                   </Button>
                 </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">我的感想</h3>
            <textarea
              value={formData.thoughts || ''}
              onChange={(e) => handleChange('thoughts', e.target.value)}
              rows={5}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-douban-green outline-none resize-y"
              placeholder="读完这本书，你有什么想法？"
            />
          </div>

          <div className="flex justify-between pt-4 border-t mt-4">
             <Button variant="danger" onClick={handleDelete} className="flex items-center gap-1">
                <Trash2 size={16}/> 删除
             </Button>
             <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>取消</Button>
                <Button variant="primary" onClick={handleSave} className="flex items-center gap-1">
                  <Save size={16}/> 保存笔记
                </Button>
             </div>
          </div>

        </div>
      </div>
    </Modal>
  );
};
