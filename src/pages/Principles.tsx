import { useMemo, useState } from 'react';
import { PRINCIPLES, GROUP_META, type PrincipleGroup } from '../content/principles';
import { PrincipleCard } from '../components/PrincipleCard';

type Filter = 'all' | PrincipleGroup;

const GROUPS: PrincipleGroup[] = ['core', 'architecture', 'verification', 'delegation', 'meta'];

export function PrinciplesPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const matched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRINCIPLES.filter((principle) => {
      const inGroup = filter === 'all' || principle.group === filter;
      if (!inGroup) return false;
      if (!q) return true;
      return [principle.zh, principle.en, principle.rule, principle.zhRule, principle.trigger]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query]);

  return (
    <div className="page page-wide">
      <p className="eyebrow">Reference · {PRINCIPLES.length} 条</p>
      <h1>原则速查</h1>
      <p className="lead">
        每一条都是"在什么时刻拦你一下"的规则。上半部分是原文，下面是中文释义、触发时机和落地动作。
      </p>

      <div className="toolbar">
        <button
          type="button"
          className={`chip ${filter === 'all' ? 'is-on' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部 {PRINCIPLES.length}
        </button>
        {GROUPS.map((group) => (
          <button
            key={group}
            type="button"
            className={`chip ${filter === group ? 'is-on' : ''}`}
            onClick={() => setFilter(group)}
          >
            {GROUP_META[group].zh} {PRINCIPLES.filter((item) => item.group === group).length}
          </button>
        ))}
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜中文、英文、触发场景…"
          aria-label="搜索原则"
        />
      </div>

      {GROUPS.map((group) => {
        const items = matched.filter((principle) => principle.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group}>
            <div className="group-head">
              <h2>{GROUP_META[group].zh}</h2>
              <p className="group-note">{GROUP_META[group].blurb}</p>
            </div>
            {items.map((principle) => (
              <PrincipleCard principle={principle} key={principle.id} />
            ))}
          </section>
        );
      })}

      {matched.length === 0 && <p className="empty">没有匹配的原则。换个词试试，或者清空搜索。</p>}
    </div>
  );
}
