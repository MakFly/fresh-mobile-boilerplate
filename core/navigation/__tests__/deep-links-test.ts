import { normalizeInboundPath } from '@/core/navigation/deep-links';

describe('normalizeInboundPath', () => {
  test('maps legacy auth routes to the current public stack', () => {
    expect(normalizeInboundPath('freshapp://login')).toBe('/(public)/sign-in');
    expect(normalizeInboundPath('https://app.example.com/register')).toBe('/(public)/sign-up');
    expect(normalizeInboundPath('/reset-password')).toBe('/(public)/forgot-password');
  });

  test('maps sample chat routes to the current sample stack', () => {
    expect(normalizeInboundPath('freshapp://chat')).toBe('/samples/chat');
    expect(normalizeInboundPath('https://app.example.com/chat/thread-42')).toBe(
      '/samples/chat/thread?threadId=thread-42'
    );
  });

  test('preserves already-correct thread routes', () => {
    expect(normalizeInboundPath('/samples/chat/thread?threadId=abc')).toBe(
      '/samples/chat/thread?threadId=abc'
    );
  });

  test('passes through unrelated routes', () => {
    expect(normalizeInboundPath('/')).toBe('/');
    expect(normalizeInboundPath('freshapp://unknown/path')).toBe('/unknown/path');
  });
});
