import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, Check } from 'lucide-react';
import { imageUploadService, UploadedImage } from '../../utils/imageUploadService';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  category: 'doctor' | 'customer' | 'news' | 'product';
  currentImage?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  category,
  currentImage
}) => {
  const [images, setImages] = useState<UploadedImage[]>(imageUploadService.getImages(category));
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedImage = await imageUploadService.uploadImage(file, category);
      const updatedImages = imageUploadService.getImages(category);
      setImages(updatedImages);
      setSelectedImage(uploadedImage.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = (imageId: string) => {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      imageUploadService.deleteImage(imageId);
      const updatedImages = imageUploadService.getImages(category);
      setImages(updatedImages);
      
      // Se a imagem excluída estava selecionada, limpa a seleção
      const deletedImage = images.find(img => img.id === imageId);
      if (deletedImage && selectedImage === deletedImage.url) {
        setSelectedImage('');
      }
    }
  };

  const handleSelectImage = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            Gerenciar Imagens - {category === 'doctor' ? 'Médicos' : category}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6 border-b border-slate-700">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors disabled:opacity-50"
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300 text-lg font-medium mb-2">
              {isUploading ? 'Fazendo upload...' : 'Clique para fazer upload'}
            </p>
            <p className="text-slate-500 text-sm">
              JPEG, PNG, GIF ou WebP (máx. 5MB)
            </p>
          </button>
        </div>

        {/* Images Grid */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhuma imagem encontrada</p>
              <p className="text-slate-500 text-sm mt-1">Faça upload da primeira imagem</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.url
                      ? 'border-blue-500 ring-2 ring-blue-500/50'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedImage === image.url && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/75 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate">{image.name}</p>
                    <p className="text-slate-300 text-xs">{formatFileSize(image.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSelectImage}
            disabled={!selectedImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            Selecionar Imagem
          </button>
        </div>
      </div>
    </div>
  );
};