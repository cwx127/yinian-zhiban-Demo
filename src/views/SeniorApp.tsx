import {
  Activity,
  BellRing,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  Mic,
  Phone,
  Pill,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Volume2,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Modal } from '../components/Modal';
import {
  classifyMessageRisk,
  companionReply,
  latestBloodPressure,
  medicationLogFor,
  sortMedicationTimes,
} from '../domain';
import { useStore } from '../store';
import type { HealthRecordInput } from '../types';

type SeniorTab = 'home' | 'health' | 'medicine' | 'family';

type SeniorAppProps = {
  notify: (message: string, tone?: 'success' | 'info') => void;
};

const formatTime = (value: string | Date) =>
  new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(value);

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

function EmergencyHoldButton({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);

  const stop = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    setProgress(0);
  };

  const start = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    startedAtRef.current = Date.now();
    timerRef.current = window.setInterval(() => {
      const next = Math.min(100, ((Date.now() - startedAtRef.current) / 3000) * 100);
      setProgress(next);
      if (next >= 100) {
        stop();
        onComplete();
      }
    }, 40);
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onComplete();
    }
  };

  useEffect(() => stop, []);

  return (
    <button
      className="sos-hold-button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={(event) => {
        if (event.buttons === 1) stop();
      }}
      onKeyDown={handleKeyboard}
      aria-label="长按三秒发起紧急求助"
      style={{ '--hold-progress': `${progress}%` } as React.CSSProperties}
    >
      <span className="sos-hold-fill" aria-hidden="true" />
      <Phone aria-hidden="true" />
      <span>
        <strong>紧急求助</strong>
        <small>{progress > 0 ? `继续按住 ${Math.ceil((100 - progress) * 0.03)} 秒` : '长按 3 秒'}</small>
      </span>
    </button>
  );
}

export function SeniorApp({ notify }: SeniorAppProps) {
  const {
    data,
    confirmMedication,
    addHealthRecord,
    markMessagePlayed,
    createEmergencyEvent,
  } = useStore();
  const [tab, setTab] = useState<SeniorTab>('home');
  const [healthOpen, setHealthOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<Array<{ from: 'assistant' | 'user'; text: string }>>([
    { from: 'assistant' as const, text: '王阿姨，我在。您今天想聊些什么？' },
  ]);
  const now = useClock();
  const schedule = useMemo(() => sortMedicationTimes(data.medications), [data.medications]);
  const latestBp = latestBloodPressure(data);
  const latestMessage = data.messages[0];

  const nextMedication = schedule.find(
    ({ medication, time }) => !medicationLogFor(data.medicationLogs, medication.id, time),
  );

  const speakMessage = (messageId: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.86;
      window.speechSynthesis.speak(utterance);
    }
    markMessagePlayed(messageId);
    notify('正在为您朗读家人留言', 'info');
  };

  const submitAssistant = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const risk = classifyMessageRisk(value);
    setAssistantMessages((current) => [
      ...current,
      { from: 'user' as const, text: value },
      { from: 'assistant' as const, text: companionReply(value) },
    ]);
    setAssistantInput('');
    if (risk === 'emergency') {
      setAssistantOpen(false);
      setEmergencyOpen(true);
    }
  };

  const sendAssistant = (event: FormEvent) => {
    event.preventDefault();
    submitAssistant(assistantInput);
  };

  const triggerEmergency = () => {
    createEmergencyEvent();
    setEmergencyOpen(false);
    notify('已通知王静，并开始联系下一位紧急联系人');
  };

  return (
    <div className="senior-app">
      <main className="senior-main">
        {tab === 'home' && (
          <>
            <header className="senior-greeting">
              <div>
                <p className="senior-date">{formatDate(now)}</p>
                <h1>{now.getHours() < 12 ? '早上好' : now.getHours() < 18 ? '下午好' : '晚上好'}，{data.senior.preferredName}</h1>
                <p className="senior-weather">{formatTime(now)} · {data.senior.city}多云 · 29°C</p>
              </div>
              <div className="connected-status">
                <ShieldCheck aria-hidden="true" />
                <span><strong>守护已连接</strong><small>家人可看到您的报平安状态</small></span>
              </div>
            </header>

            <div className="senior-dashboard-grid">
              <div className="senior-primary-column">
                {nextMedication ? (
                  <section className="senior-task-panel" aria-labelledby="next-medication-title">
                    <div className="task-time-block">
                      <span>下一项</span>
                      <strong>{nextMedication.time}</strong>
                    </div>
                    <div className="task-copy">
                      <span className="status-kicker"><Pill aria-hidden="true" /> 用药提醒</span>
                      <h2 id="next-medication-title">{nextMedication.medication.name}</h2>
                      <p>{nextMedication.medication.dosage} · {nextMedication.medication.instruction}</p>
                    </div>
                    <button
                      className="button button-success button-large"
                      onClick={() => {
                        confirmMedication(nextMedication.medication.id, nextMedication.time);
                        notify('已记录本次服药，家人端已同步');
                      }}
                    >
                      <Check aria-hidden="true" />我已服药
                    </button>
                  </section>
                ) : (
                  <section className="senior-task-panel task-complete" aria-label="今日用药已完成">
                    <div className="task-complete-icon"><Check aria-hidden="true" /></div>
                    <div className="task-copy">
                      <span className="status-kicker">今日任务</span>
                      <h2>今天的用药都完成了</h2>
                      <p>做得很好，记录已同步给家人。</p>
                    </div>
                  </section>
                )}

                <section aria-labelledby="quick-actions-title">
                  <div className="section-heading-row">
                    <div>
                      <span className="eyebrow">常用服务</span>
                      <h2 id="quick-actions-title">今天想做什么？</h2>
                    </div>
                  </div>
                  <div className="senior-action-grid">
                    <button className="senior-action" onClick={() => setHealthOpen(true)}>
                      <span className="action-icon action-icon-health"><HeartPulse aria-hidden="true" /></span>
                      <span><strong>记录健康</strong><small>血压、血糖、心率</small></span>
                      <ChevronRight aria-hidden="true" className="action-chevron" />
                    </button>
                    <button className="senior-action" onClick={() => setTab('medicine')}>
                      <span className="action-icon action-icon-medicine"><Pill aria-hidden="true" /></span>
                      <span><strong>查看用药</strong><small>今天还有 {schedule.filter(({ medication, time }) => !medicationLogFor(data.medicationLogs, medication.id, time)).length} 次</small></span>
                      <ChevronRight aria-hidden="true" className="action-chevron" />
                    </button>
                    <button className="senior-action" onClick={() => setAssistantOpen(true)}>
                      <span className="action-icon action-icon-chat"><MessageCircle aria-hidden="true" /></span>
                      <span><strong>陪我聊聊</strong><small>说说话、问天气</small></span>
                      <ChevronRight aria-hidden="true" className="action-chevron" />
                    </button>
                    <button className="senior-action" onClick={() => setTab('family')}>
                      <span className="action-icon action-icon-family"><Users aria-hidden="true" /></span>
                      <span><strong>联系家人</strong><small>{data.contacts[0].name} · {data.contacts[0].relation}</small></span>
                      <ChevronRight aria-hidden="true" className="action-chevron" />
                    </button>
                  </div>
                </section>
              </div>

              <aside className="senior-side-column">
                {latestMessage && (
                  <section className="family-message-panel">
                    <div className="message-meta">
                      <span className="avatar avatar-warm">静</span>
                      <span><strong>{latestMessage.author}</strong><small>{formatTime(latestMessage.sentAt)} 留言</small></span>
                      {!latestMessage.played && <span className="new-dot">新</span>}
                    </div>
                    <blockquote>“{latestMessage.text}”</blockquote>
                    <button className="button button-secondary button-full" onClick={() => speakMessage(latestMessage.id, latestMessage.text)}>
                      {latestMessage.played ? <Volume2 aria-hidden="true" /> : <Play aria-hidden="true" />}
                      {latestMessage.played ? '再听一遍' : '听家人留言'}
                    </button>
                  </section>
                )}

                <section className="today-health-panel">
                  <div className="panel-title-row">
                    <div><span className="eyebrow">今日健康</span><h2>状态平稳</h2></div>
                    <span className="status-badge status-good">正常</span>
                  </div>
                  <div className="health-reading-grid">
                    <div><span>血压</span><strong>{latestBp ? `${latestBp.primaryValue}/${latestBp.secondaryValue}` : '--'}</strong><small>mmHg</small></div>
                    <div><span>心率</span><strong>{data.healthRecords.find((item) => item.type === 'heart-rate')?.primaryValue ?? '--'}</strong><small>次/分</small></div>
                  </div>
                  <button className="text-button" onClick={() => setTab('health')}>查看健康记录 <ChevronRight aria-hidden="true" /></button>
                </section>

                <EmergencyHoldButton onComplete={() => setEmergencyOpen(true)} />
              </aside>
            </div>
          </>
        )}

        {tab === 'health' && (
          <section className="senior-page" aria-labelledby="health-title">
            <header className="senior-page-header">
              <div><span className="eyebrow">健康记录</span><h1 id="health-title">最近状态</h1><p>这里只记录和提醒，不替代医生诊断。</p></div>
              <button className="button button-primary button-large" onClick={() => setHealthOpen(true)}><HeartPulse aria-hidden="true" />记录一次</button>
            </header>
            <div className="health-summary-band">
              <div className="summary-icon"><Activity aria-hidden="true" /></div>
              <div><span>最近一次血压</span><strong>{latestBp ? `${latestBp.primaryValue}/${latestBp.secondaryValue}` : '--/--'} <small>mmHg</small></strong><p>{latestBp?.note ?? '暂无记录'} · {latestBp ? formatTime(latestBp.recordedAt) : '--'}</p></div>
              <span className="status-badge status-good">处于个人日常范围</span>
            </div>
            <div className="senior-content-grid">
              <section className="data-panel">
                <div className="panel-title-row"><div><span className="eyebrow">近 7 次</span><h2>血压记录</h2></div></div>
                <div className="record-list">
                  {data.healthRecords.filter((item) => item.type === 'blood-pressure').map((record) => (
                    <div className="record-row" key={record.id}>
                      <span className="record-dot" />
                      <span><strong>{record.primaryValue}/{record.secondaryValue}</strong><small>mmHg</small></span>
                      <span className="record-note">{record.note || '日常测量'}</span>
                      <time>{new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(record.recordedAt))}</time>
                    </div>
                  ))}
                </div>
              </section>
              <aside className="health-boundary-note">
                <Stethoscope aria-hidden="true" />
                <h2>不舒服时怎么办</h2>
                <p>如果出现胸痛、呼吸困难或突然昏倒，请立即求助。</p>
                <button className="button button-outline button-full" onClick={() => setEmergencyOpen(true)}><Phone aria-hidden="true" />联系家人</button>
              </aside>
            </div>
          </section>
        )}

        {tab === 'medicine' && (
          <section className="senior-page" aria-labelledby="medicine-title">
            <header className="senior-page-header">
              <div><span className="eyebrow">用药安排</span><h1 id="medicine-title">今天的药</h1><p>只按家人设置的计划提醒，不提供调药建议。</p></div>
              <span className="large-count">{schedule.filter(({ medication, time }) => medicationLogFor(data.medicationLogs, medication.id, time)).length}<small> / {schedule.length} 已完成</small></span>
            </header>
            <div className="medicine-schedule">
              {schedule.map(({ medication, time }) => {
                const log = medicationLogFor(data.medicationLogs, medication.id, time);
                return (
                  <article className={`medicine-row ${log ? 'medicine-row-complete' : ''}`} key={`${medication.id}-${time}`}>
                    <time>{time}</time>
                    <span className="medicine-icon"><Pill aria-hidden="true" /></span>
                    <div><h2>{medication.name}</h2><p>{medication.dosage} · {medication.instruction}</p></div>
                    {log ? (
                      <span className="taken-label"><Check aria-hidden="true" /> {formatTime(log.confirmedAt)} 已服</span>
                    ) : (
                      <button className="button button-success" onClick={() => {
                        confirmMedication(medication.id, time);
                        notify('已记录本次服药');
                      }}><Check aria-hidden="true" />确认已服</button>
                    )}
                  </article>
                );
              })}
            </div>
            <div className="medicine-safety-note"><CircleHelp aria-hidden="true" /><span><strong>对药量有疑问？</strong><small>请先联系家人、医生或药师，不要自行加减药。</small></span></div>
          </section>
        )}

        {tab === 'family' && (
          <section className="senior-page" aria-labelledby="family-title">
            <header className="senior-page-header">
              <div><span className="eyebrow">家人关怀</span><h1 id="family-title">联系家人</h1><p>轻点按钮就能拨打电话。</p></div>
            </header>
            <div className="contact-grid">
              {data.contacts.map((contact) => (
                <article className="contact-card" key={contact.id}>
                  <span className={`avatar ${contact.priority === 1 ? 'avatar-warm' : ''}`}>{contact.name.slice(0, 1)}</span>
                  <div><h2>{contact.name}</h2><p>{contact.relation} · 联系顺序 {contact.priority}</p></div>
                  <a className="button button-primary" href={`tel:${contact.phone.replace(/\s/g, '')}`}><Phone aria-hidden="true" />打电话</a>
                </article>
              ))}
            </div>
            <section className="message-history">
              <div className="panel-title-row"><div><span className="eyebrow">家人留言</span><h2>最近消息</h2></div></div>
              {data.messages.map((message) => (
                <article className="message-history-row" key={message.id}>
                  <span className="avatar avatar-warm">静</span>
                  <div><strong>{message.author}</strong><p>{message.text}</p><small>{formatTime(message.sentAt)}</small></div>
                  <button className="icon-button icon-button-soft" title="朗读留言" aria-label={`朗读${message.author}的留言`} onClick={() => speakMessage(message.id, message.text)}><Volume2 aria-hidden="true" /></button>
                </article>
              ))}
            </section>
          </section>
        )}
      </main>

      <nav className="senior-bottom-nav" aria-label="老人端主导航">
        {[
          { id: 'home' as const, label: '首页', icon: Home },
          { id: 'health' as const, label: '健康', icon: HeartPulse },
          { id: 'medicine' as const, label: '用药', icon: Pill },
          { id: 'family' as const, label: '家人', icon: Users },
        ].map((item) => (
          <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
            <item.icon aria-hidden="true" /><span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="voice-fab" onClick={() => setAssistantOpen(true)} aria-label="打开语音陪伴" title="语音陪伴">
        <span className="voice-fab-rings" aria-hidden="true" />
        <Mic aria-hidden="true" />
        <span>和我说话</span>
      </button>

      <HealthRecordModal open={healthOpen} onClose={() => setHealthOpen(false)} onSave={(record) => {
        addHealthRecord(record);
        setHealthOpen(false);
        notify('健康记录已保存，并同步给家人');
      }} />

      <Modal open={assistantOpen} title="陪您聊聊" description="可以打字，也可以直接选择下面的问题。" onClose={() => setAssistantOpen(false)} size="wide">
        <div className="assistant-layout">
          <div className="assistant-state">
            <span className="assistant-orb"><Sparkles aria-hidden="true" /></span>
            <strong>小伴在听</strong>
            <small>我不是医生，但可以帮您记录、提醒和联系家人。</small>
          </div>
          <div className="assistant-chat" aria-live="polite">
            {assistantMessages.map((message, index) => (
              <div className={`chat-bubble chat-${message.from}`} key={`${message.from}-${index}`}>{message.text}</div>
            ))}
          </div>
          <div className="quick-prompts">
            {['今天天气怎么样？', '提醒我下午散步', '我有点头晕'].map((prompt) => (
              <button key={prompt} onClick={() => submitAssistant(prompt)}>{prompt}</button>
            ))}
          </div>
          <form className="assistant-input" onSubmit={sendAssistant}>
            <label className="sr-only" htmlFor="assistant-message">输入想说的话</label>
            <input id="assistant-message" value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="输入想说的话…" />
            <button className="icon-button icon-button-primary" type="submit" aria-label="发送" title="发送"><Send aria-hidden="true" /></button>
          </form>
        </div>
      </Modal>

      <Modal open={emergencyOpen} title="确认需要帮助吗？" description="确认后会立即通知紧急联系人，并共享当前位置。" onClose={() => setEmergencyOpen(false)}>
        <div className="emergency-confirm">
          <div className="emergency-contact-preview">
            <MapPin aria-hidden="true" />
            <span><strong>当前位置已准备</strong><small>杭州市青禾社区 · 仅本次求助共享</small></span>
          </div>
          <div className="emergency-contact-preview">
            <BellRing aria-hidden="true" />
            <span><strong>首先联系 {data.contacts[0].name}</strong><small>未接听将自动联系下一位</small></span>
          </div>
          <div className="modal-actions-row">
            <button className="button button-outline button-large" onClick={() => setEmergencyOpen(false)}>我没事</button>
            <button className="button button-danger button-large" onClick={triggerEmergency}><Phone aria-hidden="true" />立即求助</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function HealthRecordModal({ open, onClose, onSave }: {
  open: boolean;
  onClose: () => void;
  onSave: (record: HealthRecordInput) => void;
}) {
  const [type, setType] = useState<HealthRecordInput['type']>('blood-pressure');
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const primaryValue = Number(primary);
    const secondaryValue = Number(secondary);
    if (!Number.isFinite(primaryValue) || primaryValue <= 0) return;
    onSave({
      type,
      primaryValue,
      secondaryValue: type === 'blood-pressure' && Number.isFinite(secondaryValue) ? secondaryValue : undefined,
      note: '手动记录',
    });
    setPrimary('');
    setSecondary('');
  };

  return (
    <Modal open={open} title="记录健康数据" description="请按测量设备上显示的数字填写。" onClose={onClose}>
      <form className="form-stack senior-form" onSubmit={submit}>
        <fieldset className="segmented-field">
          <legend className="sr-only">记录类型</legend>
          {[
            { value: 'blood-pressure' as const, label: '血压' },
            { value: 'blood-sugar' as const, label: '血糖' },
            { value: 'heart-rate' as const, label: '心率' },
          ].map((item) => (
            <button type="button" className={type === item.value ? 'active' : ''} onClick={() => setType(item.value)} key={item.value}>{item.label}</button>
          ))}
        </fieldset>
        <div className="form-grid-two">
          <label className="field-label">
            <span>{type === 'blood-pressure' ? '高压' : type === 'blood-sugar' ? '血糖值' : '心率'}</span>
            <span className="number-input-wrap"><input inputMode="decimal" required value={primary} onChange={(event) => setPrimary(event.target.value)} placeholder="请输入" /><small>{type === 'blood-pressure' ? 'mmHg' : type === 'blood-sugar' ? 'mmol/L' : '次/分'}</small></span>
          </label>
          {type === 'blood-pressure' && (
            <label className="field-label">
              <span>低压</span>
              <span className="number-input-wrap"><input inputMode="numeric" required value={secondary} onChange={(event) => setSecondary(event.target.value)} placeholder="请输入" /><small>mmHg</small></span>
            </label>
          )}
        </div>
        <p className="form-help"><Clock3 aria-hidden="true" />将按当前时间保存，异常数值只做关注提醒。</p>
        <div className="modal-actions-row">
          <button className="button button-outline button-large" type="button" onClick={onClose}>取消</button>
          <button className="button button-primary button-large" type="submit"><Check aria-hidden="true" />保存记录</button>
        </div>
      </form>
    </Modal>
  );
}
