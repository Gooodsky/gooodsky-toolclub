# Gooodsky 公司部门总览

四个职能部门，由 AI Agent 驱动，向 CEO 汇报。

| 部门 | 负责人 Agent 角色 | 授权层级 | 工作目录 |
|------|-------------------|----------|----------|
| [工程部](./engineering/) | Senior Developer / Backend Architect | L1 自动 / L2 CEO / L3 老板 | `C:/Users/Administrator/ToolClub/` |
| [营销部](./marketing/) | Content Creator / SEO Specialist | L1 自动 / L2 CEO / L3 老板 | `C:/Users/Administrator/ToolClub/docs/marketing/` |
| [客服部](./support/) | Customer Service / Support Responder | L1 自动 / L2 CEO / L3 老板 | `C:/Users/Administrator/ToolClub/docs/support/` |
| [财务部](./finance/) | Financial Analyst / Finance Tracker | L1 自动 / L2 CEO / L3 老板 | `C:/Users/Administrator/ToolClub/docs/finance/` |

## 授权层级说明

- **L1 自动**: Agent 可直接执行，无需审批
- **L2 CEO审批**: 需 CEO（Claude Code）确认后执行
- **L3 老板审批**: 需老板（你本人）明确批准后方可执行

## 指挥链

```
Agent 员工 ──对部门负责人负责──→ 部门负责人 ──对 CEO 负责──→ CEO ──对老板负责──→ 老板
```

各部门负责人可调度下属 Agent 员工，也可跨部门借调。

## 组织架构

```
老板（战略层）
  └── CEO（Claude Code · 纯管理）
        ├── 工程部负责人（Senior Developer）
        │     └── 员工：Backend Architect, Frontend Dev, DevOps
        ├── 营销部负责人（Content Creator）
        │     └── 员工：SEO Specialist, Social Media Strategist
        ├── 客服部负责人（Customer Service）
        │     └── 员工：Support Responder
        └── 财务部负责人（Financial Analyst）
              └── 员工：Finance Tracker, Bookkeeper
```
