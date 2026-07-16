import { describe, expect, it } from 'vitest';
import { classifyMessageRisk, companionReply, medicationProgress } from './domain';
import { createDemoData } from './data';

describe('message risk guardrails', () => {
  it('routes emergency language to the emergency flow', () => {
    expect(classifyMessageRisk('我摔倒了，胸口疼')).toBe('emergency');
  });

  it('blocks medication adjustment advice', () => {
    expect(classifyMessageRisk('这个药可以减药吗')).toBe('medication');
    expect(companionReply('这个药可以减药吗')).toContain('不能替您加药、停药或换药');
  });
});

describe('medication progress', () => {
  it("counts today's confirmed doses against the configured schedule", () => {
    const data = createDemoData();
    expect(medicationProgress(data)).toEqual({ taken: 1, total: 3, percentage: 33 });
  });
});
