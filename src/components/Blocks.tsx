import type { Block } from '../content/types';
import { PLAYBOOK_BY_ID } from '../content/playbooks';
import { PrincipleById } from './PrincipleCard';
import { Quiz } from './Quiz';

export function Blocks({ blocks, scope }: { blocks: Block[]; scope?: string }) {
  return (
    <div className="prose">
      {blocks.map((block, index) => (
        <BlockView block={block} scope={scope} key={`${block.kind}-${index}`} />
      ))}
    </div>
  );
}

function BlockView({ block, scope }: { block: Block; scope?: string }) {
  switch (block.kind) {
    case 'lead':
      return <p className="lead">{block.text}</p>;
    case 'p':
      return <p>{block.text}</p>;
    case 'h':
      return <h2>{block.text}</h2>;
    case 'list':
      return block.ordered ? (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <div className={`callout ${block.tone}`}>
          <span className="callout-title">{block.title}</span>
          {block.text}
        </div>
      );
    case 'code':
      return (
        <div className="code">
          {block.label && <div className="code-label">{block.label}</div>}
          <pre>{block.text}</pre>
        </div>
      );
    case 'quote':
      return (
        <blockquote>
          “{block.text}”
          {block.source && <cite>{block.source}</cite>}
        </blockquote>
      );
    case 'principles':
      return (
        <>
          {block.ids.map((id) => (
            <PrincipleById id={id} key={id} />
          ))}
        </>
      );
    case 'playbooks':
      return (
        <>
          {block.ids.map((id) => {
            const playbook = PLAYBOOK_BY_ID.get(id);
            if (!playbook) return null;
            return (
              <div className="pb-item" key={id}>
                <div className="pb-name">
                  {playbook.zh}
                  <span>{playbook.en}</span>
                </div>
                <div className="pb-body">
                  {playbook.purpose}
                  <div className="pb-when">
                    <b>什么时候走这条</b>
                    {playbook.when}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      );
    case 'quiz':
      return <Quiz quiz={block} scope={scope} />;
    case 'source':
      return (
        <div className="source">
          <span className="source-label">读这个 primary source</span>
          <a href={block.url} target="_blank" rel="noreferrer">
            {block.label}
          </a>
          <p className="source-why">{block.why}</p>
        </div>
      );
    default:
      return null;
  }
}
