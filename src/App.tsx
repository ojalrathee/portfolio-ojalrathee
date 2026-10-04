import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import AboutPage from '@/pages/AboutPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ContactPage from '@/pages/ContactPage';
import SignInPage from '@/pages/SignInPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostDetailPage from '@/pages/BlogPostDetailPage';
import ResumePage from '@/pages/ResumePage';
import TerminalPage from '@/pages/TerminalPage';
import DesignPage from '@/pages/DesignPage';
import AdminLayout from '@/components/admin/AdminLayout';
import OverviewPage from '@/pages/admin/OverviewPage';
import ProjectsAdminPage from '@/pages/admin/ProjectsAdminPage';
import MessagesPage from '@/pages/admin/MessagesPage';
import BlogAdminPage from '@/pages/admin/BlogAdminPage';
import CertificationsAdminPage from '@/pages/admin/CertificationsAdminPage';
import BadgesAdminPage from '@/pages/admin/BadgesAdminPage';
import VibeCodingAdminPage from '@/pages/admin/VibeCodingAdminPage';
import ResumeAdminPage from '@/pages/admin/ResumeAdminPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site — shared layout with static Sidebar + Hero */}
            <Route element={<Layout />}>
              <Route path="/" element={<AboutPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/terminal" element={<TerminalPage />} />
              <Route path="/design" element={<DesignPage />} />
            </Route>

            {/* Admin dashboard (separate layout) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="projects" element={<ProjectsAdminPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="blog" element={<BlogAdminPage />} />
              <Route path="certifications" element={<CertificationsAdminPage />} />
              <Route path="badges" element={<BadgesAdminPage />} />
              <Route path="vibe-coding" element={<VibeCodingAdminPage />} />
              <Route path="resume" element={<ResumeAdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
