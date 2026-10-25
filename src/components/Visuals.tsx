import { Fragment } from 'react';
import type { Visual } from '../content/types';
import { VISUAL_BY_ID } from '../content/visuals';
import { curriculumFor } from '../content/curriculum';
import { Link } from '../lib/router';

/**
 * 图解渲染。每种 kind 对应一种「问题的形状」，不是同一个模板换皮：
 *   gates    → 有顺序的判断，命中即停
 *   diff     → 两版实现的差异，用增删行看
 *   grid     → 状态空间的笛卡尔积，标出不该存在的组合
 *   layers   → 校验散落 vs 收在门口
 *   timeline → 同一动作重复执行，结果会不会变
 */
export function VisualById({ id }: { id: string }) {
  const visual = VISUAL_BY_ID.get(id);
  if (!visual) {
    // 故意渲染成可见的错误，而不是静默返回 null：图丢了要一眼看见。
    return <div className="viz viz-broken">图解「{id}」没有定义</div>;
  }

  const lesson = visual.lessonId ? curriculumFor(visual.lessonId) : undefined;

  return (
    <figure className="viz">
      <figcaption className="viz-head">
        <span className="viz-title">{visual.title}</span>
        {lesson && (
          <Link to={`/lesson/${lesson.lessonId}`} className="viz-lesson">
            第 {String(lesson.no).padStart(2, '0')} 课 · {lesson.title}
          </Link>
        )}
      </figcaption>

      <VisualBody visual={visual} />

      {visual.note && <p className="viz-note">{visual.note}</p>}
    </figure>
  );
}

/** 增删符号不能在类名里直接用（`is-+` 选择器要转义），映射成词。 */
const SIGN_CLASS: Record<' ' | '+' | '-' | '~', string> = {
  ' ': 'ctx',
  '+': 'add',
  '-': 'del',
  '~': 'mod',
};

function VisualBody({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case 'gates':
      return (
        <>
          <ol className="gates">
            {visual.gates.map((gate, index) => (
              <li className="gate" key={gate.question}>
                <span className="gate-no">{index + 1}</span>
                <span className="gate-question">{gate.question}</span>
                <span className="gate-hit">{gate.onHit}</span>
              </li>
            ))}
          </ol>
          <div className="outcome">
            {visual.outcome.map((item) => (
              <div className="outcome-item" key={item.label}>
                <span className="outcome-label">{item.label}</span>
                <b className="outcome-value">{item.value}</b>
              </div>
            ))}
          </div>
        </>
      );

    case 'diff':
      return (
        <>
          <p className="diff-requirement">
            <span>需求</span>
            {visual.requirement}
          </p>
          <div className="diff-panels">
            {visual.panels.map((panel) => (
              <div className={`diff-panel ${panel.tone}`} key={panel.label}>
                <div className="diff-head">
                  <span>{panel.label}</span>
                  <b>{panel.net}</b>
                </div>
                <pre className="diff-body">
                  {panel.lines.map((line, index) => (
                    <span className={`diff-line ${SIGN_CLASS[line.sign]}`} key={index}>
                      <i className="diff-sign">{line.sign === ' ' ? '' : line.sign}</i>
                      {line.text}
                    </span>
                  ))}
                </pre>
              </div>
            ))}
          </div>
        </>
      );

    case 'grid':
      return (
        <>
          <div
            className="state-grid"
            style={{ gridTemplateColumns: `minmax(0,140px) repeat(${visual.cols.length}, minmax(0,1fr))` }}
          >
            <span />
            {visual.cols.map((col) => (
              <span className="state-col" key={col}>
                {col}
              </span>
            ))}
            {visual.rows.map((row, rowIndex) => (
              <Fragment key={row}>
                <span className="state-row">{row}</span>
                {visual.cols.map((col, colIndex) => {
                  const state = visual.cells[rowIndex * visual.cols.length + colIndex];
                  return (
                    <span className={`state-cell ${state}`} key={col} title={`${row} + ${col}`}>
                      {state === 'legal' ? '✓' : '✗'}
                    </span>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div className="state-after">
            <span className="state-after-label">{visual.after.label}</span>
            <span className="state-after-states">
              {visual.after.states.map((state) => (
                <span className="state-chip" key={state}>
                  {state}
                </span>
              ))}
            </span>
          </div>
          <p className="state-legend">
            <span className="state-key legal">✓</span>有意义的状态
            <span className="state-key illegal">✗</span>类型允许，但业务上不该存在
          </p>
        </>
      );

    case 'layers':
      return (
        <div className="layer-panels">
          {visual.panels.map((panel) => (
            <div className={`layer-panel ${panel.tone}`} key={panel.label}>
              <div className="layer-head">{panel.label}</div>
              <div className="layer-stack">
                {panel.layers.map((layer) => (
                  <div className={`layer ${layer.guards ? 'has-guard' : ''}`} key={layer.name}>
                    <span className="layer-name">{layer.name}</span>
                    <span className="layer-detail">{layer.detail}</span>
                    {typeof layer.guards === 'number' && (
                      <span className="layer-guards">{layer.guards ? `${layer.guards} 处 if` : '无 if'}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="layer-verdict">{panel.verdict}</div>
            </div>
          ))}
        </div>
      );

    case 'timeline':
      return (
        <div className="time-rows">
          {visual.rows.map((row) => (
            <div className={`time-row ${row.tone}`} key={row.label}>
              <span className="time-label">{row.label}</span>
              <span className="time-steps">
                {row.steps.map((step, index) => (
                  <Fragment key={step.act}>
                    {index > 0 && <span className="time-arrow">→</span>}
                    <span className="time-step">
                      <i>{step.act}</i>
                      <b>{step.count}</b>
                    </span>
                  </Fragment>
                ))}
              </span>
              <span className="time-verdict">{row.verdict}</span>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
