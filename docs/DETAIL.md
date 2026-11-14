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

## Notes

- Storage is per browser profile (`localStorage`), capped at 400 entries; one entry holds up to 200 000 characters.
- Saving the same code twice does not create a duplicate; an already saved block keeps showing **Saved ✓** long after the reply, including after a reload.
- The panel can switch between 中文 and English independently of the DSH UI language.
- A merged entry is stored as markdown, with each block keeping its own language fence.
- If a merge would exceed 200 000 characters the confirm button is disabled, so storage never gets corrupted.
