# 代码收藏夹 · dsh-code-vault

把对话里出现的代码块收进一个本地收藏夹，并在 DSH 左侧栏拥有自己的面板：搜索、打标签、复制、导出导入，或者一键插回输入框继续改。

![对话中的代码块收藏按钮与侧栏面板](docs/preview.svg)

## 它做什么

- **对话里收藏**：每个 markdown 代码块右下角有一个「收藏代码块」按钮（常驻显示，不用悬停）。点一下收藏，按钮变成「已收藏 ✓」；再点一下取消收藏，手滑了也不怕。
- **侧栏面板**：左侧栏的书签图标打开「代码收藏夹」，按内容 / 语言 / 标签搜索，也可以改标签、复制、删除。
- **插回输入框**：面板里的「插入输入框」会把代码放回对话输入框，直接接着改（一次 undo 可撤销）。
- **导出 / 导入**：JSON 备份，换机器时搬过去。

数据只存在当前浏览器的 `localStorage` 里，不联网、不上传，也不跨设备同步。

## 安装

从 DSH 插件市场安装，或者在 **Plugins → Add plugin** 里填 GitHub 地址：

```
github:Souffle-78/dsh-code-vault
```

命令行等价写法（`--profile` 换成你自己的 profile）：

```sh
dsh plugin --profile desktop add github:Souffle-78/dsh-code-vault
```

安装后刷新页面（或重启 DSH），左侧栏会出现书签图标。

从源码目录本地安装也可以：**Plugins → Add plugin** 选择克隆下来的仓库根目录。

## 使用（三步）

1. 在对话里点代码块右下角的「收藏代码块」。
2. 点左侧栏书签图标打开面板。
3. 搜索 / 打标签 / 复制，或点「插入输入框」。

面板右上角可以在中文和 English 之间切换，与 DSH 界面语言相互独立。

## 已知限制

- 只收藏 markdown 代码块，不收藏普通回答文本。
- 单浏览器 `localStorage`，上限 400 条，单条最多 200 000 字符。
- `diff` / `math` / `patch` / `mermaid` 这类特殊代码块不显示收藏按钮；正在流式输出（`streaming`）的代码块也不显示。
- 换浏览器或换机器不会带上收藏，请用面板里的「导出 / 导入」。

## 开发

- `client.js` 是全部 UI：一个 `window.__ModuleLoader__.load({ id, factory })` 的 lazy factory，`require('react')` 从宿主模块表取，不打包 React。
- `index.js` 是空的 host 半边（这是纯前端插件）。
- `cordis.patch.yml` 声明 bundle 里的插件行；`package.json` 的 `dsh.bundle` 是市场收录与 `dsh plugin add` 安装必需的那一项。
- 改完客户端代码后要刷新页面（客户端模块在启动时加载）。

## 许可

MIT
