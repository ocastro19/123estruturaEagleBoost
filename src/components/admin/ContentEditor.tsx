import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, RotateCcw, Edit3, Plus, Trash2, Palette, Image } from 'lucide-react';
import { contentManager, SiteContent } from '../../utils/contentManager';
import { ImageUploadModal } from './ImageUploadModal';

export const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(contentManager.getContent());
  const [tempContent, setTempContent] = useState<SiteContent>(contentManager.getContent());
  const [activeSection, setActiveSection] = useState<string>('topBanner');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    category: 'doctor' | 'customer' | 'news' | 'product';
    onSelect: (url: string) => void;
    currentImage?: string;
  }>({
    isOpen: false,
    category: 'doctor',
    onSelect: () => {},
    currentImage: ''
  });
  const [customColor, setCustomColor] = useState<string>('#BE1D1E');

  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      const newContent = event.detail;
      setContent(newContent);
      setTempContent(newContent);
      setHasChanges(false);
    };

    window.addEventListener('contentUpdated', handleContentUpdate as EventListener);
    return () => window.removeEventListener('contentUpdated', handleContentUpdate as EventListener);
  }, []);

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newTempContent = { ...tempContent };
    let current: any = newTempContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTempContent(newTempContent);
    setHasChanges(true);
    
    // Não salvar automaticamente - apenas atualizar estado temporário
  };

  const handleArrayChange = (path: string, index: number, field: string, value: any) => {
    console.log('🔄 Admin: Array change detected:', { path, index, field, valueType: typeof value, valueLength: value?.length });
    
    // Log específico para mudanças em médicos
    if (path === 'doctors.doctors' && field === 'photo') {
      console.log('📸 Admin: Doctor photo change:', {
        doctorIndex: index,
        photoUrl: value ? value.substring(0, 100) + '...' : 'No photo',
        hasValue: !!value
      });
    }
    
    const keys = path.split('.');
    const newTempContent = { ...tempContent };
    let current: any = newTempContent;
    
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        current[keys[i]][index][field] = value;
      } else {
        current = current[keys[i]];
      }
    }
    
    setTempContent(newTempContent);
    setHasChanges(true);
    
    console.log('✅ Admin: Array updated successfully');
  };

  const addArrayItem = (path: string, template: any) => {
    try {
      const keys = path.split('.');
      const newTempContent = { ...tempContent };
      let current: any = newTempContent;
      
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          // Garantir que o array existe
          if (!Array.isArray(current[keys[i]])) {
            current[keys[i]] = [];
          }
          
          // Gerar ID único e seguro
          const existingIds = current[keys[i]].map((item: any) => item.id || 0);
          const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
          
          // Adicionar novo item
          const newItem = { ...template, id: newId };
          current[keys[i]].push(newItem);
          
          console.log(`✅ Item adicionado com sucesso. Total de itens: ${current[keys[i]].length}`);
        } else {
          current = current[keys[i]];
        }
      }
      
      setTempContent(newTempContent);
      setHasChanges(true);
    } catch (error) {
      console.error('❌ Erro ao adicionar item:', error);
      alert('Erro ao adicionar item. Tente novamente.');
    }
  };

  const removeArrayItem = (path: string, index: number) => {
    try {
      const keys = path.split('.');
      const newTempContent = { ...tempContent };
      let current: any = newTempContent;
      
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          // Verificar se o índice é válido
          if (index >= 0 && index < current[keys[i]].length) {
            current[keys[i]].splice(index, 1);
            console.log(`✅ Item removido com sucesso. Total de itens restantes: ${current[keys[i]].length}`);
          } else {
            console.warn('⚠️ Índice inválido para remoção:', index);
            return;
          }
        } else {
          current = current[keys[i]];
        }
      }
      
      setTempContent(newTempContent);
      setHasChanges(true);
    } catch (error) {
      console.error('❌ Erro ao remover item:', error);
      alert('Erro ao remover item. Tente novamente.');
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      console.log('💾 Admin: Saving content with title:', tempContent.topBanner.title);
      
      // Log específico para médicos
      if (tempContent.doctors && tempContent.doctors.doctors) {
        console.log('👨‍⚕️ Admin: Saving doctors section with', tempContent.doctors.doctors.length, 'doctors');
        tempContent.doctors.doctors.forEach((doctor, index) => {
          console.log(`👨‍⚕️ Doctor ${index + 1}:`, {
            name: doctor.name,
            photo: doctor.photo ? doctor.photo.substring(0, 50) + '...' : 'No photo',
            hasPhoto: !!doctor.photo
          });
        });
      }
      
      contentManager.updateContent(tempContent);
      
      // Atualizar o conteúdo principal com as alterações salvas
      setContent(tempContent);
      
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      console.log('✅ Admin: Content saved successfully');
    } catch (error) {
      console.error('❌ Admin: Error saving content:', error);
      const errorObj = error as Error;
      
      // Log detalhado do erro
      console.error('❌ Admin: Error details:', {
        message: errorObj.message,
        stack: errorObj.stack,
        name: errorObj.name
      });
      
      // Verificar se é erro de quota do localStorage
      if (errorObj.name === 'QuotaExceededError' || errorObj.message.includes('quota')) {
        console.error('💾 Admin: localStorage quota exceeded!');
        
        // Tentar limpeza automática e salvar novamente
        try {
          console.log('🧹 Admin: Attempting automatic cleanup...');
          
          // Limpar dados temporários
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('temp_') || key.includes('backup_') || key.includes('old_'))) {
              keysToRemove.push(key);
            }
          }
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log('🗑️ Admin: Removed:', key);
          });
          
          // Tentar salvar novamente após limpeza
          console.log('🔄 Admin: Retrying save after cleanup...');
          contentManager.updateContent(tempContent);
          
          setContent(tempContent);
          setSaveStatus('saved');
          setHasChanges(false);
          setTimeout(() => setSaveStatus('idle'), 2000);
          
          console.log('✅ Admin: Content saved successfully after cleanup');
          return;
          
        } catch (retryError) {
          console.error('❌ Admin: Failed to save even after cleanup:', retryError);
          alert('Erro: Não foi possível salvar. O armazenamento local está cheio. Tente exportar seus dados e recarregar a página.');
        }
      }
      
      // Para outros tipos de erro
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // Mostrar erro específico para o usuário
      if (errorObj.message.includes('médicos') || errorObj.message.includes('doctors')) {
        alert('Erro ao salvar médicos: ' + errorObj.message);
      } else {
        alert('Erro ao salvar: ' + errorObj.message);
      }
    }
  };

  const handleExport = () => {
    const dataStr = contentManager.exportContent();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site_content_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (contentManager.importContent(content)) {
          const newContent = contentManager.getContent();
          setContent(newContent);
          setTempContent(newContent);
          setHasChanges(false);
          alert('Conteúdo importado com sucesso!');
        } else {
          alert('Erro ao importar conteúdo. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetar = () => {
    if (confirm('Tem certeza que deseja resetar todo o conteúdo para o padrão?')) {
      contentManager.resetToDefault();
      const newContent = contentManager.getContent();
      setContent(newContent);
      setTempContent(newContent);
      setHasChanges(false);
    }
  };

  const handleDiscardChanges = () => {
    if (confirm('Tem certeza que deseja descartar todas as alterações não salvas?')) {
      setTempContent(content);
      setHasChanges(false);
    }
  };

  const sections = [
    { id: 'topBanner', name: 'Top Banner', icon: '🎯' },
    { id: 'video', name: 'Vídeo', icon: '🎥' },
    { id: 'contentBlocker', name: 'Bloqueio de Conteúdo', icon: '🔒' },
    { id: 'titleBlocks', name: 'Blocos de Título', icon: '📝' },
    { id: 'customCTAs', name: 'CTAs Personalizados', icon: '🔘' },
    { id: 'globalBackground', name: 'Background Global', icon: '🎨' },
    { id: 'mainOffer', name: 'Oferta Principal', icon: '💊' },
    { id: 'alternativeOffers', name: 'Ofertas Alternativas', icon: '📦' },
    { id: 'doctors', name: 'Médicos', icon: '👨‍⚕️' },
    { id: 'testimonials', name: 'Depoimentos', icon: '💬' },
    { id: 'news', name: 'Notícias', icon: '📰' },
    { id: 'guarantee', name: 'Garantia', icon: '🛡️' },
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'footer', name: 'Rodapé', icon: '📄' }
  ];

  const renderInput = (label: string, path: string, type: 'text' | 'textarea' | 'url' = 'text') => {
    const keys = path.split('.');
    let value: any = tempContent;
    for (const key of keys) {
      value = value[key];
    }

    // Handle number inputs for timer fields
    const isNumberField = path.includes('unlockTime');
    const inputType = isNumberField ? 'number' : type;
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        {type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(path, isNumberField ? parseInt(e.target.value) || 0 : e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[80px]"
            rows={3}
          />
        ) : (
          <input
            type={inputType}
            value={value || ''}
            onChange={(e) => handleInputChange(path, isNumberField ? parseInt(e.target.value) || 0 : e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
            placeholder={isNumberField ? "0" : ""}
          />
        )}
      </div>
    );
  };

  const renderColorSelect = (label: string, path: string, options: Array<{value: string, label: string}>) => {
    const keys = path.split('.');
    let value: any = tempContent;
    for (const key of keys) {
      value = value[key];
    }

    const pickerId = `${path}-color-picker`;
    const isCustomColor = !options.some(opt => opt.value === value);

    // Função para determinar o prefixo correto baseado no tipo de cor
    const getColorPrefix = (colorValue: string) => {
      if (path.includes('buttonColor') || path.includes('background')) {
        // Para cores hexadecimais, aplicar bg-[]
        if (colorValue.startsWith('#')) {
          return `bg-[${colorValue}]`;
        }
        // Para gradientes ou classes Tailwind existentes, retornar como está
        if (colorValue.includes('gradient') || colorValue.startsWith('bg-') || colorValue.startsWith('from-')) {
          return colorValue;
        }
        // Para outras cores, adicionar prefixo bg-
        return `bg-${colorValue}`;
      } else {
        return colorValue.startsWith('#') ? `text-[${colorValue}]` : colorValue;
      }
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        <div className="flex gap-2">
          <select
            value={isCustomColor ? 'custom' : value}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setColorPickerOpen(pickerId);
              } else {
                handleInputChange(path, e.target.value);
              }
            }}
            className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            <option value="custom">🎨 Cor Personalizada</option>
          </select>
          
          <button
            onClick={() => setColorPickerOpen(colorPickerOpen === pickerId ? null : pickerId)}
            className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg hover:bg-slate-500 text-white flex items-center gap-1"
            title="Seletor de Cor"
          >
            <Palette size={16} />
          </button>
        </div>
        
        {colorPickerOpen === pickerId && (
          <div className="mt-2 p-3 bg-slate-600 rounded-lg border border-slate-500">
            <h6 className="text-sm font-medium text-slate-300 mb-3">Cores Sólidas</h6>
            <div className="grid grid-cols-8 gap-2 mb-4">
              {[
                '#BE1D1E', '#DC2626', '#EF4444', '#F87171',
                '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA',
                '#059669', '#10B981', '#34D399', '#6EE7B7',
                '#7C2D12', '#EA580C', '#F97316', '#FB923C',
                '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
                '#DB2777', '#EC4899', '#F472B6', '#F9A8D4',
                '#374151', '#4B5563', '#6B7280', '#9CA3AF',
                '#000000', '#1F2937', '#FFFFFF', '#F3F4F6'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    const tailwindColor = getColorPrefix(color);
                    handleInputChange(path, tailwindColor);
                    setColorPickerOpen(null);
                  }}
                  className="w-8 h-8 rounded border-2 border-slate-400 hover:border-white transition-colors"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            <h6 className="text-sm font-medium text-slate-300 mb-3">Gradientes</h6>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { name: 'Sunset', class: 'bg-gradient-to-r from-orange-400 to-red-500' },
                { name: 'Ocean', class: 'bg-gradient-to-r from-blue-400 to-blue-600' },
                { name: 'Forest', class: 'bg-gradient-to-r from-green-400 to-green-600' },
                { name: 'Purple', class: 'bg-gradient-to-r from-purple-400 to-purple-600' },
                { name: 'Pink', class: 'bg-gradient-to-r from-pink-400 to-pink-600' },
                { name: 'Teal', class: 'bg-gradient-to-r from-teal-400 to-teal-600' },
                { name: 'Indigo', class: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
                { name: 'Gray', class: 'bg-gradient-to-r from-gray-400 to-gray-600' },
                { name: 'Fire', class: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' },
                { name: 'Sky', class: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600' },
                { name: 'Emerald', class: 'bg-gradient-to-r from-emerald-400 to-cyan-400' },
                { name: 'Rose', class: 'bg-gradient-to-r from-rose-400 to-pink-400' }
              ].map((gradient) => (
                <button
                  key={gradient.name}
                  onClick={() => {
                    handleInputChange(path, gradient.class);
                    setColorPickerOpen(null);
                  }}
                  className={`h-12 rounded border-2 border-slate-400 hover:border-white transition-colors ${gradient.class}`}
                  title={gradient.name}
                />
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setColorPickerOpen(null)}
                className="px-3 py-1 bg-slate-500 text-white rounded text-sm hover:bg-slate-400"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
        
        {isCustomColor && (
          <p className="text-xs text-slate-400 mt-1">Cor personalizada: {value}</p>
        )}
      </div>
    );
  };

  const renderArrayEditor = (title: string, path: string, items: any[], template: any, fields: Array<{key: string, label: string, type?: string}>) => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'itens'} • Sem limite de quantidade
            </p>
          </div>
          <button
            onClick={() => addArrayItem(path, template)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar {title.slice(0, -1)}
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-slate-700 rounded-lg p-6 text-center">
            <p className="text-slate-400 mb-2">Nenhum item adicionado ainda</p>
            <p className="text-slate-500 text-sm">Clique em "Adicionar" para começar • Sem limite de quantidade</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id || index} className="bg-slate-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Item {index + 1} de {items.length}</span>
                <button
                  onClick={() => removeArrayItem(path, index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            
              {fields.map(field => (
                <div key={field.key} className="mb-3">
                  <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.key] || ''}
                      onChange={(e) => handleArrayChange(path, index, field.key, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[60px]"
                      rows={2}
                    />
                  ) : field.type === 'image' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item[field.key] || ''}
                        onChange={(e) => handleArrayChange(path, index, field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                        placeholder="URL da imagem ou selecione da galeria"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setImageModal({
                            isOpen: true,
                            category: 'doctor',
                            currentImage: item[field.key] || '',
                            onSelect: (url: string) => {
                              handleArrayChange(path, index, field.key, url);
                              setImageModal(prev => ({ ...prev, isOpen: false }));
                            }
                          })}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Image className="w-4 h-4" />
                          Galeria
                        </button>
                        {item[field.key] && (
                          <div className="flex-1">
                            <img 
                              src={item[field.key]} 
                              alt="Preview" 
                              className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={item[field.key] || ''}
                      onChange={(e) => handleArrayChange(path, index, field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'topBanner':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Top Banner</h3>
            {renderInput('Título', 'topBanner.title')}
            {renderInput('Subtítulo', 'topBanner.subtitle', 'textarea')}
            {renderInput('Texto do Botão', 'topBanner.buttonText')}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                {renderColorSelect(
                  'Cor do Título',
                  'topBanner.titleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo',
                  'topBanner.subtitleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Botão',
                  'topBanner.buttonColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Configurações do Vídeo</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Código Embed da VTURB
              </label>
              <textarea
                value={tempContent.video.embedCode || ''}
                onChange={(e) => handleInputChange('video.embedCode', e.target.value)}
                placeholder='Cole aqui o código embed da VTURB, exemplo:
<vturb-smartplayer id="vid-68c1baf2d111494b6113b2dc" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>
<script type="text/javascript">
var s=document.createElement("script");
s.src="https://scripts.converteai.net/d37be28a-dfe1-4a86-98a2-9c82944967ec/players/68c1baf2d111494b6113b2dc/v4/player.js";
s.async=!0,document.head.appendChild(s);
</script>'
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[120px] font-mono text-sm"
                rows={6}
              />
              <p className="text-slate-400 text-xs mt-2">
                💡 Dica: Copie o código embed completo da VTURB e cole aqui. O vídeo aparecerá automaticamente na página principal.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Proporção do Vídeo
              </label>
              <select
                value={tempContent.video.aspectRatio}
                onChange={(e) => handleInputChange('video.aspectRatio', e.target.value as '16:9' | '9:16')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              >
                <option value="9:16">9:16 (Vertical - Mobile)</option>
                <option value="16:9">16:9 (Horizontal - Desktop)</option>
              </select>
              <p className="text-slate-400 text-xs mt-2">
                💡 Escolha a proporção que melhor se adapta ao seu vídeo. 9:16 é ideal para vídeos verticais (mobile), 16:9 para vídeos horizontais (desktop).
              </p>
            </div>
            
            {renderInput('Aviso de Som', 'video.soundWarning')}
            {renderInput('Aviso de Urgência', 'video.urgencyWarning', 'textarea')}
          </div>
        );

      case 'contentBlocker':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Bloqueio de Conteúdo</h3>
            <p className="text-slate-400 mb-6">
              Configure o sistema de bloqueio que esconde o conteúdo por um tempo determinado após o vídeo.
            </p>
            
            <div className="mb-4">
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={tempContent.contentBlocker.enabled}
                  onChange={(e) => handleInputChange('contentBlocker.enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Ativar bloqueio de conteúdo</span>
              </label>
            </div>
            
            {tempContent.contentBlocker.enabled && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timer
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Minutos</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        step="1"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="0"
                        value={Math.floor(content.contentBlocker.unlockTimeMinutes)}
                        onChange={(e) => {
                          const minutes = parseInt(e.target.value) || 0;
                          const seconds = Math.floor((content.contentBlocker.unlockTimeMinutes % 1) * 60);
                          handleInputChange('contentBlocker.unlockTimeMinutes', minutes + (seconds / 60));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Segundos</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        step="1"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="0"
                        value={Math.floor((content.contentBlocker.unlockTimeMinutes % 1) * 60)}
                        onChange={(e) => {
                          const seconds = parseInt(e.target.value) || 0;
                          const minutes = Math.floor(content.contentBlocker.unlockTimeMinutes);
                          handleInputChange('contentBlocker.unlockTimeMinutes', minutes + (seconds / 60));
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4 mt-4">
                  <h4 className="text-white font-medium mb-2">ℹ️ Como funciona:</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Defina quantos minutos o conteúdo ficará oculto</li>
                    <li>• Após o tempo, o conteúdo aparece automaticamente</li>
                    <li>• Usuário vê apenas o vídeo, sem saber do bloqueio</li>
                    <li>• Sistema completamente invisível</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );

      case 'titleBlocks':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Blocos de Título</h3>
            <p className="text-slate-400 mb-6">
              Configure os títulos e subtítulos dos blocos principais da página.
            </p>
            
            <h4 className="text-lg font-semibold text-white mb-4">TITULO 0 - Principal</h4>
            {renderInput('Título', 'titleBlocks.clinicallyReviewed.title')}
            {renderInput('Subtítulo', 'titleBlocks.clinicallyReviewed.subtitle')}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                {renderColorSelect(
                  'Cor do Título',
                  'titleBlocks.clinicallyReviewed.titleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo',
                  'titleBlocks.clinicallyReviewed.subtitleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-4 mt-6">TITULO 1</h4>
            {renderInput('Título', 'titleBlocks.noFilters.title')}
            {renderInput('Subtítulo', 'titleBlocks.noFilters.subtitle')}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                {renderColorSelect(
                  'Cor do Título',
                  'titleBlocks.noFilters.titleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo',
                  'titleBlocks.noFilters.subtitleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-4 mt-6">TITULO 2</h4>
            {renderInput('Título', 'titleBlocks.newsOutlets.title')}
            {renderInput('Subtítulo', 'titleBlocks.newsOutlets.subtitle')}
            {renderInput('Instrução de Navegação', 'titleBlocks.newsOutlets.dragInstruction')}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                {renderColorSelect(
                  'Cor do Título',
                  'titleBlocks.newsOutlets.titleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo',
                  'titleBlocks.newsOutlets.subtitleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-4 mt-6">TITULO 3</h4>
            {renderInput('Título', 'titleBlocks.transformLife.title')}
            {renderInput('Subtítulo 1', 'titleBlocks.transformLife.subtitle1')}
            {renderInput('Subtítulo 2', 'titleBlocks.transformLife.subtitle2')}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                {renderColorSelect(
                  'Cor do Título',
                  'titleBlocks.transformLife.titleColor',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo 1',
                  'titleBlocks.transformLife.subtitle1Color',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
              
              <div>
                {renderColorSelect(
                  'Cor do Subtítulo 2',
                  'titleBlocks.transformLife.subtitle2Color',
                  content.globalTitleStyling.availableColors.map(color => ({ label: color.name, value: color.value }))
                )}
              </div>
            </div>
          </div>
        );

      case 'mainOffer':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Oferta Principal</h3>
            {renderInput('Nome do Produto', 'mainOffer.productName')}
            {renderInput('Nome do Pacote', 'mainOffer.packageName')}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Imagem do Produto</label>
              <input
                type="url"
                value={tempContent.mainOffer.productImage || ''}
                onChange={(e) => handleInputChange('mainOffer.productImage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="URL da imagem ou selecione da galeria"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setImageModal({
                    isOpen: true,
                    category: 'product',
                    currentImage: tempContent.mainOffer.productImage || '',
                    onSelect: (url: string) => {
                      handleInputChange('mainOffer.productImage', url);
                      setImageModal(prev => ({ ...prev, isOpen: false }));
                    }
                  })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Image className="w-4 h-4" />
                  Galeria
                </button>
                {tempContent.mainOffer.productImage && (
                  <div className="flex-1">
                    <img 
                      src={tempContent.mainOffer.productImage} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {renderInput('Economia', 'mainOffer.savings')}
            {renderInput('Texto do Botão', 'mainOffer.buttonText')}
            {renderInput('URL do Botão', 'mainOffer.buttonUrl', 'url')}
            {renderInput('Preço por Frasco', 'mainOffer.pricePerBottle')}
            {renderInput('Preço Total', 'mainOffer.totalPrice')}
            
            <h4 className="text-lg font-semibold text-white mb-4 mt-6">Badges</h4>
            {renderInput('Garantia', 'mainOffer.badges.guarantee')}
            {renderInput('Frete', 'mainOffer.badges.shipping')}
            {renderInput('Segurança', 'mainOffer.badges.security')}
          </div>
        );

      case 'alternativeOffers':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Ofertas Alternativas</h3>
            
            <h4 className="text-lg font-semibold text-white mb-4">Oferta 1</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Imagem do Produto</label>
              <input
                type="url"
                value={tempContent.alternativeOffers.offer1.productImage || ''}
                onChange={(e) => handleInputChange('alternativeOffers.offer1.productImage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="URL da imagem ou selecione da galeria"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setImageModal({
                    isOpen: true,
                    category: 'product',
                    currentImage: tempContent.alternativeOffers.offer1.productImage || '',
                    onSelect: (url: string) => {
                      handleInputChange('alternativeOffers.offer1.productImage', url);
                      setImageModal(prev => ({ ...prev, isOpen: false }));
                    }
                  })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Image className="w-4 h-4" />
                  Galeria
                </button>
                {tempContent.alternativeOffers.offer1.productImage && (
                  <div className="flex-1">
                    <img 
                      src={tempContent.alternativeOffers.offer1.productImage} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {renderInput('Nome do Produto', 'alternativeOffers.offer1.productName')}
            {renderInput('Nome do Pacote', 'alternativeOffers.offer1.packageName')}
            {renderInput('Economia', 'alternativeOffers.offer1.savings')}
            {renderInput('Preço por Frasco', 'alternativeOffers.offer1.pricePerBottle')}
            {renderInput('Preço Total', 'alternativeOffers.offer1.totalPrice')}
            {renderInput('Frete', 'alternativeOffers.offer1.shipping')}
            {renderInput('Garantia', 'alternativeOffers.offer1.guarantee')}
            {renderInput('Segurança', 'alternativeOffers.offer1.security')}
            {renderInput('URL do Botão', 'alternativeOffers.offer1.buttonUrl', 'url')}
            
            <h4 className="text-lg font-semibold text-white mb-4 mt-6">Oferta 2</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Imagem do Produto</label>
              <input
                type="url"
                value={tempContent.alternativeOffers.offer2.productImage || ''}
                onChange={(e) => handleInputChange('alternativeOffers.offer2.productImage', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                placeholder="URL da imagem ou selecione da galeria"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setImageModal({
                    isOpen: true,
                    category: 'product',
                    currentImage: tempContent.alternativeOffers.offer2.productImage || '',
                    onSelect: (url: string) => {
                      handleInputChange('alternativeOffers.offer2.productImage', url);
                      setImageModal(prev => ({ ...prev, isOpen: false }));
                    }
                  })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Image className="w-4 h-4" />
                  Galeria
                </button>
                {tempContent.alternativeOffers.offer2.productImage && (
                  <div className="flex-1">
                    <img 
                      src={tempContent.alternativeOffers.offer2.productImage} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {renderInput('Nome do Produto', 'alternativeOffers.offer2.productName')}
            {renderInput('Nome do Pacote', 'alternativeOffers.offer2.packageName')}
            {renderInput('Economia', 'alternativeOffers.offer2.savings')}
            {renderInput('Preço por Frasco', 'alternativeOffers.offer2.pricePerBottle')}
            {renderInput('Preço Total', 'alternativeOffers.offer2.totalPrice')}
            {renderInput('Frete', 'alternativeOffers.offer2.shipping')}
            {renderInput('Garantia', 'alternativeOffers.offer2.guarantee')}
            {renderInput('Segurança', 'alternativeOffers.offer2.security')}
            {renderInput('URL do Botão', 'alternativeOffers.offer2.buttonUrl', 'url')}
          </div>
        );

      case 'doctors':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Seção de Médicos</h3>
            {renderInput('Título', 'doctors.title')}
            {renderInput('Subtítulo', 'doctors.subtitle')}
            {renderInput('Instrução de Navegação', 'doctors.dragInstruction')}
            
            {renderArrayEditor(
              'Médicos',
              'doctors.doctors',
              tempContent.doctors.doctors,
              {
                name: '',
                title: '',
                institution: '',
                photo: '',
                recommendation: '',
                videoEmbed: ''
              },
              [
                { key: 'name', label: 'Nome' },
                { key: 'title', label: 'Título' },
                { key: 'institution', label: 'Instituição' },
                { key: 'photo', label: 'Foto', type: 'image' },
                { key: 'recommendation', label: 'Recomendação', type: 'textarea' },
                { key: 'videoEmbed', label: 'Embed do Vídeo VTURB', type: 'textarea' }
              ]
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Depoimentos</h3>
            {renderInput('Título', 'testimonials.title')}
            {renderInput('Subtítulo', 'testimonials.subtitle')}
            
            {renderArrayEditor(
              'Clientes',
              'testimonials.customers',
              tempContent.testimonials.customers,
              {
                name: '',
                location: '',
                photo: '',
                testimonial: '',
                rating: 5,
                videoEmbed: ''
              },
              [
          { key: 'name', label: 'Nome' },
          { key: 'location', label: 'Localização' },
          { key: 'photo', label: 'Foto', type: 'image' },
          { key: 'testimonial', label: 'Depoimento', type: 'textarea' },
          { key: 'rating', label: 'Avaliação (1-5)', type: 'number' },
          { key: 'videoEmbed', label: 'Embed do Vídeo VTURB', type: 'textarea' }
        ]
            )}
          </div>
        );

      case 'news':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Notícias</h3>
            {renderInput('Título', 'news.title')}
            {renderInput('Subtítulo', 'news.subtitle')}
            {renderInput('Instrução de Navegação', 'news.dragInstruction')}
            
            {renderArrayEditor(
              'Artigos',
              'news.articles',
              tempContent.news.articles,
              {
                outlet: '',
                logo: '',
                redirectUrl: '',
                title: '',
                description: '',
                videoEmbed: ''
              },
              [
                { key: 'outlet', label: 'Veículo' },
                { key: 'logo', label: 'Logo', type: 'image' },
                { key: 'redirectUrl', label: 'URL de Redirecionamento', type: 'url' },
                { key: 'title', label: 'Título', type: 'textarea' },
                { key: 'description', label: 'Descrição', type: 'textarea' },
                { key: 'videoEmbed', label: 'Embed do Vídeo VTURB', type: 'textarea' }
              ]
            )}
          </div>
        );

      case 'guarantee':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Garantia</h3>
            {renderInput('Dias de Garantia', 'guarantee.days')}
            {renderInput('Título', 'guarantee.title')}
            {renderInput('Subtítulo', 'guarantee.subtitle')}
            {renderInput('Nome da Marca', 'guarantee.brandName')}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Descrições</label>
              {tempContent.guarantee.description.map((desc, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <textarea
                    value={desc}
                    onChange={(e) => {
                      const newDescriptions = [...tempContent.guarantee.description];
                      newDescriptions[index] = e.target.value;
                      handleInputChange('guarantee.description', newDescriptions);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[60px]"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      const newDescriptions = tempContent.guarantee.description.filter((_, i) => i !== index);
                      handleInputChange('guarantee.description', newDescriptions);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newDescriptions = [...tempContent.guarantee.description, ''];
                  handleInputChange('guarantee.description', newDescriptions);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Parágrafo
              </button>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">FAQ</h3>
            {renderInput('Título', 'faq.title')}
            
            {renderArrayEditor(
              'Perguntas',
              'faq.items',
              tempContent.faq.items,
              {
                question: '',
                answer: '',
                hasBadge: false,
                badgeText: ''
              },
              [
                { key: 'question', label: 'Pergunta', type: 'textarea' },
                { key: 'answer', label: 'Resposta', type: 'textarea' },
                { key: 'badgeText', label: 'Texto do Badge (opcional)' }
              ]
            )}
          </div>
        );

      case 'customCTAs':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Botões CTA Personalizados</h3>
            
            {/* Configurações Globais */}
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Configurações Globais dos Botões</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cor Padrão de Fundo</label>
                  <select
                    value={tempContent.customCTAs.globalSettings.defaultBackgroundColor}
                    onChange={(e) => handleInputChange('customCTAs.globalSettings.defaultBackgroundColor', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                    {tempContent.customCTAs.globalSettings.availableColors.map((color) => (
                      <option key={color.name} value={color.background}>{color.name}</option>
                    ))}
                  </select>
                </div>
                
                {renderColorSelect('Cor Padrão do Texto', 'customCTAs.globalSettings.defaultTextColor', [
                  { value: 'text-white', label: 'Branco' },
                  { value: 'text-black', label: 'Preto' },
                  { value: 'text-gray-800', label: 'Cinza Escuro' },
                  { value: 'text-[#BE1D1E]', label: 'Vermelho Forte' }
                ])}
              </div>
              
              <button
                onClick={() => {
                  handleInputChange('customCTAs.doctorTrustCTA.backgroundColor', tempContent.customCTAs.globalSettings.defaultBackgroundColor);
              handleInputChange('customCTAs.doctorTrustCTA.textColor', tempContent.customCTAs.globalSettings.defaultTextColor);
              handleInputChange('customCTAs.successStoryCTA.backgroundColor', tempContent.customCTAs.globalSettings.defaultBackgroundColor);
              handleInputChange('customCTAs.successStoryCTA.textColor', tempContent.customCTAs.globalSettings.defaultTextColor);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Aplicar Cores Padrão a Todos os Botões
              </button>
            </div>
            
            {/* Doctor Trust CTA */}
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">CTA - Confiança dos Médicos</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempContent.customCTAs.doctorTrustCTA.enabled}
                    onChange={(e) => handleInputChange('customCTAs.doctorTrustCTA.enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Texto do Botão</label>
                  <textarea
                    value={tempContent.customCTAs.doctorTrustCTA.text}
                    onChange={(e) => handleInputChange('customCTAs.doctorTrustCTA.text', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[60px]"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ícone (Emoji)</label>
                  <input
                    type="text"
                    value={tempContent.customCTAs.doctorTrustCTA.icon}
                    onChange={(e) => handleInputChange('customCTAs.doctorTrustCTA.icon', e.target.value)}
                    placeholder="👨‍⚕️"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>
                
                {renderColorSelect('Cor de Fundo (Gradient)', 'customCTAs.doctorTrustCTA.backgroundColor', [
                  { value: 'from-blue-500 to-blue-600', label: 'Azul' },
                  { value: 'from-green-400 to-green-500', label: 'Verde' },
                  { value: 'from-[#BE1D1E] to-[#BE1D1E]', label: 'Vermelho' },
                  { value: 'from-purple-500 to-purple-600', label: 'Roxo' },
                  { value: 'from-orange-400 to-orange-500', label: 'Laranja' },
                  { value: 'from-yellow-400 to-yellow-500', label: 'Amarelo' },
                  { value: 'from-pink-500 to-pink-600', label: 'Rosa' },
                  { value: 'from-indigo-500 to-indigo-600', label: 'Índigo' }
                ])}
                
                {renderColorSelect('Cor do Texto', 'customCTAs.doctorTrustCTA.textColor', [
                  { value: 'text-white', label: 'Branco' },
                  { value: 'text-black', label: 'Preto' },
                  { value: 'text-gray-800', label: 'Cinza Escuro' },
                  { value: 'text-[#BE1D1E]', label: 'Vermelho Forte' }
                ])}
              </div>
              
              <div className="mt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-sm font-medium text-slate-300">Usar Animação Pulse</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempContent.customCTAs.doctorTrustCTA.usePulseAnimation}
                      onChange={(e) => handleInputChange('customCTAs.doctorTrustCTA.usePulseAnimation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
              

            </div>
            
            {/* Success Story CTA */}
            <div className="bg-slate-700 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">CTA - História de Sucesso</h4>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempContent.customCTAs.successStoryCTA.enabled}
                    onChange={(e) => handleInputChange('customCTAs.successStoryCTA.enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Texto do Botão</label>
                  <textarea
                    value={tempContent.customCTAs.successStoryCTA.text}
                    onChange={(e) => handleInputChange('customCTAs.successStoryCTA.text', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 resize-vertical min-h-[60px]"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ícone (Emoji)</label>
                  <input
                    type="text"
                    value={tempContent.customCTAs.successStoryCTA.icon}
                    onChange={(e) => handleInputChange('customCTAs.successStoryCTA.icon', e.target.value)}
                    placeholder="🚀"
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>
                
                {renderColorSelect('Cor de Fundo (Gradient)', 'customCTAs.successStoryCTA.backgroundColor', [
                  { value: 'from-blue-500 to-blue-600', label: 'Azul' },
                  { value: 'from-green-400 to-green-500', label: 'Verde' },
                  { value: 'from-[#BE1D1E] to-[#BE1D1E]', label: 'Vermelho' },
                  { value: 'from-purple-500 to-purple-600', label: 'Roxo' },
                  { value: 'from-orange-400 to-orange-500', label: 'Laranja' },
                  { value: 'from-yellow-400 to-yellow-500', label: 'Amarelo' },
                  { value: 'from-pink-500 to-pink-600', label: 'Rosa' },
                  { value: 'from-indigo-500 to-indigo-600', label: 'Índigo' }
                ])}
                
                {renderColorSelect('Cor do Texto', 'customCTAs.successStoryCTA.textColor', [
                  { value: 'text-white', label: 'Branco' },
                  { value: 'text-black', label: 'Preto' },
                  { value: 'text-gray-800', label: 'Cinza Escuro' },
                  { value: 'text-[#BE1D1E]', label: 'Vermelho Forte' }
                ])}
              </div>
              
              <div className="mt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="text-sm font-medium text-slate-300">Usar Animação Pulse</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempContent.customCTAs.successStoryCTA.usePulseAnimation}
                      onChange={(e) => handleInputChange('customCTAs.successStoryCTA.usePulseAnimation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
              

            </div>
            
            {/* Preview Section */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Visualização dos Botões</h4>
              <div className="space-y-4">
                {tempContent.customCTAs.doctorTrustCTA.enabled && (
                  <div className="max-w-sm mx-auto">
                    <button className={`w-full bg-gradient-to-r ${tempContent.customCTAs.doctorTrustCTA.backgroundColor} ${tempContent.customCTAs.doctorTrustCTA.textColor} font-bold text-lg py-5 px-6 rounded-2xl shadow-xl transition-all duration-300 ${tempContent.customCTAs.doctorTrustCTA.usePulseAnimation ? 'animate-pulse' : ''}`}>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{tempContent.customCTAs.doctorTrustCTA.icon}</span>
                        <span className="text-center leading-tight text-sm">
                          {tempContent.customCTAs.doctorTrustCTA.text}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
                
                {tempContent.customCTAs.successStoryCTA.enabled && (
                  <div className="max-w-sm mx-auto">
                    <button className={`w-full bg-gradient-to-r ${tempContent.customCTAs.successStoryCTA.backgroundColor} ${tempContent.customCTAs.successStoryCTA.textColor} font-bold text-lg py-5 px-6 rounded-2xl shadow-xl transition-all duration-300 ${tempContent.customCTAs.successStoryCTA.usePulseAnimation ? 'animate-pulse' : ''}`}>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{tempContent.customCTAs.successStoryCTA.icon}</span>
                        <span className="text-center leading-tight text-sm">
                          {tempContent.customCTAs.successStoryCTA.text}
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'globalBackground':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Configurações de Background Global</h3>
            
            <div className="bg-slate-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Cor de Fundo da Página</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Selecionar Background</label>
                <select
                  value={tempContent.globalBackground.backgroundClass}
                  onChange={(e) => handleInputChange('globalBackground.backgroundClass', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white mb-3"
                >
                  {tempContent.globalBackground.availableBackgrounds.map((bg) => (
                    <option key={bg.name} value={bg.class}>{bg.name}</option>
                  ))}
                </select>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Cor Personalizada de Fundo</label>
                  <div className="flex gap-2">
                    <select
                      value={tempContent.globalBackground.backgroundClass}
                      onChange={(e) => handleInputChange('globalBackground.backgroundClass', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    >
                      <option value="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">Azul Padrão</option>
                      <option value="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">Verde Escuro</option>
                      <option value="bg-gradient-to-br from-purple-900 via-purple-800 to-violet-900">Roxo Escuro</option>
                      <option value="bg-gradient-to-br from-red-900 via-red-800 to-rose-900">Vermelho Escuro</option>
                      <option value="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">Cinza Escuro</option>
                      <option value="bg-gradient-to-br from-orange-900 via-orange-800 to-amber-900">Laranja Escuro</option>
                      <option value="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900">Teal Escuro</option>
                      <option value="bg-black">Preto Sólido</option>
                      <option value="bg-blue-900">Azul Sólido</option>
                      <option value="bg-green-900">Verde Sólido</option>
                      <option value="custom">🎨 Cor Personalizada</option>
                    </select>
                    
                    <button
                      onClick={() => setColorPickerOpen(colorPickerOpen === 'globalBackground' ? null : 'globalBackground')}
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg hover:bg-slate-500 text-white flex items-center gap-1"
                      title="Seletor de Cor"
                    >
                      <Palette size={16} />
                    </button>
                  </div>
                  
                  {colorPickerOpen === 'globalBackground' && (
                    <div className="mt-2 p-3 bg-slate-600 rounded-lg border border-slate-500">
                      <h6 className="text-sm font-medium text-slate-300 mb-3">Cores Sólidas</h6>
                      <div className="grid grid-cols-8 gap-2 mb-4">
                        {[
                          '#BE1D1E', '#DC2626', '#EF4444', '#F87171',
                          '#1E40AF', '#2563EB', '#3B82F6', '#60A5FA',
                          '#059669', '#10B981', '#34D399', '#6EE7B7',
                          '#7C2D12', '#EA580C', '#F97316', '#FB923C',
                          '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD',
                          '#DB2777', '#EC4899', '#F472B6', '#F9A8D4',
                          '#374151', '#4B5563', '#6B7280', '#9CA3AF',
                          '#000000', '#1F2937', '#FFFFFF', '#F3F4F6'
                        ].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              handleInputChange('globalBackground.backgroundClass', `bg-[${color}]`);
                              setColorPickerOpen(null);
                            }}
                            className="w-8 h-8 rounded border-2 border-slate-400 hover:border-white transition-colors"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      
                      <h6 className="text-sm font-medium text-slate-300 mb-3">Gradientes</h6>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          { name: 'Sunset', class: 'bg-gradient-to-r from-orange-400 to-red-500' },
                          { name: 'Ocean', class: 'bg-gradient-to-r from-blue-400 to-blue-600' },
                          { name: 'Forest', class: 'bg-gradient-to-r from-green-400 to-green-600' },
                          { name: 'Purple', class: 'bg-gradient-to-r from-purple-400 to-purple-600' },
                          { name: 'Pink', class: 'bg-gradient-to-r from-pink-400 to-pink-600' },
                          { name: 'Teal', class: 'bg-gradient-to-r from-teal-400 to-teal-600' },
                          { name: 'Indigo', class: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
                          { name: 'Gray', class: 'bg-gradient-to-r from-gray-400 to-gray-600' },
                          { name: 'Fire', class: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500' },
                          { name: 'Sky', class: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600' },
                          { name: 'Emerald', class: 'bg-gradient-to-r from-emerald-400 to-cyan-400' },
                          { name: 'Rose', class: 'bg-gradient-to-r from-rose-400 to-pink-400' }
                        ].map((gradient) => (
                          <button
                            key={gradient.name}
                            onClick={() => {
                              handleInputChange('globalBackground.backgroundClass', gradient.class);
                              setColorPickerOpen(null);
                            }}
                            className={`h-12 rounded border-2 border-slate-400 hover:border-white transition-colors ${gradient.class}`}
                            title={gradient.name}
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => setColorPickerOpen(null)}
                          className="px-3 py-1 bg-slate-500 text-white rounded text-sm hover:bg-slate-400"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-600 rounded-lg p-4">
                <h5 className="text-sm font-medium text-slate-300 mb-2">Preview do Background Selecionado:</h5>
                <div className={`w-full h-20 rounded-lg ${tempContent.globalBackground.backgroundClass} border border-slate-500`}></div>
                <p className="text-xs text-slate-400 mt-2">Esta cor será aplicada como fundo de toda a página</p>
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Rodapé</h3>
            {renderInput('Nome da Marca', 'footer.brandName')}
            {renderInput('Copyright', 'footer.copyright')}
            {renderInput('Disclaimer', 'footer.disclaimer', 'textarea')}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Links</label>
              {tempContent.footer.links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...content.footer.links];
                      newLinks[index] = e.target.value;
                      handleInputChange('footer.links', newLinks);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                  <button
                    onClick={() => {
                      const newLinks = content.footer.links.filter((_, i) => i !== index);
                      handleInputChange('footer.links', newLinks);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newLinks = [...content.footer.links, ''];
                  handleInputChange('footer.links', newLinks);
                }}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Link
              </button>
            </div>
          </div>
        );

      default:
        return <div className="text-white">Selecione uma seção para editar</div>;
    }
  };

  return (
    <div className="space-y-6 text-white bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Editor de Conteúdo</h1>
          <p className="text-slate-400">Edite todo o conteúdo do site principal</p>
        </div>
        
        <div className="flex items-center gap-4">
          {hasChanges && (
            <span className="text-yellow-400 text-sm">● Alterações não salvas</span>
          )}
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Salvando...' : 
             saveStatus === 'saved' ? 'Salvo!' : 
             saveStatus === 'error' ? 'Erro!' : 'Salvar'}
          </button>
          
          <button
            onClick={handleDiscardChanges}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasChanges 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Descartar
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            Importar
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleResetar}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <RotateCcw className="w-4 h-4" />
            Resetar
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Seções</h3>
          <div className="space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="flex-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
          {renderSectionContent()}
        </div>
      </div>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={imageModal.isOpen}
        onClose={() => setImageModal(prev => ({ ...prev, isOpen: false }))}
        onSelect={imageModal.onSelect}
        category={imageModal.category}
        currentImage={imageModal.currentImage}
      />
    </div>
  );
};