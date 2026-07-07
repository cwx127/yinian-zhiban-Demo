export interface HealthReminder {
  title: string;
  desc: string;
  icon: string;
  tag: string;
  tagClass: 'success' | 'warning' | 'error' | 'default';
}

export interface HealthItem {
  title: string;
  desc: string;
  icon: string;
  status: string;
  statusClass: 'success' | 'warning' | 'error';
}

export interface HealthStats {
  sleepHours: number;
  steps: number;
  bloodPressure: string;
  temperature: number;
}

export interface UserProfile {
  name: string;
  age: number;
  phone: string;
  emergencyContact: string;
  medicationTimes: string[];
  address: string;
}

export const reminders: HealthReminder[] = [
  { title: '智能提醒', desc: '下午三点服用降压药', icon: 'bell', tag: '待处理', tagClass: 'warning' },
  { title: '健康日报', desc: '今日步数已达 4,200 步', icon: 'heart-pulse', tag: '正常', tagClass: 'success' },
  { title: '家人关怀', desc: '女儿发送了本周照片', icon: 'users', tag: '新消息', tagClass: 'default' },
  { title: '一键求助', desc: '紧急联系人已就绪', icon: 'phone-call', tag: '已就绪', tagClass: 'success' },
];

export const healthItems: HealthItem[] = [
  { title: '血压监测', desc: '今日血压 128/82 mmHg，状态平稳', icon: 'activity', status: '正常', statusClass: 'success' },
  { title: '用药记录', desc: '上午降压药已按时服用', icon: 'pill', status: '已完成', statusClass: 'success' },
  { title: '睡眠质量', desc: '昨晚深睡 4.2 小时，总时长 7.1 小时', icon: 'moon', status: '良好', statusClass: 'success' },
  { title: '血糖检测', desc: '空腹血糖 6.1 mmol/L', icon: 'droplets', status: '偏高', statusClass: 'warning' },
  { title: '运动步数', desc: '目标 6,000 步，已完成 4,200 步', icon: 'footprints', status: '进行中', statusClass: 'warning' },
  { title: '体温记录', desc: '今日体温 36.5°C', icon: 'thermometer', status: '正常', statusClass: 'success' },
];

export const healthStats: HealthStats = {
  sleepHours: 7.1,
  steps: 4200,
  bloodPressure: '128/82',
  temperature: 36.5,
};

export const userProfile: UserProfile = {
  name: '张秀兰',
  age: 72,
  phone: '138****6789',
  emergencyContact: '张明（女儿）',
  medicationTimes: ['08:00', '14:00', '20:00'],
  address: '北京市朝阳区建国路88号',
};

export const weatherInfo = {
  condition: '晴转多云',
  temperatureRange: '18–26°C',
  desc: '气温 18–26°C，适合户外散步。紫外线中等，建议做好防晒。',
  icon: 'cloud-sun',
};