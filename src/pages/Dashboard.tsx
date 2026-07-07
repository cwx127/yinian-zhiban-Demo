import { Bell, HeartPulse, Users, PhoneCall } from 'lucide-react';
import { Button, Card, Tag } from '../components';
import { reminders, healthStats } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';

const iconMap = {
  bell: Bell,
  heartpulse: HeartPulse,
  users: Users,
  phonecall: PhoneCall,
};

function StatStrip() {
  return (
    <div className="flex gap-6 py-6 border-y border-border mx-8">
      <div className="flex-1 text-center">
        <div className="font-heading text-h2 text-teal-500 tabular-nums">{healthStats.sleepHours}</div>
        <div className="font-body text-caption text-muted-foreground mt-1">昨晚睡眠（小时）</div>
      </div>
      <div className="flex-1 text-center">
        <div className="font-heading text-h2 text-teal-500 tabular-nums">{healthStats.steps.toLocaleString()}</div>
        <div className="font-body text-caption text-muted-foreground mt-1">今日步数</div>
      </div>
      <div className="flex-1 text-center">
        <div className="font-heading text-h2 text-teal-500 tabular-nums">{healthStats.bloodPressure}</div>
        <div className="font-body text-caption text-muted-foreground mt-1">血压 mmHg</div>
      </div>
      <div className="flex-1 text-center">
        <div className="font-heading text-h2 text-teal-500 tabular-nums">{healthStats.temperature}</div>
        <div className="font-body text-caption text-muted-foreground mt-1">体温 °C</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-teal-500 text-white py-16 px-6 text-center">
        <h1 className="font-display text-display font-bold mb-2">颐年智伴</h1>
        <p className="font-body text-lead opacity-90 mb-6 max-w-xl mx-auto">
          温暖守护每一天，让科技陪伴银发生活
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="primary" size="lg">开始使用</Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/40 text-white/90 hover:bg-white/10"
          >
            了解更多
          </Button>
        </div>
      </div>

      {/* Stats Strip */}
      <StatStrip />

      {/* Reminder Cards */}
      <div className="py-10 px-6">
        <h2 className="font-heading text-h2 text-foreground mb-2">智能提醒</h2>
        <p className="font-body text-body text-muted-foreground mb-6 max-w-xl">
          今日待办与健康提醒，一切尽在掌握
        </p>
        <div className="grid grid-cols-2 gap-6">
          {reminders.map((reminder, index) => {
            const IconComponent = iconMap[reminder.icon as keyof typeof iconMap] || Bell;
            return (
              <Card
                key={index}
                icon={IconComponent}
                title={reminder.title}
                desc={reminder.desc}
                tag={<Tag variant={reminder.tagClass}>{reminder.tag}</Tag>}
                onClick={() => {
                  if (index === 0) setCurrentPage('health');
                }}
              >
                <div className="mt-3">
                  <Button 
                    variant={index === 0 ? 'primary' : 'ghost'} 
                    size="md"
                  >
                    {index === 0 ? '查看详情' : index === 2 ? '查看照片' : '了解更多'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}