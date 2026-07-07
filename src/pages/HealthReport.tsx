import { CloudSun, Activity, Pill, Moon, Droplets, Footprints, Thermometer } from 'lucide-react';
import { Button, Card, Tag } from '../components';
import { healthItems, weatherInfo } from '../data/mockData';

const iconMap = {
  activity: Activity,
  pill: Pill,
  moon: Moon,
  droplets: Droplets,
  footprints: Footprints,
  thermometer: Thermometer,
};

export function HealthReport() {
  return (
    <div className="py-10 px-6">
      <h2 className="font-heading text-h2 text-foreground mb-2">健康日报</h2>
      <p className="font-body text-body text-muted-foreground mb-6 max-w-xl">
        今日各项健康指标一览
      </p>

      {/* Weather Card */}
      <Card
        variant="outlined"
        icon={CloudSun}
        iconColor="text-teal-500"
        title="今日天气"
        className="mb-6 bg-teal-50 border-teal-500"
        tag={<Tag variant="default">{weatherInfo.condition}</Tag>}
      >
        <p className="font-body text-body text-teal-700 mb-0">{weatherInfo.desc}</p>
      </Card>

      {/* Health Items List */}
      <div className="flex flex-col gap-3">
        {healthItems.map((item, index) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Activity;
          return (
            <div
              key={index}
              className="flex items-center gap-4 py-4 px-4 bg-surface rounded-radius-xl border border-border"
            >
              <div className="w-10 h-10 rounded-radius-full bg-teal-50 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5 text-teal-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-body text-foreground mb-0.5 truncate">{item.title}</p>
                <p className="font-body text-caption text-muted-foreground mb-0 truncate">{item.desc}</p>
              </div>
              <div className="shrink-0">
                <Tag variant={item.statusClass}>{item.status}</Tag>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 items-center">
        <Button variant="primary" size="md" disabled>导出报告</Button>
        <Button variant="secondary" size="md">分享给家人</Button>
      </div>
    </div>
  );
}