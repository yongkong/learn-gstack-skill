import { Link } from '../lib/router';
import { PRINCIPLES } from '../content/principles';
import { PLAYBOOKS } from '../content/playbooks';
import { CURRICULUM, PUBLISHED_COUNT } from '../content/curriculum';
import { Curriculum } from '../components/Curriculum';

export function Home() {
  return (
    <div className="page">
      <p className="eyebrow">Mission</p>
      <h1>学会 pstack 的那套判断</h1>
      <p className="lead">
        pstack 是 Lauren Tan（poteto）在 Cursor 每天用的技能集，用来对付"AI 写出太多垃圾代码"。这个站不讲它的功能清单，只练它背后的{' '}
        {PRINCIPLES.length} 条判断——每一条都要能自己说出来，并且知道什么时候该想起它。
      </p>

      <h2>为什么值得学</h2>
      <ul className="mission-list">
        <li>
          <b>问题</b>
          <span>写代码变便宜之后，瓶颈从"写"挪到了"审"和"删"。代码量本身成了负债。</span>
        </li>
        <li>
          <b>主张</b>
          <span>想快，先深入。能信任一个 agent 写出可验证的代码，才敢真正并行开十个。</span>
        </li>
        <li>
          <b>学完能</b>
          <span>拿到一个任务，先判断该走哪条 playbook、该在哪一步停手，而不是直接开始生成。</span>
        </li>
      </ul>

      <h2>课程 · 已上线 {PUBLISHED_COUNT} / 共 {CURRICULUM.length} 课</h2>
      <p className="group-note">
        {CURRICULUM.length} 节课覆盖全部 {PRINCIPLES.length} 条原则，一条不漏、一条不重复——但原则不平均分配：单独成课的是需要练判断的那些，成对出现的是一条原则的下游。最后两阶段留给 playbook 路由和收束。
      </p>
      <Curriculum />

      <h2>速查</h2>
      <div className="entry-grid">
        <Link to="/principles" className="entry">
          <span className="entry-kicker">{PRINCIPLES.length} 条 · 可搜索</span>
          <span className="entry-title">原则速查</span>
          <span className="entry-desc">按核心 / 架构 / 验证 / 委托 / 元分组。忘记某条怎么用的时候来这里翻，不用重读课程。</span>
        </Link>
        <Link to="/playbooks" className="entry">
          <span className="entry-kicker">{PLAYBOOKS.length} 个 · 按任务形状分组</span>
          <span className="entry-title">Playbook 索引</span>
          <span className="entry-desc">pstack 的路由表：什么形状的任务走哪条流程，以及每条流程在验证什么。</span>
        </Link>
      </div>

      <h2>怎么用这个站</h2>
      <div className="prose">
        <ol>
          <li>一节课只装一个判断。读完立刻在手头的真实任务上跑一遍，别做笔记式阅读。</li>
          <li>每节课末尾的题，先合上页面自己回答，再点选项。答完过几天再重做一次。</li>
          <li>想不通的地方直接问教你的人——这个站的内容只是骨架，追问才是学习发生的地方。</li>
        </ol>
      </div>
    </div>
  );
}
