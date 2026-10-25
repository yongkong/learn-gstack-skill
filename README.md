# pstack 学习站

用来长期复习 pstack（[cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack)）的 24 条工程原则和 23 个 playbook。
这是一个 React 应用，不是教案合集——每节课的内容都是数据，渲染由共用组件完成。

## 跑起来

```bash
npm install
npm run dev      # http://localhost:5273
```

## 验证

```bash
npm run build    # 类型检查 + 生产构建
npm run smoke    # 逐课 SSR 渲染 + 原则覆盖一致性，共 81 项断言
```

## 结构

```
src/
  content/            内容层（改这里就够了）
    curriculum.ts       16 课路线图：5 个阶段，覆盖全部 24 条原则
    principles.ts       24 条原则：原文 / 中文释义 / 触发时机 / 落地动作
    playbooks.ts        23 个 playbook，按任务形状分组
    lessons/*.ts        每节课一个文件：目标 + 内容块（标题、时长都在 curriculum.ts）
    types.ts            block 与 lesson 的类型
  components/         渲染层，跨课程复用
    Blocks.tsx          block 渲染器（新增课程不用写 JSX）
    PrincipleCard.tsx   原则卡片
    Quiz.tsx            检索练习，进度存 localStorage
    Layout.tsx          左侧栏与站点骨架
  pages/              首页 / 课程页 / 原则速查 / playbook 索引
  lib/                hash 路由与进度存储
```

## 新增一节课

1. 在 `src/content/lessons/` 加一个 `000N-<slug>.ts`，导出 `Lesson`。
2. 在 `lessons/index.ts` 的 `LESSONS` 里注册。
3. 在 `curriculum.ts` 里把对应的那一条填上 `lessonId`（路线图里它就从"计划中"变成可点击）。
4. `npm run smoke` 会自动把新课的关键文案纳入检查，并校验原则覆盖率。

课数不是拍脑袋定的：`curriculum.ts` 里 16 节课的原则合计必须等于 24、且不重复，`npm run smoke` 会把这件事当成断言来验。

## 其他文件

- `MISSION.md` — 为什么学这个，学成什么样算成功。
- `RESOURCES.md` — 可信来源清单（含缺口说明）。
- `learning-records/` — 已经掌握什么、前提被如何修正。
- `NOTES.md` — 教学偏好与工程约定。
