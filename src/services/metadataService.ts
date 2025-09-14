export interface PageMetadata {
  pageTitle: string;
  pageDescription: string;
  faviconUrl: string;
}

const METADATA_STORAGE_KEY = 'eagleboost_page_metadata';

const defaultMetadata: PageMetadata = {
  pageTitle: 'EAGLEBOOST - Analytics & Tracking',
  pageDescription: 'Plataforma avançada de analytics e rastreamento para seu negócio',
  faviconUrl: '/favicon.ico'
};

export class MetadataService {
  static getMetadata(): PageMetadata {
    try {
      const stored = localStorage.getItem(METADATA_STORAGE_KEY);
      if (stored) {
        return { ...defaultMetadata, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Error loading metadata from localStorage:', error);
    }
    return defaultMetadata;
  }

  static saveMetadata(metadata: PageMetadata): void {
    try {
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(metadata));
      this.updatePageMetadata(metadata);
    } catch (error) {
      console.error('Error saving metadata to localStorage:', error);
    }
  }

  static updatePageMetadata(metadata: PageMetadata): void {
    // Update document title
    document.title = metadata.pageTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metadata.pageDescription);

    // Update favicon
    this.updateFavicon(metadata.faviconUrl);
  }

  static updateFavicon(faviconUrl: string): void {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());

    // Add new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);

    // Add apple-touch-icon for mobile devices
    const appleFavicon = document.createElement('link');
    appleFavicon.rel = 'apple-touch-icon';
    appleFavicon.href = faviconUrl;
    document.head.appendChild(appleFavicon);
  }

  static uploadFavicon(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.match(/image\/(ico|png|svg|jpeg|jpg|gif)/)) {
        reject(new Error('Formato de arquivo não suportado. Use .ico, .png, .svg, .jpg ou .gif'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // For demo purposes, we'll use data URL
          // In production, you'd upload to a server
          resolve(result);
        } else {
          reject(new Error('Erro ao ler o arquivo'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsDataURL(file);
    });
  }

  static initializeMetadata(): void {
    const metadata = this.getMetadata();
    this.updatePageMetadata(metadata);
  }
}

// Initialize metadata on module load
if (typeof window !== 'undefined') {
  MetadataService.initializeMetadata();
}