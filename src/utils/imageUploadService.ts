export interface UploadedImage {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: number;
  category: 'doctor' | 'customer' | 'news' | 'product';
}

class ImageUploadService {
  private storageKey = 'uploaded_images';

  // Upload de imagem
  async uploadImage(file: File, category: 'doctor' | 'customer' | 'news' | 'product'): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      // Validações
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        reject(new Error('Formato não suportado. Use JPEG, PNG, GIF ou WebP'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        reject(new Error('Arquivo muito grande. Máximo 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const uploadedImage: UploadedImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: result,
            type: file.type,
            size: file.size,
            uploadDate: Date.now(),
            category
          };

          this.saveImage(uploadedImage);
          resolve(uploadedImage);
        } else {
          reject(new Error('Erro ao processar imagem'));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  // Salva imagem no localStorage
  private saveImage(image: UploadedImage): void {
    const images = this.getImages();
    images.push(image);
    localStorage.setItem(this.storageKey, JSON.stringify(images));
  }

  // Obtém todas as imagens
  getImages(category?: string): UploadedImage[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const images = stored ? JSON.parse(stored) : [];
      
      if (category) {
        return images.filter((img: UploadedImage) => img.category === category);
      }
      
      return images;
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      return [];
    }
  }

  // Remove imagem
  deleteImage(imageId: string): void {
    const images = this.getImages();
    const filtered = images.filter(img => img.id !== imageId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  // Obtém imagem por ID
  getImageById(imageId: string): UploadedImage | null {
    const images = this.getImages();
    return images.find(img => img.id === imageId) || null;
  }
}

export const imageUploadService = new ImageUploadService();