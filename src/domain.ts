import type { AppData, Medication, MedicationLog } from './types';

export const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const medicationLogFor = (
  logs: MedicationLog[],
  medicationId: string,
  time: string,
  date = dateKey(),
) => logs.find(
  (log) =>
    log.medicationId === medicationId &&
    log.scheduledDate === date &&
    log.scheduledTime === time,
);

export const medicationProgress = (data: AppData) => {
  const enabled = data.medications.filter((item) => item.enabled);
  const total = enabled.reduce((sum, item) => sum + item.times.length, 0);
  const taken = data.medicationLogs.filter(
    (log) => log.scheduledDate === dateKey() && log.status === 'taken',
  ).length;
  return { taken, total, percentage: total === 0 ? 0 : Math.round((taken / total) * 100) };
};

export const latestBloodPressure = (data: AppData) =>
  data.healthRecords.find((record) => record.type === 'blood-pressure');

export type MessageRisk = 'ordinary' | 'health' | 'medication' | 'emergency';

export const classifyMessageRisk = (message: string): MessageRisk => {
  const normalized = message.trim().toLowerCase();
  if (/(救命|摔倒|胸口疼|胸痛|呼吸困难|喘不上气|昏倒)/.test(normalized)) {
    return 'emergency';
  }
  if (/(停药|换药|加药|减药|剂量|多吃|少吃)/.test(normalized)) {
    return 'medication';
  }
  if (/(头晕|不舒服|血压|血糖|心率|疼)/.test(normalized)) {
    return 'health';
  }
  return 'ordinary';
};

export const companionReply = (message: string) => {
  switch (classifyMessageRisk(message)) {
    case 'emergency':
      return '我听到您可能需要帮助。请保持在安全位置，我可以马上帮您联系家人。';
    case 'medication':
      return '用药调整需要由医生判断，我不能替您加药、停药或换药。要我帮您联系家人或提醒您咨询医生吗？';
    case 'health':
      return '我记下了。若不适持续或加重，请尽快联系家人或医生；如果出现胸痛、呼吸困难，请立即求助。';
    default:
      return message.includes('天气')
        ? '今天多云，气温 24 到 31 度。上午适合在小区慢慢走一走，记得带水。'
        : '我在听。您愿意再和我说说吗？';
  }
};

export const sortMedicationTimes = (medications: Medication[]) =>
  medications
    .filter((medication) => medication.enabled)
    .flatMap((medication) =>
      medication.times.map((time) => ({ medication, time })),
    )
    .sort((a, b) => a.time.localeCompare(b.time));
