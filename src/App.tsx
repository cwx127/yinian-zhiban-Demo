import { ShieldCheck, UserRound, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toast } from './components/Toast';
import type { AppRole } from './types';
import { FamilyApp } from './views/FamilyApp';
import { SeniorApp } from './views/SeniorApp';

const ROLE_KEY = 'zhiyin-active-role';

export default function App() {
  const [role, setRole] = useState<AppRole>(() =>
    localStorage.getItem(ROLE_KEY) === 'family' ? 'family' : 'senior',
  );
  const [toast, setToast] = useState<{ id: number; message: string; tone: 'success' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string, tone: 'success' | 'info' = 'success') => {
    setToast({ id: Date.now(), message, tone });
  };

  return (
    <div className="app-root" data-role={role}>
      <header className="product-bar">
        <a className="product-brand" href="#top" aria-label="智伴银龄首页">
          <span className="brand-mark"><ShieldCheck aria-hidden="true" /></span>
          <span><strong>智伴银龄</strong><small>居家安心陪伴</small></span>
        </a>
        <div className="role-switch" aria-label="演示视角">
          <button className={role === 'senior' ? 'active' : ''} onClick={() => setRole('senior')}>
            <UserRound aria-hidden="true" /><span>老人端</span>
          </button>
          <button className={role === 'family' ? 'active' : ''} onClick={() => setRole('family')}>
            <Users aria-hidden="true" /><span>家属端</span>
          </button>
        </div>
      </header>

      <div id="top">
        {role === 'senior' ? <SeniorApp notify={notify} /> : <FamilyApp notify={notify} />}
      </div>

      {toast && <Toast key={toast.id} message={toast.message} tone={toast.tone} />}
    </div>
  );
}
