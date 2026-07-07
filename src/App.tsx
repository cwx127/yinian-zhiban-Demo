import { useAppStore } from './store/useAppStore';
import { Navigation, Modal } from './components';
import { Dashboard, HealthReport, Settings } from './pages';

export default function App() {
  const currentPage = useAppStore((state) => state.currentPage);
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const showModal = useAppStore((state) => state.showModal);
  const modalTitle = useAppStore((state) => state.modalTitle);
  const modalMessage = useAppStore((state) => state.modalMessage);
  const closeModal = useAppStore((state) => state.closeModal);

  const pages = {
    dashboard: Dashboard,
    health: HealthReport,
    settings: Settings,
  };

  const CurrentPage = pages[currentPage];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="flex-1 container max-w-5xl mx-auto">
        <CurrentPage />
      </main>
      
      <footer className="py-5 px-6 border-t border-border text-center">
        <p className="font-body text-caption text-muted-foreground mb-0">
          © 2026 颐年智伴 — 温暖守护每一天
        </p>
      </footer>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
}