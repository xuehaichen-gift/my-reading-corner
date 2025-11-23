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
    
