# 发布与上架清单（dsh-code-vault）

上一版名字 `dsh-session-assets` 已被 npm 上的 `louis-she/dsh-session-assets` 占用，故改名为 `dsh-code-vault`（npm 上此名 404，未占用）。

## 0. 现状

| 项目 | 状态 |
| --- | --- |
| `package.json` 声明 `dsh.bundle.patch` + `cordis.patch.yml` | ✅ 已具备（市场收录的硬门槛） |
| 真实可用代码（`client.js` 1100 行 / 4 个槽） | ✅ |
| `repository` / `homepage` / `bugs` / `author` | ✅ 指向 `https://github.com/Souffle-78/dsh-code-vault` |
| LICENSE（MIT） | ✅ |
| 位图图标 `assets/icon-180.png`（180×180 PNG） | ✅ 已生成，yml 用 raw.githubusercontent 绝对地址引用 |
| 截图 `screenshots.json` | ⬜ 可选，未做（市场会回退到 README 里的图片） |
| 公开仓库 + `dsh-plugin` topic | ✅ https://github.com/Souffle-78/dsh-code-vault（已打 `dsh-plugin` / `deepseek-harness`） |
| 上架 PR | ✅ https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/15223 |
| 仓库满 1 天 | ⏳ 2026-11-14 建仓，CI 会按小时自动重跑，满 24h 后自行转绿 |
| npm 包 | 暂不发布（用户选择先只走 GitHub 收录） |

## 1. 建仓与推送（已完成，留作记录）

```sh
cd /Users/zhanghanjie/Documents/deepseek-harness/default-workspace/dsh-code-vault
gh auth login                      # 首次需要
gh repo create Souffle-78/dsh-code-vault --public --source=. --remote=origin --push
gh repo edit --add-topic dsh-plugin --add-topic deepseek-harness
```

## 2. 上架 awesome-dsh-plugin（唯一的“市场”）

没有官方审核市场：dsh-market 打开时实时拉 `https://awesome-dsh-plugin.com/plugins.json`，数据源是列表仓库 `awesome-dsh-plugin/awesome-dsh-plugin` 的 `data/plugins/*.yml`。

1. Fork `awesome-dsh-plugin/awesome-dsh-plugin`。（已 fork 到 `Souffle-78/awesome-dsh-plugin`）
2. 添加文件 `data/plugins/Souffle-78__dsh-code-vault.yml`，内容见 `publish/awesome-dsh-plugin-entry.yml`。
3. 提 PR `Add Souffle-78/dsh-code-vault` → PR #15223（已提交）。

CI 依次检查：条目数 ≤3、`dsh.bundle` 声明、仓库年龄 ≥1 天、`awesome-lint` 与站点构建（双语一致性、分隔符、日期、截图）。仓库年龄不达标时会被自动重跑，几小时后自己通过，不需要推空提交。

## 3. 规则要点（摘自 contributing.md）

- 只有 `description.en` 必填；含 `: ` 必须加引号；描述必须与代码逐条对得上（夸大是主要打回原因）。
- 仓库必须声明 `dsh.bundle`——只声明 `dsh.client` 是头号被拒原因。
- `category` 取 23 个值之一，本插件用 `ui`；选不准不会被打回，维护者会改。
- 图标必须是 GitHub 托管的位图（png/jpg/jpeg/webp），约 96px 方形最佳，SVG 会被拒。
- 截图放在自己仓库根的 `screenshots.json`（1–8 个相对路径，不能越出目录），下次构建生效。
- 一个 PR 最多 3 条；更新自己的条目时只改自己那一条。
- `tarball`、npm 均为可选；npm 包的 `repository` 必须指回被收录仓库才会关联，yml 里不要手写 `npm:`。

## 4. 其它目录

- dshai.org、dshfind：靠 GitHub topic / npm keywords 自动采集。
- 1024Store：需往 `imsai-sh/awesome-deepseek-harness-plugins` 提 PR。
