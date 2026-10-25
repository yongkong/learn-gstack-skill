import { PRINCIPLES, GROUP_META, type Principle } from '../content/principles';

export function PrincipleCard({ principle }: { principle: Principle }) {
  const group = GROUP_META[principle.group];
  return (
    <article className="principle" id={`principle-${principle.id}`}>
      <div className="principle-top">
        <span className="principle-zh">{principle.zh}</span>
        <span className="principle-en">{principle.en}</span>
        <span className="tag">{group.zh}</span>
      </div>
      <p className="principle-rule">“{principle.rule}”</p>
      <p className="principle-zhr">{principle.zhRule}</p>
      <p className="principle-trigger">
        <b>何时想起</b>
        {principle.trigger}
      </p>
      <ol>
        {principle.howTo.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </article>
  );
}

export function PrincipleById({ id }: { id: string }) {
  const principle = PRINCIPLES.find((item) => item.id === id);
  if (!principle) return null;
  return <PrincipleCard principle={principle} />;
}
