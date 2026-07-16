import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createDemoData } from './data';
import { dateKey } from './domain';
import type { AppData, HealthRecordInput, MedicationInput } from './types';

const STORAGE_KEY = 'zhiyin-senior-mvp-v1';

type AppStore = {
  data: AppData;
  confirmMedication: (medicationId: string, time: string) => void;
  addHealthRecord: (record: HealthRecordInput) => void;
  addMedication: (medication: MedicationInput) => void;
  toggleMedication: (medicationId: string) => void;
  addFamilyMessage: (text: string) => void;
  markMessagePlayed: (messageId: string) => void;
  acknowledgeEvent: (eventId: string) => void;
  createEmergencyEvent: () => void;
  resetDemo: () => void;
};

const StoreContext = createContext<AppStore | null>(null);

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AppData) : createDemoData();
  } catch {
    return createDemoData();
  }
};

const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const value = useMemo<AppStore>(() => ({
    data,
    confirmMedication: (medicationId, time) => {
      setData((current) => {
        const exists = current.medicationLogs.some(
          (log) =>
            log.medicationId === medicationId &&
            log.scheduledDate === dateKey() &&
            log.scheduledTime === time,
        );
        if (exists) return current;
        return {
          ...current,
          senior: { ...current.senior, lastActiveAt: new Date().toISOString() },
          medicationLogs: [
            {
              id: uniqueId('med-log'),
              medicationId,
              scheduledDate: dateKey(),
              scheduledTime: time,
              status: 'taken',
              confirmedAt: new Date().toISOString(),
            },
            ...current.medicationLogs,
          ],
        };
      });
    },
    addHealthRecord: (record) => {
      setData((current) => ({
        ...current,
        senior: { ...current.senior, lastActiveAt: new Date().toISOString() },
        healthRecords: [
          { ...record, id: uniqueId('health'), recordedAt: new Date().toISOString() },
          ...current.healthRecords,
        ],
      }));
    },
    addMedication: (medication) => {
      setData((current) => ({
        ...current,
        medications: [
          ...current.medications,
          { ...medication, id: uniqueId('med'), remainingDays: 30, enabled: true },
        ],
      }));
    },
    toggleMedication: (medicationId) => {
      setData((current) => ({
        ...current,
        medications: current.medications.map((medication) =>
          medication.id === medicationId
            ? { ...medication, enabled: !medication.enabled }
            : medication,
        ),
      }));
    },
    addFamilyMessage: (text) => {
      setData((current) => ({
        ...current,
        messages: [
          { id: uniqueId('message'), author: '女儿 王静', text, sentAt: new Date().toISOString(), played: false },
          ...current.messages,
        ],
      }));
    },
    markMessagePlayed: (messageId) => {
      setData((current) => ({
        ...current,
        messages: current.messages.map((message) =>
          message.id === messageId ? { ...message, played: true } : message,
        ),
      }));
    },
    acknowledgeEvent: (eventId) => {
      setData((current) => ({
        ...current,
        events: current.events.map((event) =>
          event.id === eventId ? { ...event, acknowledged: true } : event,
        ),
      }));
    },
    createEmergencyEvent: () => {
      setData((current) => ({
        ...current,
        senior: { ...current.senior, lastActiveAt: new Date().toISOString() },
        events: [
          {
            id: uniqueId('emergency'),
            level: 'urgent',
            title: '老人端发起紧急求助',
            detail: '已按顺序通知紧急联系人，并共享当前位置',
            occurredAt: new Date().toISOString(),
            acknowledged: false,
          },
          ...current.events,
        ],
      }));
    },
    resetDemo: () => setData(createDemoData()),
  }), [data]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
};
