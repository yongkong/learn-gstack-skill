import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'pstack-study:progress:v1';

export interface Progress {
  /** lessonId -> 首次打开的时间戳 */
  visited: Record<string, number>;
  /** quizId -> 最近一次作答 */
  quizzes: Record<string, { choice: number; correct: boolean }>;
}

const EMPTY: Progress = { visited: {}, quizzes: {} };

function read(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { visited: parsed.visited ?? {}, quizzes: parsed.quizzes ?? {} };
  } catch {
    return EMPTY;
  }
}

let state: Progress = read();
const listeners = new Set<() => void>();

function commit(next: Progress): void {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 隐私模式下写不进去，就当本次会话有效
  }
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot(): Progress {
  return state;
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function markVisited(lessonId: string): void {
  if (state.visited[lessonId]) return;
  commit({ ...state, visited: { ...state.visited, [lessonId]: Date.now() } });
}

export function answerQuiz(quizId: string, choice: number, correct: boolean): void {
  commit({ ...state, quizzes: { ...state.quizzes, [quizId]: { choice, correct } } });
}

export function clearQuiz(quizId: string): void {
  const { [quizId]: _dropped, ...rest } = state.quizzes;
  commit({ ...state, quizzes: rest });
}

export function resetProgress(): void {
  commit({ ...EMPTY, visited: {}, quizzes: {} });
}
