import type { Block } from '../content/types';
import { PLAYBOOK_BY_ID } from '../content/playbooks';
import { PrincipleById } from './PrincipleCard';
import { Quiz } from './Quiz';
import { VisualById } from './Visuals';

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
    // md 正文：标题、段落、列表、行内格式都由 markdown-it 处理好了。
    // display: contents 让这层 div 不参与布局，避免打断 .prose 的间距规则。
    case 'html':
      return <div className="md-block" dangerouslySetInnerHTML={{ __html: block.html }} />;
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
    case 'visual':
      return <VisualById id={block.id} />;
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
