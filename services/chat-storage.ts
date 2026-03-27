import { readSecureJson, writeSecureJson } from '@/core/storage/secure-store-json';

const THREADS_KEY = 'fresh_app_chat_threads';

export type ChatThread = {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
};

export async function getThreads(): Promise<ChatThread[]> {
  try {
    const threads = await readSecureJson<ChatThread[]>(THREADS_KEY, []);
    return threads.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function saveThread(thread: ChatThread): Promise<void> {
  const threads = await getThreads();
  const idx = threads.findIndex((t) => t.id === thread.id);
  if (idx >= 0) {
    threads[idx] = thread;
  } else {
    threads.unshift(thread);
  }
  await writeSecureJson(THREADS_KEY, threads);
}

export async function deleteThread(id: string): Promise<void> {
  const threads = await getThreads();
  const filtered = threads.filter((t) => t.id !== id);
  await writeSecureJson(THREADS_KEY, filtered);
}

export function createThreadId(): string {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
