import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ArtistsPage from '@/pages/ArtistsPage';
import SponsorsPage from '@/pages/SponsorsPage';
import ShopPage from '@/pages/ShopPage';
import RulesPage from '@/pages/RulesPage';
import ContactPage from '@/pages/ContactPage';
import VisitInfoPage from '@/pages/VisitInfoPage';
import ProgramPage from '@/pages/ProgramPage';
import NewsPage from '@/pages/NewsPage';
import NewsArticlePage from '@/pages/NewsArticlePage';
import FaqPage from '@/pages/FaqPage';
import GalleryPage from '@/pages/GalleryPage';
import TrucksPage from '@/pages/TrucksPage';
import TruckProfilePage from '@/pages/TruckProfilePage';
import AccountPage from '@/pages/AccountPage';
import AccountLoginPage from '@/pages/AccountLoginPage';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminEventsPage from '@/pages/AdminEventsPage';
import AdminSponsorsPage from '@/pages/AdminSponsorsPage';
import AdminArtistsPage from '@/pages/AdminArtistsPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import AdminCmsPage from '@/pages/AdminCmsPage';
import AdminTrucksPage from '@/pages/AdminTrucksPage';
import AdminOrdersPage from '@/pages/AdminOrdersPage';
import AdminMapPage from '@/pages/AdminMapPage';
import AdminVotePage from '@/pages/AdminVotePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/om" element={<AboutPage />} />
            <Route path="/artister" element={<ArtistsPage />} />
            <Route path="/sponsorer" element={<SponsorsPage />} />
            <Route path="/biljetter" element={<ShopPage />} />
            <Route path="/regler" element={<RulesPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/besok" element={<VisitInfoPage />} />
            <Route path="/program" element={<ProgramPage />} />
            <Route path="/nyheter" element={<NewsPage />} />
            <Route path="/nyheter/:id" element={<NewsArticlePage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/galleri" element={<GalleryPage />} />
            <Route path="/lastbilar" element={<TrucksPage />} />
            <Route path="/lastbilar/:id" element={<TruckProfilePage />} />
            <Route path="/karta" element={<MapPage />} />
          </Route>

          {/* Account (public auth) */}
          <Route path="/konto/login" element={<AccountLoginPage />} />
          <Route path="/konto" element={<AccountPage />} />

          {/* Admin login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/event" element={<ProtectedRoute><AdminEventsPage /></ProtectedRoute>} />
          <Route path="/admin/sponsorer" element={<ProtectedRoute><AdminSponsorsPage /></ProtectedRoute>} />
          <Route path="/admin/artister" element={<ProtectedRoute><AdminArtistsPage /></ProtectedRoute>} />
          <Route path="/admin/installningar" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
          <Route path="/admin/innehall" element={<ProtectedRoute><AdminCmsPage /></ProtectedRoute>} />
          <Route path="/admin/lastbilar" element={<ProtectedRoute><AdminTrucksPage /></ProtectedRoute>} />
          <Route path="/admin/bestallningar" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
          <Route path="/admin/karta" element={<ProtectedRoute><AdminMapPage /></ProtectedRoute>} />
          <Route path="/admin/rostning" element={<ProtectedRoute><AdminVotePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
