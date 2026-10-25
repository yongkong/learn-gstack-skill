import { PLAYBOOKS, PLAYBOOK_GROUPS, PLAYBOOK_BY_ID } from '../content/playbooks';

export function PlaybooksPage() {
  return (
    <div className="page page-wide">
      <p className="eyebrow">Reference · {PLAYBOOKS.length} 个</p>
      <h1>Playbook 索引</h1>
      <p className="lead">
        playbook 是 poteto-mode 的路由表：它先认形状，再选流程。这里按"任务的形状"分组，而不是按字母序——你是从任务出发找路的。
      </p>

      {PLAYBOOK_GROUPS.map((group) => {
        const items = group.ids.map((id) => PLAYBOOK_BY_ID.get(id)).filter((item) => item !== undefined);
        if (items.length === 0) return null;
        return (
          <section key={group.zh}>
            <div className="group-head">
              <h2>{group.zh}</h2>
              <p className="group-note">{group.note}</p>
            </div>
            {items.map((playbook) => (
              <div className="pb-item" key={playbook.id}>
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
            ))}
          </section>
        );
      })}

      <p className="group-note" style={{ marginTop: 32 }}>
        共 {PLAYBOOKS.length} 个 playbook。每条流程的最后一步都是开 PR——这也是为什么它单独列在"交付"组里。
      </p>
    </div>
  );
}
