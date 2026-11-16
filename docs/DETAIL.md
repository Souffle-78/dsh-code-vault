# Code Vault

Keep the code that shows up in a conversation — a shell command, a config file, a snippet worth reusing — instead of scrolling back to find it.

![The Code Vault panel with saved snippets, language filters and per-card actions](../assets/screenshot-panel.webp)

![A chat code block with its Save to vault button at the bottom right](../assets/screenshot-codeblock.webp)

## How to use it

1. In any conversation, a code block carries a **Save to vault** button in its bottom-right corner (always visible, no hovering required).
2. Click it. The button turns into **Saved ✓**; the block is stored in this browser only — nothing is uploaded. Click the same button again to remove it, so a slip of the mouse stays harmless.
3. Open the bookmark icon in the left sidebar. The panel lists everything saved: search by code, language or tag, add tags, copy, delete, export/import JSON, or **Insert** to put the block back into the composer and keep editing.
4. Click **Select** in the toolbar to batch copy, batch tag or batch delete selected blocks (deleting asks for confirmation first).
5. With two or more selected, **Merge into new entry** combines them into one new markdown entry in list order — edit the title, check the preview, then confirm.
6. Press **⌘⇧K** (`Ctrl+Shift+K` on Windows and Linux) anywhere to open the quick-insert overlay: type to search, ↑↓ to choose, Enter to insert, Esc to close.
7. While a draft is half-written, **Save draft** under the composer sends it to the **Drafts** tab (the second tab at the top), not to the vault; saving the same draft twice does not duplicate it.
8. Every draft has **Move to vault**: pick a folder and it becomes a normal entry inside that folder.
9. The tree on the left works like folders on a computer: **New folder** in the toolbar or **New subfolder** on the breadcrumb nests levels, **Rename** renames, and **Delete folder** removes only the folder — its subfolders and entries move up a level.
10. To reorganise, drag a card onto a folder on the left, or use **More ▾ → Move to…** on the card and pick a target (including **Unsorted**).
11. **More ▾ → Edit** opens a code editor with line numbers, bracket pairs, auto-indent and `⌘S` to save; the bar underneath lists problems (unbalanced brackets, invalid JSON, JS syntax errors) and clicking one jumps to that line.

## Notes

- Storage is per browser profile (`localStorage`), capped at 400 entries (vault + drafts), 200 folders, and 200 000 characters per entry.
- Drafts live only in the Drafts tab: they never count as "saved" for chat code blocks and never show up in quick insert.
- Saving the same code twice does not create a duplicate; an already saved block keeps showing **Saved ✓** long after the reply, including after a reload.
- The panel can switch between 中文 and English independently of the DSH UI language.
- Drafts are stored with the `text` language and behave like any other entry: searchable, copyable, insertable.
- A merged entry is stored as markdown, with each block keeping its own language fence.
- If a merge would exceed 200 000 characters the confirm button is disabled, so storage never gets corrupted.

- A card is titled after the first line with its comment marker stripped (`#`, `//`, `--`), and the body no longer repeats that line.
