import { dateKey } from './domain';
import type { AppData } from './types';

const todayAt = (hours: number, minutes: number) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const createDemoData = (): AppData => ({
  senior: {
    name: '王秀兰',
    preferredName: '王阿姨',
    city: '杭州',
    lastActiveAt: new Date().toISOString(),
  },
  medications: [
    {
      id: 'med-amlodipine',
      name: '苯磺酸氨氯地平片',
      dosage: '1片',
      times: ['08:00'],
      instruction: '早餐后服用',
      remainingDays: 12,
      enabled: true,
    },
    {
      id: 'med-metformin',
      name: '盐酸二甲双胍片',
      dosage: '1片',
      times: ['12:30', '18:30'],
      instruction: '随餐服用',
      remainingDays: 8,
      enabled: true,
    },
  ],
  medicationLogs: [
    {
      id: 'log-morning',
      medicationId: 'med-amlodipine',
      scheduledDate: dateKey(),
      scheduledTime: '08:00',
      status: 'taken',
      confirmedAt: todayAt(8, 6),
    },
  ],
  healthRecords: [
    {
      id: 'bp-today',
      type: 'blood-pressure',
      primaryValue: 128,
      secondaryValue: 78,
      note: '晨起测量',
      recordedAt: todayAt(7, 42),
    },
    {
      id: 'hr-today',
      type: 'heart-rate',
      primaryValue: 72,
      note: '静息心率',
      recordedAt: todayAt(7, 43),
    },
    {
      id: 'bp-yesterday',
      type: 'blood-pressure',
      primaryValue: 132,
      secondaryValue: 80,
      recordedAt: new Date(Date.now() - 86_400_000).toISOString(),
    },
  ],
  events: [
    {
      id: 'event-morning-checkin',
      level: 'normal',
      title: '今晨已报平安',
      detail: '07:35 完成早间问候，精神状态良好',
      occurredAt: todayAt(7, 35),
      acknowledged: true,
    },
    {
      id: 'event-sugar-reminder',
      level: 'attention',
      title: '血糖记录待补充',
      detail: '近 3 天未记录空腹血糖，可发起温和提醒',
      occurredAt: todayAt(9, 20),
      acknowledged: false,
    },
  ],
  messages: [
    {
      id: 'message-daughter',
      author: '女儿 王静',
      text: '妈妈，下午我下班后给您打电话。中午记得按时吃饭。',
      sentAt: todayAt(9, 10),
      played: false,
    },
  ],
  contacts: [
    { id: 'contact-daughter', name: '王静', relation: '女儿', phone: '138 0013 7286', priority: 1 },
    { id: 'contact-son', name: '王明', relation: '儿子', phone: '139 2158 4602', priority: 2 },
    { id: 'contact-community', name: '青禾社区值班室', relation: '社区', phone: '0571 8820 1190', priority: 3 },
  ],
});
