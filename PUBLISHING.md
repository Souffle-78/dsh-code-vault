# 上架清单（dsh-code-vault）

DSH 没有「官方审核市场」。dshmarket 每次打开都实时拉 https://awesome-dsh-plugin.com/plugins.json，
数据源是列表仓库 `awesome-dsh-plugin/awesome-dsh-plugin` 的 `data/plugins/*.yml`。
上架 = 一个公开仓库 + 往列表仓库提一个「加一个 YAML」的 PR（dsh-market 仓库本身不收条目）。

## 0. 名称

`dsh-code-vault` 在 npm 上目前 **404（未被占用）**，已作为本包名。发布前再确认一次，避免撞名。
（上一版名字 `dsh-session-assets` 已被 louis-she 占用，故改名。）

## 1. 公开仓库

- 建公开 GitHub 仓库，仓库名与包名一致：`dsh-code-vault`
- 仓库打 topic：`dsh-plugin`
- 仓库创建满 1 天才能通过 CI（`MIN_AGE_DAYS = 1`）

## 2. 列表仓库 PR

文件名：`data/plugins/<owner>__dsh-code-vault.yml`

```yml
name: Code Vault
owner: <your-github-owner>
url: https://github.com/<owner>/dsh-code-vault
page: https://github.com/<owner>/dsh-code-vault
category: ui
description:
  en: "Save code blocks from a chat into a local vault with its own sidebar panel; search, tag, copy, or insert a saved block back into the composer."
  zh: "把对话里的代码块收藏到本地，在独立侧栏面板里搜索、打标签、复制或一键插回输入框。"
```

- `description.en` 必填，`zh` 可选；描述必须与代码一致（夸大是主要打回原因）
- 值里含 `: ` 要加引号
- 分类取值：agi ui usage theme model identity session memory tools wsl browser vision voice docs skill workflow git notify dev security remote market fun
- 一个 PR 最多 3 条条目

## 3. 图标与截图

- 图标必须在 GitHub 上托管的**位图**（png/jpg/webp），**SVG 会被拒** → 需要把 `icon.svg` 导出一张 512×512 png
- 截图：仓库里放 `screenshots.json`，列出 1–8 张仓库内相对路径的图片；建议截「代码块收藏按钮」+「面板列表」两张
- 现有 `docs/preview.svg` 是占位示意图，正式上架要换成真实截图（png）

## 4. npm 元数据（可选发布）

```json
"repository": "github:<owner>/dsh-code-vault",
"keywords": ["dsh-plugin", "deepseek-harness", "code", "snippets", "sidebar"],
"license": "MIT",
"private": false
```

- `repository` 必须指回仓库，市场才会把 npm 与条目关联
- 不要在 YAML 里手写 `npm:` 字段（会被拒）
- 官方包才用 `peerDependencies` 与显式预发布分支，第三方插件不需要

## 5. 其他目录

- dshai.org、dshfind：抓 topic / npm keywords，自动收录
- 1024Store：向 `imsai-sh/awesome-deepseek-harness-plugins` 提 PR

## 6. 现状对照

| 项 | 状态 |
| --- | --- |
| `dsh.bundle` + `cordis.patch.yml` | ✅ 已有 |
| 可运行的 client（侧栏图标 + 面板 + 代码块收藏 + 插入输入框） | ✅ 已有 |
| 唯一包名 `dsh-code-vault` | ✅ 已确认 npm 404 |
| 公开仓库 + `dsh-plugin` topic | ❌ 待建 |
| 仓库满 1 天 | ❌ 待满足 |
| 位图图标 + 真实截图 + `screenshots.json` | ❌ 待做 |
| README（中文用法） | ✅ 已有 |
| npm 元数据（repository/license/keywords，去掉 private） | ⚠️ 字段已列，`private: true` 待发布时去掉 |
