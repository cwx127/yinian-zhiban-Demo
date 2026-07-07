import { useState } from 'react';
import { Input, Button, Modal } from '../components';
import { userProfile } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';

export function Settings() {
  const [formData, setFormData] = useState({
    name: userProfile.name,
    age: userProfile.age.toString(),
    phone: userProfile.phone,
    emergencyContact: userProfile.emergencyContact,
    medicationTimes: userProfile.medicationTimes.join('、'),
    address: userProfile.address,
    verificationCode: '',
  });

  const [showError, setShowError] = useState(false);
  const openModal = useAppStore((state) => state.openModal);

  const handleSave = () => {
    if (!formData.verificationCode) {
      setShowError(true);
      return;
    }
    setShowError(false);
    openModal('设置已保存', '您的个人信息与偏好设置已更新成功');
  };

  return (
    <div className="py-10 px-6">
      <h2 className="font-heading text-h2 text-foreground mb-2">个人设置</h2>
      <p className="font-body text-body text-muted-foreground mb-6 max-w-xl">
        管理您的个人信息与偏好设置
      </p>

      <div className="flex flex-col gap-6 max-w-xl">
        {/* Name and Age */}
        <div className="flex gap-4">
          <Input
            label="姓名"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            placeholder="请输入姓名"
            className="flex-1"
          />
          <Input
            label="年龄"
            value={formData.age}
            onChange={(v) => setFormData({ ...formData, age: v })}
            placeholder="请输入年龄"
            className="flex-1"
          />
        </div>

        {/* Phone */}
        <Input
          label="手机号码"
          value={formData.phone}
          onChange={(v) => setFormData({ ...formData, phone: v })}
          placeholder="请输入手机号码"
        />

        {/* Emergency Contact */}
        <Input
          label="紧急联系人"
          value={formData.emergencyContact}
          onChange={(v) => setFormData({ ...formData, emergencyContact: v })}
          placeholder="请输入紧急联系人"
        />

        {/* Medication Times */}
        <Input
          label="用药提醒时间"
          value={formData.medicationTimes}
          onChange={(v) => setFormData({ ...formData, medicationTimes: v })}
          placeholder="请设置提醒时间"
          helperText="每日三次，服药后请点击确认"
        />

        {/* Address */}
        <Input
          label="详细地址"
          value={formData.address}
          onChange={(v) => setFormData({ ...formData, address: v })}
          placeholder="请输入地址"
        />

        {/* Verification Code (with error) */}
        <Input
          label="验证码"
          value={formData.verificationCode}
          onChange={(v) => {
            setFormData({ ...formData, verificationCode: v });
            if (v) setShowError(false);
          }}
          placeholder="请输入验证码"
          error={showError}
          errorText={showError ? '验证码不正确，请重新输入' : undefined}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-2 items-center">
          <Button variant="primary" size="lg" onClick={handleSave}>保存设置</Button>
          <Button variant="outline" size="md">取消</Button>
        </div>
      </div>
    </div>
  );
}