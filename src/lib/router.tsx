import { useSyncExternalStore, type ReactNode } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function read(): string {
  const raw = window.location.hash.replace(/^#/, '');
  return raw === '' ? '/' : raw;
}

/** 当前路由。用 hash 路由是为了让这个站能直接双击 index.html 打开，也能静态托管。 */
export function useRoute(): string {
  return useSyncExternalStore(subscribe, read, () => '/');
}

export function Link({
  to,
  children,
  className,
  ariaCurrent,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  ariaCurrent?: boolean;
}) {
  return (
    <a className={className} href={`#${to}`} aria-current={ariaCurrent ? 'page' : undefined}>
      {children}
    </a>
  );
}
