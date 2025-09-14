import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TrackingProvider } from './components/TrackingProvider';
import { BoltNavigation } from './components/BoltNavigation';
import { VideoContainer } from './components/VideoContainer';
import { ContentBlocker } from './components/ContentBlocker';
import { DTCOfferBlock } from './components/DTCOfferBlock';
import { AlternativeOffers } from './components/AlternativeOffers';
import { DoctorCarousel } from './components/DoctorCarousel';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { NewsCarousel } from './components/NewsCarousel';
import { GuaranteeDropdown } from './components/GuaranteeDropdown';
import { FAQBlock } from './components/FAQBlock';
import { Footer } from './components/Footer';
import { TopBanner } from './components/TopBanner';

// Importar todos os blocos separados
import { HeaderBlock } from './components/blocks/HeaderBlock';

import { DoctorTrustCTABlock } from './components/blocks/DoctorTrustCTABlock';
import { TransformLifeTitleBlock } from './components/blocks/TransformLifeTitleBlock';
import { TransformationStartsTodayBlock } from './components/blocks/TransformationStartsTodayBlock';
import { NewsOutletsTitleBlock } from './components/blocks/NewsOutletsTitleBlock';
import { NoFiltersBlock } from './components/blocks/NoFiltersBlock';


import { SuccessStoryCTABlock } from './components/blocks/SuccessStoryCTABlock';
import { useTracking } from './components/TrackingProvider';
import { useContentSection } from './hooks/useContent';
import { contentManager } from './utils/contentManager';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './components/admin/Dashboard';
import { LiveTraffic } from './components/admin/LiveTraffic';
import { ContentEditor } from './components/admin/ContentEditor';
import { Logs } from './components/admin/Logs';
import { Integrations } from './components/admin/Integrations';
import { Settings } from './components/admin/Settings';

// Import page components

const MainContent: React.FC = () => {
  const { trackClick } = useTracking();
  const video = useContentSection('video');
  const content = contentManager.getContent();
  const backgroundClass = content.globalBackground.backgroundClass;
  
  // Force re-render quando conteúdo muda
  const [renderKey, setRenderKey] = React.useState(0);
  
  React.useEffect(() => {
    const handleAdminSave = () => {
      console.log('🔄 Admin content saved, forcing re-render');
      setRenderKey(prev => prev + 1);
    };
    
    window.addEventListener('adminContentSaved', handleAdminSave);
    window.addEventListener('contentUpdated', handleAdminSave);
    window.addEventListener('forceContentReload', handleAdminSave);
    
    // Listener adicional para mudanças de storage entre abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'site_content' && e.newValue) {
        console.log('🔄 Content updated in another tab, forcing re-render');
        setRenderKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('adminContentSaved', handleAdminSave);
      window.removeEventListener('contentUpdated', handleAdminSave);
      window.removeEventListener('forceContentReload', handleAdminSave);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleBackgroundClick = () => {
    trackClick('background', {
      utm_content: 'page_background',
      utm_term: 'background_interaction'
    });
  };

  return (
    <div className={`min-h-screen ${backgroundClass} p-4`}>
      <div 
        className="flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-6 md:gap-8"
        onClick={handleBackgroundClick}
      >
        {/* Bloco: Top Banner */}
        <TopBanner className="w-full mb-4" />
        
        {/* Bloco: Container de Vídeo */}
        <VideoContainer 
          embedCode={video.embedCode}
          aspectRatio={video.aspectRatio}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md mb-4" 
        />
        

        
        {/* Conteúdo Bloqueado - Aparece apenas após o tempo configurado */}
        <ContentBlocker>
          {/* Bloco: Oferta Principal DTC */}
          <div id="oferta-6-bottles">
            <DTCOfferBlock className="w-full mb-4" />
          </div>
          
          {/* Bloco: Ofertas Alternativas */}
          <div className="alternative-offers-section">
            <AlternativeOffers className="w-full mb-8" />
          </div>
          
          {/* Bloco: Header Doctors Section */}
          <HeaderBlock />
          

          
          {/* Bloco: Carrossel de Médicos */}
          <DoctorCarousel className="w-full mb-8" />
          

          
          {/* Bloco: Doctor Trust CTA */}
          <div className="mb-4">
            <DoctorTrustCTABlock />
          </div>
          
          {/* Bloco: No Filters Title */}
          <div className="mb-6">
            <NoFiltersBlock />
          </div>
          
          {/* Bloco: Testemunhos de Clientes */}
          <CustomerTestimonials className="w-full mb-8" />
          
          {/* Bloco: Success Story CTA */}
          <div className="mb-8">
            <SuccessStoryCTABlock />
          </div>
          
          {/* Bloco: As Seen In News Outlets Title */}
          <div className="mb-6">
            <NewsOutletsTitleBlock />
          </div>
          
          {/* Bloco: Carrossel de Notícias */}
          <NewsCarousel className="w-full mb-8" />
          
          {/* Bloco: Garantia de 180 Dias */}
          <GuaranteeDropdown className="w-full mb-8" />
          
          {/* Bloco: Ready to Transform Your Life Title */}
          <div className="mb-6">
            <TransformLifeTitleBlock />
          </div>
          
          {/* Bloco: Oferta Principal DTC - Final */}
          <DTCOfferBlock className="w-full mb-4" />
          
          {/* Bloco: Ofertas Alternativas - Final */}
          <AlternativeOffers className="w-full mb-8" />
          
          {/* Bloco: Your Transformation Starts Today */}
          <div className="mb-8">
            <TransformationStartsTodayBlock />
          </div>
          
          {/* Bloco: FAQ */}
          <FAQBlock className="w-full mb-8" />
        </ContentBlocker>
        
        {/* Footer - Sempre visível */}
        <Footer className="w-full" />
      </div>
    </div>
  );
};

// App principal
// Importações para autenticação e rotas protegidas
import { Login } from './components/admin/Login';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// No componente App, atualize as rotas
function App() {
  const [currentPage, setCurrentPage] = React.useState('main');

  return (
    <Router>
      <TrackingProvider>
        {/* Bolt Navigation Menu */}
        <BoltNavigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="live" element={<LiveTraffic />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="logs" element={<Logs />} />
              <Route path="integrations" element={<Integrations />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          
          {/* Main Page Route */}
          <Route path="*" element={<MainContent />} />
        </Routes>
      </TrackingProvider>
    </Router>
  );
}

export default App;