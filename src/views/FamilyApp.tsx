import {
  Activity,
  Bell,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileHeart,
  HeartHandshake,
  HeartPulse,
  Home,
  MapPin,
  MessageSquareText,
  MoreHorizontal,
  Phone,
  Pill,
  Plus,
  RefreshCcw,
  Send,
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  UserRound,
  Users,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Modal } from '../components/Modal';
import {
  latestBloodPressure,
  medicationLogFor,
  medicationProgress,
  sortMedicationTimes,
} from '../domain';
import { useStore } from '../store';
import type { MedicationInput } from '../types';

type FamilySection = 'overview' | 'medications' | 'care' | 'settings';

type FamilyAppProps = {
  notify: (message: string, tone?: 'success' | 'info') => void;
};

const formatClock = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));

const formatDayTime = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));

const eventIcon = {
  normal: CheckCircle2,
  attention: CircleAlert,
  urgent: BellRing,
};

export function FamilyApp({ notify }: FamilyAppProps) {
  const {
    data,
    addMedication,
    toggleMedication,
    addFamilyMessage,
    acknowledgeEvent,
    resetDemo,
  } = useStore();
  const [section, setSection] = useState<FamilySection>('overview');
  const [messageOpen, setMessageOpen] = useState(false);
  const [medicationOpen, setMedicationOpen] = useState(false);
  const [message, setMessage] = useState('');
  const progress = medicationProgress(data);
  const latestBp = latestBloodPressure(data);
  const schedule = useMemo(() => sortMedicationTimes(data.medications), [data.medications]);
  const attentionCount = data.events.filter((event) => !event.acknowledged && event.level !== 'normal').length;

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    addFamilyMessage(message.trim());
    setMessage('');
    setMessageOpen(false);
    notify('留言已发送，将在老人端醒目显示');
  };

  const navItems = [
    { id: 'overview' as const, label: '安心总览', icon: Home },
    { id: 'medications' as const, label: '用药管理', icon: Pill },
    { id: 'care' as const, label: '关怀记录', icon: HeartHandshake, badge: attentionCount },
    { id: 'settings' as const, label: '家庭设置', icon: Settings },
  ];

  return (
    <div className="family-app-shell">
      <aside className="family-sidebar">
        <div className="family-profile-mini">
          <span className="avatar avatar-large">王</span>
          <div><strong>{data.senior.name}</strong><small>妈妈 · {data.senior.city}</small></div>
          <span className="online-dot" title="设备在线" />
        </div>
        <nav aria-label="家属端主导航">
          {navItems.map((item) => (
            <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>
              <item.icon aria-hidden="true" /><span>{item.label}</span>
              {!!item.badge && <small className="nav-badge">{item.badge}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-assurance">
          <ShieldCheck aria-hidden="true" />
          <div><strong>隐私授权正常</strong><small>健康数据仅家庭成员可见</small></div>
        </div>
      </aside>

      <main className="family-main">
        <header className="family-page-header">
          <div>
            <span className="eyebrow">家庭照护台</span>
            <h1>{section === 'overview' ? `${data.senior.name}今天状态平稳` : navItems.find((item) => item.id === section)?.label}</h1>
            <p>{section === 'overview' ? `最近活动 ${formatClock(data.senior.lastActiveAt)} · 设备在线 · 家中` : '远程配置会同步到老人端。'}</p>
          </div>
          <div className="family-header-actions">
            <a className="icon-button icon-button-soft" href={`tel:${data.contacts[0].phone.replace(/\s/g, '')}`} aria-label="给妈妈打电话" title="打电话"><Phone aria-hidden="true" /></a>
            <button className="button button-primary" onClick={() => setMessageOpen(true)}><MessageSquareText aria-hidden="true" />发留言</button>
          </div>
        </header>

        {section === 'overview' && (
          <>
            <section className="reassurance-band" aria-label="老人今日安全状态">
              <div className="reassurance-icon"><ShieldCheck aria-hidden="true" /></div>
              <div><strong>今日已报平安</strong><p>07:35 完成早间问候，未发现紧急异常</p></div>
              <div className="reassurance-location"><MapPin aria-hidden="true" /><span><strong>家中</strong><small>定位仅在求助时共享</small></span></div>
              <span className="status-badge status-good">一切正常</span>
            </section>

            <div className="family-metric-grid">
              <article className="metric-card metric-medicine">
                <div className="metric-head"><span>今日服药</span><span className="metric-icon"><Pill aria-hidden="true" /></span></div>
                <strong>{progress.taken}<small> / {progress.total} 次</small></strong>
                <div className="progress-track"><span style={{ width: `${progress.percentage}%` }} /></div>
                <p>{progress.taken === progress.total ? '今日计划已完成' : `还有 ${progress.total - progress.taken} 次待确认`}</p>
              </article>
              <article className="metric-card metric-health">
                <div className="metric-head"><span>最近血压</span><span className="metric-icon"><HeartPulse aria-hidden="true" /></span></div>
                <strong>{latestBp?.primaryValue ?? '--'}<small> / {latestBp?.secondaryValue ?? '--'} mmHg</small></strong>
                <span className="metric-status-good">处于个人日常范围</span>
                <p>{latestBp ? `${formatClock(latestBp.recordedAt)} 手动记录` : '暂无记录'}</p>
              </article>
              <article className="metric-card metric-attention">
                <div className="metric-head"><span>待关注</span><span className="metric-icon"><Bell aria-hidden="true" /></span></div>
                <strong>{attentionCount}<small> 件</small></strong>
                <span className={attentionCount ? 'metric-status-warn' : 'metric-status-good'}>{attentionCount ? '建议今天处理' : '暂无待办'}</span>
                <p>来自提醒和异常事件</p>
              </article>
            </div>

            <div className="family-dashboard-grid">
              <section className="family-panel" aria-labelledby="today-medication-title">
                <div className="panel-title-row">
                  <div><span className="eyebrow">今日计划</span><h2 id="today-medication-title">用药进度</h2></div>
                  <button className="text-button" onClick={() => setSection('medications')}>管理计划 <ChevronRight aria-hidden="true" /></button>
                </div>
                <div className="family-medication-list">
                  {schedule.map(({ medication, time }) => {
                    const log = medicationLogFor(data.medicationLogs, medication.id, time);
                    return (
                      <article className="family-medication-row" key={`${medication.id}-${time}`}>
                        <time>{time}</time>
                        <span className={`schedule-marker ${log ? 'complete' : ''}`}>{log ? <Check aria-hidden="true" /> : <Clock3 aria-hidden="true" />}</span>
                        <div><strong>{medication.name}</strong><small>{medication.dosage} · {medication.instruction}</small></div>
                        {log ? (
                          <span className="status-badge status-good">{formatClock(log.confirmedAt)} 已服</span>
                        ) : (
                          <button className="button button-outline button-small" onClick={() => notify(`已向${data.senior.preferredName}发送温和提醒`, 'info')}><Bell aria-hidden="true" />提醒</button>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="family-panel" aria-labelledby="event-title">
                <div className="panel-title-row">
                  <div><span className="eyebrow">照护动态</span><h2 id="event-title">今天发生的事</h2></div>
                  <button className="icon-button" title="更多动态" aria-label="查看更多动态" onClick={() => setSection('care')}><MoreHorizontal aria-hidden="true" /></button>
                </div>
                <div className="event-timeline">
                  {data.events.slice(0, 4).map((careEvent) => {
                    const EventIcon = eventIcon[careEvent.level];
                    return (
                      <article className={`timeline-event event-${careEvent.level}`} key={careEvent.id}>
                        <span className="timeline-icon"><EventIcon aria-hidden="true" /></span>
                        <div><strong>{careEvent.title}</strong><p>{careEvent.detail}</p><small>{formatClock(careEvent.occurredAt)}</small></div>
                        {!careEvent.acknowledged && <button className="text-button" onClick={() => {
                          acknowledgeEvent(careEvent.id);
                          notify('已标记为已关注');
                        }}>我知道了</button>}
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="family-dashboard-grid family-dashboard-grid-secondary">
              <section className="family-panel">
                <div className="panel-title-row"><div><span className="eyebrow">健康趋势</span><h2>近三次血压</h2></div><span className="status-badge status-good">平稳</span></div>
                <div className="bp-trend" aria-label="近三次收缩压趋势">
                  {data.healthRecords.filter((record) => record.type === 'blood-pressure').slice(0, 3).reverse().map((record) => (
                    <div className="bp-bar-item" key={record.id}>
                      <span className="bp-bar-value">{record.primaryValue}/{record.secondaryValue}</span>
                      <div className="bp-bar-track"><span style={{ height: `${Math.max(28, Math.min(96, (record.primaryValue - 80) * 1.3))}%` }} /></div>
                      <small>{new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(new Date(record.recordedAt))}</small>
                    </div>
                  ))}
                </div>
              </section>
              <section className="family-panel latest-message-panel">
                <div className="panel-title-row"><div><span className="eyebrow">最近关怀</span><h2>给妈妈的留言</h2></div></div>
                {data.messages[0] ? (
                  <blockquote>“{data.messages[0].text}”<footer>{data.messages[0].author} · {formatClock(data.messages[0].sentAt)}</footer></blockquote>
                ) : <p className="empty-copy">还没有留言。</p>}
                <button className="button button-secondary button-full" onClick={() => setMessageOpen(true)}><MessageSquareText aria-hidden="true" />再发一条</button>
              </section>
            </div>
          </>
        )}

        {section === 'medications' && (
          <section className="family-section-content">
            <div className="content-toolbar">
              <div><span className="eyebrow">当前共 {data.medications.length} 种药</span><h2>服药计划</h2><p>修改后会同步到老人端。请按医生或药师给出的方案填写。</p></div>
              <button className="button button-primary" onClick={() => setMedicationOpen(true)}><Plus aria-hidden="true" />添加用药</button>
            </div>
            <div className="managed-medication-list">
              {data.medications.map((medication) => (
                <article className={`managed-medication ${medication.enabled ? '' : 'disabled'}`} key={medication.id}>
                  <span className="managed-med-icon"><Pill aria-hidden="true" /></span>
                  <div className="managed-med-main">
                    <div className="managed-med-title"><h3>{medication.name}</h3><span className={medication.enabled ? 'status-badge status-good' : 'status-badge'}>{medication.enabled ? '提醒中' : '已暂停'}</span></div>
                    <p>{medication.dosage} · {medication.instruction}</p>
                    <div className="time-chip-row">{medication.times.map((time) => <span key={time}><Clock3 aria-hidden="true" />{time}</span>)}</div>
                  </div>
                  <div className="managed-med-side"><small>约剩 {medication.remainingDays} 天</small><button className="icon-button icon-button-soft" onClick={() => {
                    toggleMedication(medication.id);
                    notify(medication.enabled ? '该用药提醒已暂停' : '该用药提醒已恢复', 'info');
                  }} aria-label={medication.enabled ? `暂停${medication.name}` : `恢复${medication.name}`} title={medication.enabled ? '暂停提醒' : '恢复提醒'}>{medication.enabled ? <ToggleRight aria-hidden="true" /> : <ToggleLeft aria-hidden="true" />}</button></div>
                </article>
              ))}
            </div>
            <div className="compliance-note"><FileHeart aria-hidden="true" /><div><strong>用药安全边界</strong><p>本产品仅按已配置计划提醒，不会自动开药、换药或调整剂量。</p></div></div>
          </section>
        )}

        {section === 'care' && (
          <section className="family-section-content">
            <div className="content-toolbar"><div><span className="eyebrow">家庭协同</span><h2>关怀与事件</h2><p>集中查看留言、提醒和需要跟进的事项。</p></div><button className="button button-primary" onClick={() => setMessageOpen(true)}><Send aria-hidden="true" />发新留言</button></div>
            <div className="care-columns">
              <section className="family-panel">
                <div className="panel-title-row"><div><span className="eyebrow">事件记录</span><h2>需要关注</h2></div></div>
                <div className="care-event-list">
                  {data.events.map((careEvent) => {
                    const EventIcon = eventIcon[careEvent.level];
                    return <article className={`care-event-row event-${careEvent.level}`} key={careEvent.id}><span className="timeline-icon"><EventIcon aria-hidden="true" /></span><div><strong>{careEvent.title}</strong><p>{careEvent.detail}</p><small>{formatDayTime(careEvent.occurredAt)}</small></div>{careEvent.acknowledged ? <span className="status-badge">已查看</span> : <button className="button button-outline button-small" onClick={() => acknowledgeEvent(careEvent.id)}>确认关注</button>}</article>;
                  })}
                </div>
              </section>
              <section className="family-panel">
                <div className="panel-title-row"><div><span className="eyebrow">留言记录</span><h2>家庭留言</h2></div></div>
                <div className="family-message-list">
                  {data.messages.map((item) => <article key={item.id}><span className="avatar avatar-warm">静</span><div><strong>{item.author}</strong><p>{item.text}</p><small>{formatDayTime(item.sentAt)} · {item.played ? '老人端已播放' : '等待播放'}</small></div></article>)}
                </div>
              </section>
            </div>
          </section>
        )}

        {section === 'settings' && (
          <section className="family-section-content">
            <div className="content-toolbar"><div><span className="eyebrow">家庭与安全</span><h2>紧急联系人</h2><p>求助时按以下顺序依次联系。</p></div></div>
            <div className="settings-grid">
              <section className="family-panel contact-settings">
                {data.contacts.map((contact) => (
                  <article key={contact.id}><span className="contact-priority">{contact.priority}</span><span className="avatar">{contact.name.slice(0, 1)}</span><div><strong>{contact.name}</strong><p>{contact.relation} · {contact.phone}</p></div><button className="icon-button" aria-label={`编辑${contact.name}`} title="编辑联系人"><MoreHorizontal aria-hidden="true" /></button></article>
                ))}
                <button className="button button-outline button-full" onClick={() => notify('联系人编辑功能已进入演示队列', 'info')}><Plus aria-hidden="true" />添加联系人</button>
              </section>
              <aside className="family-panel privacy-panel"><ShieldCheck aria-hidden="true" /><h2>数据与授权</h2><p>健康、定位和语音数据均按用途单独授权。位置仅在紧急求助时共享。</p><dl><div><dt>健康数据</dt><dd>已授权</dd></div><div><dt>紧急定位</dt><dd>仅求助时</dd></div><div><dt>语音原文件</dt><dd>不长期保存</dd></div></dl></aside>
            </div>
            <button className="reset-demo-button" onClick={() => { resetDemo(); notify('演示数据已恢复'); }}><RefreshCcw aria-hidden="true" />恢复演示数据</button>
          </section>
        )}
      </main>

      <nav className="family-bottom-nav" aria-label="家属端移动导航">
        {navItems.map((item) => <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}><item.icon aria-hidden="true" /><span>{item.label.slice(0, 2)}</span>{!!item.badge && <small className="nav-badge">{item.badge}</small>}</button>)}
      </nav>

      <Modal open={messageOpen} title="给妈妈留言" description="留言会在老人端首页醒目显示，并可一键朗读。" onClose={() => setMessageOpen(false)}>
        <form className="form-stack" onSubmit={sendMessage}>
          <label className="field-label"><span>留言内容</span><textarea rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="例如：妈妈，下午我给您打电话。" maxLength={100} required /></label>
          <div className="suggestion-row">{['记得按时吃饭', '我晚上给您打电话', '天气热，出门带水'].map((text) => <button type="button" key={text} onClick={() => setMessage(text)}>{text}</button>)}</div>
          <div className="modal-actions-row"><button type="button" className="button button-outline" onClick={() => setMessageOpen(false)}>取消</button><button className="button button-primary" type="submit"><Send aria-hidden="true" />发送留言</button></div>
        </form>
      </Modal>

      <MedicationModal open={medicationOpen} onClose={() => setMedicationOpen(false)} onSave={(medication) => {
        addMedication(medication);
        setMedicationOpen(false);
        notify('用药计划已保存并同步到老人端');
      }} />
    </div>
  );
}

function MedicationModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (value: MedicationInput) => void }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1片');
  const [time, setTime] = useState('08:00');
  const [instruction, setInstruction] = useState('早餐后服用');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({ name: name.trim(), dosage: dosage.trim(), times: [time], instruction: instruction.trim() });
    setName('');
  };

  return (
    <Modal open={open} title="添加用药计划" description="请严格按照医生或药师给出的方案填写。" onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label className="field-label"><span>药品名称</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：阿司匹林肠溶片" required /></label>
        <div className="form-grid-two">
          <label className="field-label"><span>每次用量</span><input value={dosage} onChange={(event) => setDosage(event.target.value)} required /></label>
          <label className="field-label"><span>提醒时间</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
        </div>
        <label className="field-label"><span>服用说明</span><select value={instruction} onChange={(event) => setInstruction(event.target.value)}><option>早餐后服用</option><option>随餐服用</option><option>睡前服用</option><option>按医嘱服用</option></select></label>
        <div className="form-safety-inline"><CircleAlert aria-hidden="true" /><span>如方案有变化，请先咨询医生或药师。</span></div>
        <div className="modal-actions-row"><button className="button button-outline" type="button" onClick={onClose}>取消</button><button className="button button-primary" type="submit"><Check aria-hidden="true" />保存计划</button></div>
      </form>
    </Modal>
  );
}
