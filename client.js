window.__ModuleLoader__.load({
  id: 'dsh-code-vault',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const PANEL_ID = 'code-vault'
    // Kept from the 0.1.0 name on purpose: assets saved before the rename stay readable.
    const STORE_KEY = 'dsh-session-assets:v1'
    const LANG_KEY = 'dsh-code-vault:lang'
    const SHORTCUT_KEY = 'dsh-code-vault:shortcut'
    const DEFAULT_COMBO = { mod: true, shift: true, alt: false, key: 'k' }
    // Chords DSH itself (or the browser) already owns — saving one of these is allowed but
    // flagged, because the host listener may win.
    const KNOWN_COMBOS = [
      'Mod+B', 'Mod+K', 'Mod+P', 'Mod+/', 'Mod+,',
      'Mod+Shift+R', 'Mod+Shift+,', 'Mod+Shift+.',
      'Alt+Mod+Enter', 'Alt+Mod+G', 'Alt+Mod+,',
    ]
    const LIMIT = 400
    const TRASH_TTL = 30 * 24 * 60 * 60 * 1000
    const MAX_CODE = 200000

    // ---------------------------------------------------------------- language

    const DICT = {
      en: {
        title: 'Code Vault',
        subtitle: 'Favourite code and drafts from this chat — sorted into folders, local, one click away',
        search: 'Search code, language, or tag',
        all: 'All',
        empty: 'Nothing here yet — this is the whole flow:',
        copy: 'Copy',
        copied: 'Copied',
        copyFailed: 'Copy failed — select the code instead',
        removeTagHint: 'Click a tag to remove it',
        insert: 'Insert',
        inserted: 'Inserted — Ctrl+Z to undo',
        noSession: 'Open a conversation first, then insert',
        remove: 'Delete',
        export: 'Export',
        import: 'Import',
        addTag: 'Tag',
        tagPlaceholder: 'tag, then Enter',
        save: 'Save to vault',
        saved: 'Saved ✓',
        saveFailed: 'Could not save',
        unsaveHint: 'Saved — click again to remove it',
        unsaved: 'Removed from vault',
        count: (n) => `${n} saved`,
        importFailed: 'That file could not be read — export a JSON from here first.',
        imported: (n) => `Imported ${n} block(s)`,
        importNone: 'Nothing new — those blocks are already saved',
        storeFailed: 'Could not write to browser storage — it may be full',
        searchEmpty: 'Nothing matches this search.',
        how: 'How it works',
        hideHow: 'Hide',
        step1: 'In a conversation, every code block has a “Save to vault” button in its bottom-right corner.',
        step2: 'Saved code lands in Vault. Make folders and drag cards onto them — nested folders work like files on a computer.',
        step3: 'Half-written text is better kept as a draft: use “Save draft” under the composer, then move it here when it is ready.',
        step4: 'The shortcut opens quick insert anywhere; the composer draft button saves your scratch text without leaving the chat.',
        localOnly: 'Stored in this browser only. Use Export/Import to back up or move machines.',
        openChat: 'Open a conversation',
        langHint: 'Language',
        select: 'Select',
        exitSelect: 'Done',
        selectHint: 'Select mode: click a card to pick it, then run a batch action.',
        selectedCount: (n) => `${n} selected`,
        selectAll: 'Select all',
        clearSelection: 'Clear',
        selectedEmpty: 'Pick at least one card first.',
        batchCopy: 'Copy selected',
        batchTag: 'Tag selected',
        batchDelete: 'Delete selected',
        deleteLabel: 'Delete',
        merge: 'Merge into one',
        mergeTitle: 'Title of the new entry',
        mergePreview: 'Preview',
        mergeHint: 'Merging adds one new entry that fences every selected block in order. The originals stay.',
        create: 'Create',
        cancel: 'Cancel',
        confirmDeleteOne: 'Move this entry to the recycle bin? It stays there for 30 days.',
        confirmDeleteMany: (n) => `Move ${n} selected entries to the recycle bin? They stay there for 30 days.`,
        confirmMerge: (n) => `Merge ${n} selected entries into one new entry? The originals stay.`,
        merged: 'Merged into a new entry',
        mergeFailed: 'Could not merge — browser storage may be full',
        tagged: (n) => `Tag added to ${n} entries`,
        copiedMany: (n) => `Copied ${n} block(s)`,
        removed: 'Moved to the recycle bin',
        tagPrompt: 'Tag name, then Enter',
        confirmNote: 'This step needs one more click.',
        saveDraft: 'Save draft',
        draftSaved: 'Draft saved — find it in Drafts',
        draftDup: 'That draft is already saved',
        quick: 'Quick insert',
        quickPlaceholder: 'Search saved code — Enter inserts',
        quickEmpty: 'No saved code matches this search.',
        quickNoAssets: 'The vault is empty — save a code block in a conversation first.',
        quickHint: '↑↓ choose · Enter insert · Esc close',
        quickCount: (n) => `${n} saved`,
        quickClose: 'Close',
        favorites: 'Vault',
        drafts: 'Drafts',
        favoritesHint: 'Saved code, organised in folders',
        draftsHint: 'Scratch text — move it here when it becomes code',
        draftsEmpty: 'No drafts yet. Write something in the composer and press “Save draft” under it.',
        trash: 'Recycle bin',
        trashHint: 'Deleted entries rest here for 30 days',
        trashEmpty: 'Nothing in the bin. Deleted entries show up here for 30 days.',
        trashNote: 'Entries older than 30 days are removed automatically.',
        restore: 'Restore',
        restored: 'Restored',
        deleteForever: 'Delete forever',
        emptyTrash: 'Empty bin',
        emptyTrashText: (n) => `Permanently delete ${n} entries in the bin? This cannot be undone.`,
        purged: 'Deleted permanently',
        purgeOne: 'Delete this entry forever? This cannot be undone.',
        purgeMany: (n) => `Permanently delete ${n} entries? This cannot be undone.`,
        deletedOn: (stamp) => `deleted ${stamp}`,
        shortcut: 'Shortcut',
        shortcutTitle: 'Custom shortcut for quick insert',
        shortcutHint: 'Click the box, then press the chord you want. It must include ⌘ / Ctrl or ⌥ / Alt.',
        shortcutRecording: 'Press a chord…',
        shortcutNeedMod: 'Include ⌘ / Ctrl or ⌥ / Alt',
        shortcutSaved: 'Shortcut updated',
        shortcutReset: 'Back to the default shortcut',
        shortcutConflict: (label) => `DSH already uses ${label} — the host may catch it first.`,
        shortcutDefault: 'Use default',
        shortcutNote: 'Only affects quick insert. The default is ⌘⇧K.',
        changeShortcut: 'Change shortcut',
        guideTitle: 'How it works',
        gotIt: 'Got it',
        guideTip: 'Everything stays in this browser. Use Export / Import to move devices.',
        guideShortcut: (label) => `Quick insert from anywhere: ${label}`,
        toFavorites: 'Move to vault',
        draftMoved: (n) => `Moved ${n} draft(s) to the vault`,
        moved: (n) => `Moved ${n} item(s)`,
        moveFailed: 'Could not move — browser storage may be full',
        newFolder: 'New folder',
        newSubfolder: 'New subfolder',
        renameFolder: 'Rename',
        deleteFolder: 'Delete folder',
        folderName: 'Folder name',
        folderNamePlaceholder: 'e.g. Project A / Frontend',
        folderDeleteTitle: 'Delete folder',
        folderDeleteText: (n) => `Delete this folder? Its ${n} item(s) and subfolders move up one level — nothing is lost.`,
        folderEmpty: 'This folder is empty.',
        folderEmptyHint: 'Drag cards onto a folder on the left, or use “More → Move to…” on a card.',
        folderExists: 'A folder with that name already exists here',
        folderCreated: 'Folder created',
        folderRenamed: 'Folder renamed',
        folderFailed: 'Could not save the folder',
        allItems: 'All saved',
        unfiled: 'Unsorted',
        move: 'Move to…',
        moveTitle: 'Move to',
        moveHint: 'Pick a folder, or “Unsorted” to take them out of folders.',
        moveRoot: 'Unsorted (no folder)',
        edit: 'Edit',
        editTitleLabel: 'Title',
        editCodeLabel: 'Code',
        saveChanges: 'Save',
        editSaved: 'Changes saved',
        unsaved: 'Unsaved',
        lintOk: 'No problems found.',
        lintUnclosed: (line) => `Line ${line}: bracket is never closed.`,
        lintExtra: (line, ch) => `Line ${line}: unexpected "${ch}".`,
        lintCount: (count) => `${count} problems`,
        lintMore: (count) => `…and ${count} more`,
        lintJson: (message) => `Invalid JSON: ${message}`,
        lintJs: (message) => `JavaScript syntax error: ${message}`,
        lintTrailing: (count) => `${count} line(s) end with whitespace.`,
        lintTitleEmpty: 'Title is empty — saving will generate one.',
        editorHelp: '⌘S save · Tab indent · brackets close themselves',
        jumpHint: 'Click a line to jump',
        lintExpand: 'Show all',
        lintCollapse: 'Collapse',
        editFailed: 'Could not save — browser storage may be full',
        more: 'More',
        less: 'Less',
        dragHint: 'Drag this card onto a folder on the left',
        searchInAll: 'Searching every folder',
      },
      zh: {
        title: '代码收藏夹',
        subtitle: '把对话里的代码和草稿收进本地收藏夹，按文件夹分好，随时搜、随时插',
        search: '搜代码 / 语言 / 标签',
        all: '全部',
        empty: '这里还是空的，整个流程是这样：',
        copy: '复制',
        copied: '已复制',
        copyFailed: '复制失败，请手动选中复制',
        removeTagHint: '点击标签可移除',
        insert: '插入输入框',
        inserted: '已插入，Ctrl+Z 可撤销',
        noSession: '先打开一个对话，再点插入',
        remove: '删除',
        export: '导出',
        import: '导入',
        addTag: '标签',
        tagPlaceholder: '标签名，回车确认',
        save: '收藏代码块',
        saved: '已收藏 ✓',
        saveFailed: '收藏失败',
        unsaveHint: '已收藏——再点一下取消收藏',
        unsaved: '已取消收藏',
        count: (n) => `已收 ${n} 条`,
        importFailed: '这个文件读不了，请用本面板导出的 JSON。',
        imported: (n) => `已导入 ${n} 条`,
        importNone: '没有新内容，这些代码已经收藏过了',
        storeFailed: '浏览器存储写入失败，可能空间已满',
        searchEmpty: '没有匹配的内容。',
        how: '怎么用',
        hideHow: '收起',
        step1: '在对话里，每个代码块右下角都有一个「收藏代码块」按钮。',
        step2: '收藏的代码进「收藏夹」；可以建文件夹，把卡片拖到左侧文件夹里分类，文件夹还能再套文件夹。',
        step3: '写到一半的文字先存「草稿箱」更合适：输入框下方点「存草稿」，整理好再移进收藏夹。',
        step4: '快捷键可以随时唤起快速插入；输入框下方的存草稿按钮不用离开对话就能把半成品收起来。',
        localOnly: '只存本地浏览器。换设备用「导出 / 导入」。',
        openChat: '去对话里试一下',
        langHint: '语言',
        select: '多选',
        exitSelect: '完成',
        selectHint: '多选模式：点卡片选中，再执行批量操作。',
        selectedCount: (n) => `已选 ${n} 条`,
        selectAll: '全选',
        clearSelection: '清空',
        selectedEmpty: '先选中至少一条。',
        batchCopy: '复制已选',
        batchTag: '加标签',
        batchDelete: '删除已选',
        deleteLabel: '删除',
        merge: '合并为新条目',
        mergeTitle: '新条目标题',
        mergePreview: '预览',
        mergeHint: '合并会按顺序把选中的代码各包一层代码块，生成一条新收藏；原来的仍然保留。',
        create: '创建',
        cancel: '取消',
        confirmDeleteOne: '把这条放进回收站？会在里面保留 30 天。',
        confirmDeleteMany: (n) => `把选中的 ${n} 条放进回收站？会在里面保留 30 天。`,
        confirmMerge: (n) => `把选中的 ${n} 条合并成一条新收藏？原收藏会保留。`,
        merged: '已合并为一条新收藏',
        mergeFailed: '合并失败，浏览器存储可能已满',
        tagged: (n) => `已给 ${n} 条加上标签`,
        copiedMany: (n) => `已复制 ${n} 段代码`,
        removed: '已放进回收站',
        tagPrompt: '标签名，回车确认',
        confirmNote: '这一步需要再点一次确认。',
        saveDraft: '存草稿',
        draftSaved: '草稿已存进草稿箱',
        draftDup: '这段草稿已经存过了',
        quick: '快速插入',
        quickPlaceholder: '搜索收藏的代码 · 回车插入',
        quickEmpty: '没有匹配的内容。',
        quickNoAssets: '收藏夹还是空的——先去对话里收藏一个代码块。',
        quickHint: '↑↓ 选择 · 回车插入 · Esc 关闭',
        quickCount: (n) => `共 ${n} 条`,
        quickClose: '关闭',
        favorites: '收藏夹',
        drafts: '草稿箱',
        favoritesHint: '收藏的代码，按文件夹分类',
        draftsHint: '半成品先放这里，整理好再移进收藏夹',
        draftsEmpty: '草稿箱是空的。在输入框写点东西，点它下面的「存草稿」。',
        trash: '回收站',
        trashHint: '删除的条目在这里放 30 天',
        trashEmpty: '回收站是空的。删掉的收藏和草稿会先放这里 30 天。',
        trashNote: '超过 30 天的条目会被自动清除。',
        restore: '恢复',
        restored: '已恢复',
        deleteForever: '彻底删除',
        emptyTrash: '清空回收站',
        emptyTrashText: (n) => `彻底删除回收站里的 ${n} 条？此操作不可撤销。`,
        purged: '已彻底删除',
        purgeOne: '彻底删除这一条？此操作不可撤销。',
        purgeMany: (n) => `彻底删除选中的 ${n} 条？此操作不可撤销。`,
        deletedOn: (stamp) => `${stamp} 删除`,
        shortcut: '快捷键',
        shortcutTitle: '自定义快速插入快捷键',
        shortcutHint: '点下面的框，然后按下你想用的组合键。必须带 ⌘ / Ctrl 或 ⌥ / Alt。',
        shortcutRecording: '按下组合键…',
        shortcutNeedMod: '要带 ⌘ / Ctrl 或 ⌥ / Alt',
        shortcutSaved: '快捷键已更新',
        shortcutReset: '已恢复默认快捷键',
        shortcutConflict: (label) => `DSH 自带快捷键占用了 ${label}，可能会被宿主先接住。`,
        shortcutDefault: '恢复默认',
        shortcutNote: '只影响快速插入。默认是 ⌘⇧K。',
        changeShortcut: '改快捷键',
        guideTitle: '用法说明',
        gotIt: '我明白了',
        guideTip: '所有内容只存在这台浏览器里，换设备用「导出 / 导入」。',
        guideShortcut: (label) => `任何地方唤起快速插入：${label}`,
        toFavorites: '移入收藏夹',
        draftMoved: (n) => `已把 ${n} 条草稿移入收藏夹`,
        moved: (n) => `已移动 ${n} 条`,
        moveFailed: '移动失败，浏览器存储可能已满',
        newFolder: '新建文件夹',
        newSubfolder: '新建子文件夹',
        renameFolder: '重命名',
        deleteFolder: '删除文件夹',
        folderName: '文件夹名字',
        folderNamePlaceholder: '比如：项目 A / 前端',
        folderDeleteTitle: '删除文件夹',
        folderDeleteText: (n) => `删除这个文件夹？里面的 ${n} 条内容和子文件夹会移到上一层，不会丢。`,
        folderEmpty: '这个文件夹还是空的。',
        folderEmptyHint: '把卡片拖到左侧文件夹，或者用卡片上的「更多 → 移动到…」。',
        folderExists: '这一层已经有同名文件夹了',
        folderCreated: '文件夹已建好',
        folderRenamed: '文件夹已重命名',
        folderFailed: '文件夹没保存成功',
        allItems: '全部收藏',
        unfiled: '未分类',
        move: '移动到…',
        moveTitle: '移动到哪里',
        moveHint: '选一个文件夹；选「未分类」就是从文件夹里拿出来。',
        moveRoot: '未分类（不放进文件夹）',
        edit: '编辑',
        editTitleLabel: '标题',
        editCodeLabel: '代码',
        saveChanges: '保存',
        editSaved: '修改已保存',
        unsaved: '未保存',
        lintOk: '没有发现问题。',
        lintUnclosed: (line) => `第 ${line} 行有括号没闭合。`,
        lintExtra: (line, ch) => `第 ${line} 行多了个「${ch}」。`,
        lintCount: (count) => `共 ${count} 个问题`,
        lintMore: (count) => `还有 ${count} 条…`,
        lintJson: (message) => `JSON 无效：${message}`,
        lintJs: (message) => `JS 语法错误：${message}`,
        lintTrailing: (count) => `有 ${count} 行以空格结尾。`,
        lintTitleEmpty: '标题是空的，保存时会自动生成。',
        editorHelp: '⌘S 保存 · Tab 缩进 · 括号自动配对',
        jumpHint: '点一行可以跳过去',
        lintExpand: '展开全部',
        lintCollapse: '收起',
        editFailed: '保存失败，浏览器存储可能已满',
        more: '更多',
        less: '收起',
        dragHint: '可以把这张卡片拖到左侧文件夹里',
        searchInAll: '正在所有文件夹中搜索',
      },
    }

    let lang = 'zh'
    let layout = null
    // Resolved again on demand: the panel can outlive a re-created layout service.
    let layoutOf = () => layout

    function t() {
      return DICT[lang] || DICT.en
    }

    function readLangChoice() {
      try {
        const raw = window.localStorage.getItem(LANG_KEY)
        return raw === 'zh' || raw === 'en' ? raw : ''
      } catch {
        return ''
      }
    }

    function setLang(next) {
      if (next !== 'zh' && next !== 'en') return
      lang = next
      try {
        window.localStorage.setItem(LANG_KEY, next)
      } catch {}
      emit()
    }

    // The locale service hands back a snapshot object ({ active, locales, revision }),
    // not a string; also honour an explicit in-panel choice and a Chinese browser.
    function detectLang(snapshot) {
      const chosen = readLangChoice()
      if (chosen) return chosen
      let active = ''
      const snap = snapshot && typeof snapshot === 'object' ? snapshot : null
      active = String((snap ? snap.active : snapshot) || '')
      const value = active.toLowerCase()
      if (value.startsWith('zh')) return 'zh'
      // A Chinese user often runs DSH itself in English; the browser is the better hint there.
      const nav = String((typeof navigator !== 'undefined' && navigator.language) || '').toLowerCase()
      if (nav.startsWith('zh')) return 'zh'
      return 'en'
    }

    // ------------------------------------------------------------------ store

    // Everything lives under one key: snippets and drafts share the item shape, and folders are a
    // flat parent-linked list rather than nested objects, so moving one is a single parentId edit.
    let state = null
    const listeners = new Set()

    function emit() {
      for (const fn of Array.from(listeners)) {
        try {
          fn()
        } catch {}
      }
    }

    function subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    }

    function newId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
    }

    // A snippet's title is its first line with the comment marker stripped, so a bash block
    // titled "# list open ports" reads "list open ports" instead of showing the "#" too.
    const COMMENT_LEAD = /^(?:\/\/+|#!?|--+|;+|\/\*+|<!--)\s*/

    function cleanLine(line) {
      const stripped = String(line || '')
        .trim()
        .replace(COMMENT_LEAD, '')
        .replace(/\*\/$|-->$/, '')
        .trim()
      return stripped
    }

    function firstLine(code) {
      return String(code || '')
        .split('\n')
        .map((x) => x.trim())
        .find((x) => x !== '') || ''
    }

    function titleOf(code) {
      return (cleanLine(firstLine(code)).slice(0, 60) || 'Code')
    }

    // The card body drops the line that already became the title, otherwise every card shows
    // the same comment twice.
    function previewOf(asset) {
      const lines = String(asset.code || '').split('\n')
      const title = String(asset.title || '').trim()
      let start = 0
      while (start < lines.length && lines[start].trim() === '') start += 1
      if (start < lines.length && cleanLine(lines[start]).slice(0, 60) === title) start += 1
      const rest = lines.slice(start).join('\n').replace(/^\s*\n/, '')
      return rest.trim() ? rest : asset.code
    }

    // Entries saved before titles were cleaned kept the raw first line, comment marker and
    // all. Re-derive those on read; titles the user typed (merge results, edits) are left alone.
    function titleFrom(raw) {
      const stored = typeof raw.title === 'string' ? raw.title.trim().slice(0, 80) : ''
      if (!stored) return titleOf(raw.code)
      const legacy = firstLine(raw.code).slice(0, 60)
      return stored === legacy ? titleOf(raw.code) : stored
    }

    function normalizeItem(raw) {
      if (!raw || typeof raw !== 'object') return null
      if (typeof raw.code !== 'string' || raw.code.trim() === '') return null
      const tags = []
      if (Array.isArray(raw.tags)) {
        for (const value of raw.tags) {
          if (typeof value !== 'string') continue
          const tag = value.trim().slice(0, 24)
          if (tag && !tags.includes(tag)) tags.push(tag)
        }
      }
      return {
        id: typeof raw.id === 'string' && raw.id ? raw.id : newId(),
        title: titleFrom(raw),
        lang: typeof raw.lang === 'string' ? raw.lang.slice(0, 24) : '',
        code: raw.code.slice(0, MAX_CODE),
        tags,
        kind: raw.kind === 'draft' ? 'draft' : 'snippet',
        folderId: typeof raw.folderId === 'string' && raw.folderId ? raw.folderId : null,
        createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
        trashedAt: Number.isFinite(raw.trashedAt) && raw.trashedAt > 0 ? raw.trashedAt : null,
      }
    }

    function normalizeFolder(raw) {
      if (!raw || typeof raw !== 'object') return null
      const name = String(raw.name || '').trim().slice(0, 40)
      if (!name) return null
      return {
        id: typeof raw.id === 'string' && raw.id ? raw.id : newId(),
        name,
        parentId: typeof raw.parentId === 'string' && raw.parentId ? raw.parentId : null,
        createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
      }
    }

    // Repair whatever is on disk: drop folders whose parent vanished, break parent cycles, and
    // send items whose folder is gone back to "unsorted" instead of hiding them.
    function sanitizeFolders(list) {
      const byId = new Map()
      for (const folder of list) if (!byId.has(folder.id)) byId.set(folder.id, { ...folder })
      for (const folder of byId.values()) {
        if (folder.parentId && !byId.has(folder.parentId)) folder.parentId = null
      }
      for (const folder of byId.values()) {
        const seen = new Set([folder.id])
        let parent = folder.parentId
        while (parent) {
          if (seen.has(parent)) {
            folder.parentId = null
            break
          }
          seen.add(parent)
          const next = byId.get(parent)
          parent = next ? next.parentId : null
        }
      }
      return Array.from(byId.values()).slice(0, 200)
    }

    function readState() {
      if (state) return state
      let items = []
      let folders = []
      try {
        const raw = window.localStorage.getItem(STORE_KEY)
        const parsed = raw ? JSON.parse(raw) : null
        const source = Array.isArray(parsed)
          ? parsed
          : parsed && Array.isArray(parsed.items)
            ? parsed.items
            : parsed && Array.isArray(parsed.assets)
              ? parsed.assets
              : []
        const folderSource = parsed && !Array.isArray(parsed) && Array.isArray(parsed.folders) ? parsed.folders : []
        items = source.map(normalizeItem).filter(Boolean)
        folders = sanitizeFolders(folderSource.map(normalizeFolder).filter(Boolean))
      } catch {
        items = []
        folders = []
      }
      const known = new Set(folders.map((folder) => folder.id))
      const now = Date.now()
      items = items
        .filter((item) => !item.trashedAt || now - item.trashedAt < TRASH_TTL)
        .map((item) => (item.folderId && !known.has(item.folderId) ? { ...item, folderId: null } : item))
      state = { items, folders }
      return state
    }

    function writeState(next) {
      const previous = state
      const seen = new Set()
      const items = []
      for (const item of next.items) {
        const copy = seen.has(item.id) ? { ...item, id: newId() } : item
        seen.add(copy.id)
        items.push(copy)
      }
      items.length = Math.min(items.length, LIMIT)
      const folders = sanitizeFolders(next.folders || [])
      const value = { version: 4, items, folders }
      state = value
      savedSigs = null
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(value))
      } catch {
        // Quota or a locked-down storage: revert so memory never claims what storage refused.
        state = previous
        savedSigs = null
        return false
      }
      emit()
      return true
    }

    // Reads for the fence, the quick picker and the panel all start from a plain item list.
    // Anything sitting in the recycle bin is excluded; `readTrash` is the bin's own view.
    function readAll() {
      return readState().items.filter((item) => !item.trashedAt)
    }

    function readTrash() {
      return readState()
        .items.filter((item) => Boolean(item.trashedAt))
        .sort((a, b) => (b.trashedAt || 0) - (a.trashedAt || 0))
    }

    let savedSigs = null

    // Every fence asks "is this exact code already in the vault?" on render, so answer from a
    // hash index instead of comparing all stored code strings.
    function sigOf(lang, code) {
      let hash = 5381
      for (let i = 0; i < code.length; i += 1) hash = ((hash << 5) + hash + code.charCodeAt(i)) | 0
      return `${lang}:${code.length}:${hash >>> 0}`
    }

    function isSaved(lang, code) {
      if (typeof code !== 'string' || code === '') return false
      const snippets = () => readAll().filter((item) => item.kind === 'snippet')
      if (!savedSigs) savedSigs = new Set(snippets().map((item) => sigOf(item.lang, item.code)))
      // The index answers "almost certainly no" fast; a hit is confirmed by value so a hash
      // collision can never make a block look saved (and block saving it for real).
      if (!savedSigs.has(sigOf(lang || '', code))) return false
      return snippets().some((item) => item.lang === (lang || '') && item.code === code)
    }

    const searchCache = new WeakMap()

    function searchTextOf(item) {
      let text = searchCache.get(item)
      if (text === undefined) {
        text = `${item.title}\n${item.lang}\n${item.tags.join(' ')}\n${item.code}`.toLowerCase()
        searchCache.set(item, text)
      }
      return text
    }

    function forgetCache() {
      state = null
      savedSigs = null
      emit()
    }

    function writeItems(items) {
      return writeState({ items, folders: readState().folders })
    }

    function addItem(input) {
      const item = normalizeItem({ ...input, createdAt: Date.now() })
      if (!item) return null
      const current = readState()
      const dup = current.items.find(
        (x) => !x.trashedAt && x.code === item.code && x.lang === item.lang && x.kind === item.kind,
      )
      if (dup) return dup
      return writeState({ items: [item, ...current.items], folders: current.folders }) ? item : null
    }

    function addAsset(input) {
      return addItem({ ...input, kind: 'snippet' })
    }

    function addDraft(input) {
      return addItem({ ...input, kind: 'draft' })
    }

    function updateItem(id, patch) {
      const current = readState()
      let changed = false
      const items = current.items.map((item) => {
        if (item.id !== id) return item
        const merged = normalizeItem({ ...item, ...patch })
        if (!merged) return item
        changed = true
        return { ...merged, id: item.id, kind: item.kind, folderId: merged.folderId }
      })
      if (!changed) return false
      return writeState({ items, folders: current.folders })
    }

    // Deleting is reversible: entries are stamped instead of dropped, and `readState`
    // discards stamps older than TRASH_TTL on the next read.
    function trashItems(ids) {
      const set = new Set(ids)
      const current = readState()
      const now = Date.now()
      let changed = false
      const items = current.items.map((item) => {
        if (!set.has(item.id) || item.trashedAt) return item
        changed = true
        return { ...item, trashedAt: now }
      })
      if (!changed) return false
      return writeState({ items, folders: current.folders })
    }

    function restoreItems(ids) {
      const set = new Set(ids)
      const current = readState()
      let changed = false
      const items = current.items.map((item) => {
        if (!set.has(item.id) || !item.trashedAt) return item
        changed = true
        return { ...item, trashedAt: null }
      })
      if (!changed) return false
      return writeState({ items, folders: current.folders })
    }

    function emptyTrash() {
      const current = readState()
      const items = current.items.filter((item) => !item.trashedAt)
      if (items.length === current.items.length) return false
      return writeState({ items, folders: current.folders })
    }

    function removeItems(ids) {
      const set = new Set(ids)
      const current = readState()
      const items = current.items.filter((item) => !set.has(item.id))
      if (items.length === current.items.length) return false
      return writeState({ items, folders: current.folders })
    }

    function removeAsset(id) {
      return removeItems([id])
    }

    function moveItems(ids, folderId) {
      const set = new Set(ids)
      const current = readState()
      const target = folderId && current.folders.some((folder) => folder.id === folderId) ? folderId : null
      let changed = false
      const items = current.items.map((item) => {
        if (!set.has(item.id) || item.folderId === target) return item
        changed = true
        return { ...item, folderId: target }
      })
      if (!changed) return true
      return writeState({ items, folders: current.folders })
    }

    // Drafts become normal snippets only when the user moves them into the vault.
    function promoteItems(ids, folderId) {
      const set = new Set(ids)
      const current = readState()
      const target = folderId && current.folders.some((folder) => folder.id === folderId) ? folderId : null
      let changed = false
      const items = current.items.map((item) => {
        if (!set.has(item.id) || item.kind !== 'draft') return item
        changed = true
        return { ...item, kind: 'snippet', folderId: target }
      })
      if (!changed) return false
      return writeState({ items, folders: current.folders })
    }

    // The fence button toggles by content: it never knows an asset id, and the same code with
    // the same language is one entry thanks to the save-time dedupe.
    function unsaveAsset(lang, code) {
      const hit = readAll().find(
        (item) => item.kind === 'snippet' && item.lang === (lang || '') && item.code === code,
      )
      if (!hit) return false
      return trashItems([hit.id])
    }

    function folderMap() {
      const map = new Map()
      for (const folder of readState().folders) map.set(folder.id, folder)
      return map
    }

    function folderPathOf(id) {
      const map = folderMap()
      const chain = []
      let cursor = id
      let guard = 0
      while (cursor && map.has(cursor) && guard < 50) {
        const folder = map.get(cursor)
        chain.unshift(folder)
        cursor = folder.parentId
        guard += 1
      }
      return chain
    }

    function childFoldersOf(parentId) {
      return readState()
        .folders.filter((folder) => (folder.parentId || null) === (parentId || null))
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    function createFolder(name, parentId) {
      const clean = String(name || '').trim().slice(0, 40)
      if (!clean) return { error: 'empty' }
      const current = readState()
      const parent = parentId && current.folders.some((folder) => folder.id === parentId) ? parentId : null
      if (current.folders.some((folder) => folder.name === clean && (folder.parentId || null) === parent)) {
        return { error: 'dup' }
      }
      const folder = { id: newId(), name: clean, parentId: parent, createdAt: Date.now() }
      if (!writeState({ items: current.items, folders: [...current.folders, folder] })) return { error: 'failed' }
      return { folder }
    }

    function renameFolder(id, name) {
      const clean = String(name || '').trim().slice(0, 40)
      if (!clean) return { error: 'empty' }
      const current = readState()
      const folder = current.folders.find((item) => item.id === id)
      if (!folder) return { error: 'missing' }
      const clash = current.folders.some(
        (item) => item.id !== id && item.name === clean && (item.parentId || null) === (folder.parentId || null),
      )
      if (clash) return { error: 'dup' }
      const folders = current.folders.map((item) => (item.id === id ? { ...item, name: clean } : item))
      return writeState({ items: current.items, folders }) ? { folder: { ...folder, name: clean } } : { error: 'failed' }
    }

    // Deleting a folder never deletes content: items and child folders move one level up.
    function deleteFolder(id) {
      const current = readState()
      const folder = current.folders.find((item) => item.id === id)
      if (!folder) return false
      const parent = folder.parentId || null
      const folders = current.folders
        .filter((item) => item.id !== id)
        .map((item) => (item.parentId === id ? { ...item, parentId: parent } : item))
      const items = current.items.map((item) =>
        item.folderId === id ? { ...item, folderId: parent } : item,
      )
      return writeState({ items, folders })
    }

    function moveFolder(id, parentId) {
      const current = readState()
      const target = parentId || null
      if (id === target) return false
      if (target && !current.folders.some((folder) => folder.id === target)) return false
      let cursor = target
      let guard = 0
      while (cursor && guard < 50) {
        if (cursor === id) return false
        const folder = current.folders.find((item) => item.id === cursor)
        cursor = folder ? folder.parentId : null
        guard += 1
      }
      const folders = current.folders.map((folder) =>
        folder.id === id ? { ...folder, parentId: target } : folder,
      )
      return writeState({ items: current.items, folders })
    }

    // Import accepts every shape this plugin has ever exported, merges folders by (parent, name)
    // so importing twice does not grow duplicates, and reports what actually landed.
    function mergeImport(payload) {
      const current = readState()
      const source = Array.isArray(payload)
        ? payload
        : payload && Array.isArray(payload.items)
          ? payload.items
          : payload && Array.isArray(payload.assets)
            ? payload.assets
            : null
      if (!source) return { added: 0, failed: true }
      const folderSource = Array.isArray(payload && payload.folders) ? payload.folders : []
      const folders = current.folders.slice()
      const idMap = new Map()
      const pending = folderSource.map(normalizeFolder).filter(Boolean)
      let guard = 0
      while (pending.length && guard < 500) {
        guard += 1
        let progress = false
        for (const folder of pending.slice()) {
          const localParent = folder.parentId
          const parentReady = !localParent || !pending.some((item) => item.id === localParent) || idMap.has(localParent)
          // A parent that is missing from the file entirely is treated as the root.
          if (!parentReady) continue
          const parentId = localParent ? idMap.get(localParent) || null : null
          const hit = folders.find((item) => item.name === folder.name && (item.parentId || null) === parentId)
          const target = hit || { id: newId(), name: folder.name, parentId, createdAt: Date.now() }
          if (!hit) folders.push(target)
          idMap.set(folder.id, target.id)
          pending.splice(pending.indexOf(folder), 1)
          progress = true
        }
        if (!progress) {
          for (const folder of pending) {
            folders.push({ id: newId(), name: folder.name, parentId: null, createdAt: Date.now() })
          }
          pending.length = 0
        }
      }
      const items = current.items.slice()
      let added = 0
      for (const raw of source) {
        const item = normalizeItem(raw)
        if (!item) continue
        if (items.some((x) => x.code === item.code && x.lang === item.lang && x.kind === item.kind)) continue
        const mapped = item.folderId ? idMap.get(item.folderId) || null : null
        items.push({ ...item, folderId: mapped })
        added += 1
      }
      if (!added && !pending.length) return { added: 0, failed: false }
      return { added, failed: !writeState({ items, folders }) }
    }

    // ------------------------------------------------------- composer delivery

    const pending = []
    const insertListeners = new Set()

    function subscribeInsert(fn) {
      insertListeners.add(fn)
      return () => insertListeners.delete(fn)
    }

    function requestInsert(text, onResult) {
      if (typeof text !== 'string' || text === '') return
      const item = { text, onResult: typeof onResult === 'function' ? onResult : null, timer: 0 }
      pending.push(item)
      // Nothing consumes the queue when no conversation is open; report that instead of hanging.
      item.timer = window.setTimeout(() => {
        const index = pending.indexOf(item)
        if (index < 0) return
        pending.splice(index, 1)
        if (item.onResult) {
          try {
            item.onResult(false)
          } catch {}
        }
      }, 3000)
      for (const fn of Array.from(insertListeners)) {
        try {
          fn()
        } catch {}
      }
    }

    // ------------------------------------------------------------ quick picker

    // The picker lives in the frame-wide overlay so it works on every surface, but its open
    // state is module-level: a shortcut handler outside React flips it and every mounted copy
    // (there is exactly one) re-reads it.
    let quickOpen = false
    let quickQuery = ''
    const quickListeners = new Set()

    function quickEmit() {
      for (const fn of Array.from(quickListeners)) {
        try {
          fn()
        } catch {}
      }
    }

    function subscribeQuick(fn) {
      quickListeners.add(fn)
      return () => quickListeners.delete(fn)
    }

    function setQuickQuery(next) {
      quickQuery = next
      quickEmit()
    }

    function toggleQuick(force) {
      const next = typeof force === 'boolean' ? force : !quickOpen
      if (next === quickOpen) return
      quickOpen = next
      quickQuery = ''
      quickEmit()
    }

    // ---------------------------------------------------------------- shortcut

    const isMac = () => {
      try {
        return /mac/i.test(navigator.userAgent || '')
      } catch {
        return false
      }
    }

    // `mod` means ⌘ on macOS and Ctrl elsewhere, so one saved chord works on both platforms.
    function normalizeCombo(raw) {
      if (!raw || typeof raw !== 'object') return null
      const key = typeof raw.key === 'string' ? raw.key.toLowerCase().slice(0, 12) : ''
      if (!key) return null
      const combo = { mod: Boolean(raw.mod), shift: Boolean(raw.shift), alt: Boolean(raw.alt), key }
      return combo.mod || combo.alt ? combo : null
    }

    function readCombo() {
      try {
        const raw = window.localStorage.getItem(SHORTCUT_KEY)
        if (!raw) return DEFAULT_COMBO
        const parsed = normalizeCombo(JSON.parse(raw))
        return parsed || DEFAULT_COMBO
      } catch {
        return DEFAULT_COMBO
      }
    }

    function writeCombo(combo) {
      const next = normalizeCombo(combo) || DEFAULT_COMBO
      try {
        window.localStorage.setItem(SHORTCUT_KEY, JSON.stringify(next))
      } catch {
        return false
      }
      emit()
      return true
    }

    function comboLabel(combo) {
      const parts = []
      if (combo.mod) parts.push(isMac() ? '⌘' : 'Ctrl')
      if (combo.alt) parts.push(isMac() ? '⌥' : 'Alt')
      if (combo.shift) parts.push(isMac() ? '⇧' : 'Shift')
      parts.push(combo.key.length === 1 ? combo.key.toUpperCase() : combo.key)
      return parts.join(isMac() ? '' : '+')
    }

    function shortcutLabel() {
      return comboLabel(readCombo())
    }

    // Modifier-only presses are not a chord; letters, digits, function keys and named keys are.
    function eventToCombo(event) {
      const key = String(event.key || '')
      if (!key) return null
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Dead', 'Process', 'Unidentified'].includes(key)) return null
      const combo = {
        mod: Boolean(event.metaKey || event.ctrlKey),
        shift: Boolean(event.shiftKey),
        alt: Boolean(event.altKey),
        key: key.toLowerCase().slice(0, 12),
      }
      return combo.mod || combo.alt ? combo : null
    }

    function matchesCombo(combo, event) {
      if (!combo || !event) return false
      if (event.isComposing) return false
      const mod = Boolean(event.metaKey || event.ctrlKey)
      if (Boolean(event.shiftKey) !== combo.shift) return false
      if (Boolean(event.altKey) !== combo.alt) return false
      if (mod !== combo.mod) return false
      return String(event.key || '').toLowerCase() === combo.key
    }

    // Same chord string spelling as KNOWN_COMBOS so the conflict check is a plain includes().
    function comboConflictLabel(combo) {
      if (!combo) return ''
      const parts = []
      if (combo.alt) parts.push('Alt')
      if (combo.mod) parts.push('Mod')
      if (combo.shift) parts.push('Shift')
      const key = combo.key.length === 1 ? combo.key.toUpperCase() : combo.key
      parts.push(key)
      return parts.join('+')
    }

    // "Mod+Shift+K" -> the platform's own spelling, for the conflict warning.
    function prettyKnown(label) {
      const tokens = String(label).split('+')
      const combo = { mod: false, alt: false, shift: false, key: tokens[tokens.length - 1] }
      for (const token of tokens.slice(0, -1)) {
        if (token === 'Mod') combo.mod = true
        else if (token === 'Alt') combo.alt = true
        else if (token === 'Shift') combo.shift = true
      }
      return comboLabel(combo)
    }

    function comboKeys(combo) {
      const keys = []
      if (combo.mod) keys.push(isMac() ? '⌘' : 'Ctrl')
      if (combo.alt) keys.push(isMac() ? '⌥' : 'Alt')
      if (combo.shift) keys.push(isMac() ? '⇧' : 'Shift')
      keys.push(combo.key.length === 1 ? combo.key.toUpperCase() : combo.key)
      return keys
    }

    // A keycap strip instead of a text field: it reads like the chord you are about to press.
    function ShortcutRecorder(props) {
      const dict = t()
      const nodeRef = React.useRef(null)
      const [focused, setFocused] = React.useState(false)
      React.useEffect(() => {
        const node = nodeRef.current
        if (!node || typeof node.focus !== 'function') return
        try {
          node.focus({ preventScroll: true })
        } catch {
          try {
            node.focus()
          } catch {}
        }
      }, [])
      const keys = props.combo ? comboKeys(props.combo) : []
      return h(
        'div',
        {
          ref: nodeRef,
          role: 'button',
          tabIndex: 0,
          'aria-label': dict.shortcutTitle,
          style: focused ? { ...styles.recorder, ...styles.recorderOn } : styles.recorder,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          onKeyDown: props.onKeyDown,
        },
        keys.length
          ? keys.map((key, index) => h('span', { key: `${key}-${index}`, style: styles.keycap }, key))
          : h('span', { style: styles.recorderHint }, dict.shortcutRecording),
      )
    }

    // --------------------------------------------------------------- clipboard

    function copyText(text, done) {
      const report = typeof done === 'function' ? done : () => {}
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            () => report(true),
            () => report(fallbackCopy(text)),
          )
          return
        }
      } catch {}
      report(fallbackCopy(text))
    }

    function fallbackCopy(text) {
      try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return Boolean(ok)
      } catch {
        return false
      }
    }

    // ------------------------------------------------------------------ pieces

    const SKIP_LANGS = new Set(['math', 'diff', 'patch', 'mermaid', 'html-preview'])

    const styles = {
      root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        gap: 12,
        padding: '18px 20px 20px',
        boxSizing: 'border-box',
        color: 'var(--dsw-alias-label-primary)',
      },
      titleRow: { display: 'flex', alignItems: 'baseline', gap: 8 },
      selBar: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        border: '1px solid var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-interactive-bg-hover)',
        borderRadius: 8,
        padding: '6px 8px',
      },
      cardDragging: {
        opacity: 0.4,
        transform: 'scale(0.965)',
        transition: 'transform .12s ease, opacity .12s ease',
        boxShadow: 'none',
      },
      cardSelected: {
        borderColor: 'var(--dsw-alias-brand-primary)',
        background: 'var(--dsw-alias-bg-layer-2)',
      },
      check: {
        width: 15,
        height: 15,
        borderRadius: 4,
        flex: '0 0 auto',
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-base)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        lineHeight: 1,
        color: 'var(--dsw-alias-bg-base)',
        boxSizing: 'border-box',
      },
      checkOn: {
        background: 'var(--dsw-alias-brand-primary)',
        borderColor: 'var(--dsw-alias-brand-primary)',
      },
      overlay: {
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        background: 'var(--dsw-alias-bg-base)',
        opacity: 0.94,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
      },
      dialog: {
        width: '100%',
        maxWidth: 430,
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'var(--dsw-alias-bg-layer-1)',
        borderRadius: 12,
        padding: '16px 16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxHeight: '86%',
        overflowY: 'auto',
        boxShadow: '0 18px 50px rgba(0,0,0,0.26)',
        outline: 'none',
      },
      dialogTitle: { margin: 0, fontSize: 14, fontWeight: 600, lineHeight: '20px' },
      dialogText: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' },
      dialogError: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-state-error-primary)' },
      dialogActions: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 4 },
      linkButton: {
        border: 'none',
        background: 'transparent',
        padding: '4px 2px',
        fontSize: 12,
        color: 'var(--dsw-alias-label-tertiary)',
        cursor: 'pointer',
      },
      recorder: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        alignSelf: 'center',
        minWidth: 168,
        minHeight: 54,
        padding: '8px 18px',
        border: '1px dashed var(--dsw-alias-border-l2)',
        borderRadius: 10,
        background: 'var(--dsw-alias-bg-layer-2)',
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color .12s ease, background .12s ease',
      },
      recorderOn: {
        borderColor: 'var(--dsw-alias-brand-primary)',
        borderStyle: 'solid',
        background: 'var(--dsw-alias-interactive-bg-hover)',
      },
      keycap: {
        minWidth: 22,
        height: 24,
        padding: '0 6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderBottomWidth: 2,
        borderRadius: 5,
        background: 'var(--dsw-alias-bg-base)',
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1,
        color: 'var(--dsw-alias-label-primary)',
      },
      recorderHint: { margin: 0, fontSize: 12, textAlign: 'center', color: 'var(--dsw-alias-label-tertiary)' },
      guideStep: { margin: 0, fontSize: 13, lineHeight: '20px', color: 'var(--dsw-alias-label-primary)' },
      guideDivider: { height: 1, background: 'var(--dsw-alias-border-l1)', margin: '2px 0' },
      guideLine: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' },
      guideNote: { margin: 0, fontSize: 11, lineHeight: '16px', color: 'var(--dsw-alias-label-tertiary)' },
      preview: {
        margin: 0,
        padding: '8px 10px',
        maxHeight: 140,
        overflow: 'auto',
        fontSize: 12,
        lineHeight: '17px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        color: 'var(--dsw-alias-label-secondary)',
        background: 'var(--dsw-alias-markdown-code-block)',
        borderRadius: 8,
        whiteSpace: 'pre-wrap',
      },
      title: { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: '22px' },
      badge: {
        fontSize: 12,
        color: 'var(--dsw-alias-label-tertiary)',
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: 999,
        padding: '0 8px',
        lineHeight: '18px',
      },
      subtitle: { margin: 0, fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' },
      toolbar: { display: 'flex', alignItems: 'center', gap: 8 },
      input: {
        flex: 1,
        minWidth: 0,
        height: 32,
        padding: '0 10px',
        fontSize: 13,
        color: 'var(--dsw-alias-label-primary)',
        background: 'var(--dsw-alias-bg-layer-1)',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 8,
        outline: 'none',
      },
      chipRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
      list: { display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 },
      scroll: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4, overscrollBehavior: 'contain' },
      card: {
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },
      cardHead: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 },
      cardTitle: {
        fontSize: 13,
        fontWeight: 600,
        minWidth: 0,
        whiteSpace: 'normal',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        wordBreak: 'break-word',
        lineHeight: 1.4,
      },
      meta: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', whiteSpace: 'nowrap' },
      pre: {
        margin: 0,
        padding: '8px 10px',
        maxHeight: 132,
        overflow: 'auto',
        fontSize: 12,
        lineHeight: '18px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        color: 'var(--dsw-alias-label-secondary)',
        background: 'var(--dsw-alias-markdown-code-block)',
        borderRadius: 8,
        whiteSpace: 'pre',
      },
      actions: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
      empty: {
        margin: 'auto 0',
        fontSize: 13,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-tertiary)',
        textAlign: 'center',
        maxWidth: 340,
        alignSelf: 'center',
      },
      headRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 },
      help: {
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      },
      helpTitle: { margin: 0, fontSize: 13, fontWeight: 600, lineHeight: '20px', color: 'var(--dsw-alias-label-primary)' },
      helpText: { margin: 0, fontSize: 13, lineHeight: '20px', color: 'var(--dsw-alias-label-secondary)' },
      notice: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-state-success-primary)' },
      helpNote: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' },
      // Composer dock: only the button opts back into pointer events.
      dockBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        padding: '2px 2px 0',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary)',
        pointerEvents: 'auto',
      },
      dockNote: { color: 'var(--dsw-alias-state-success-primary)' },
      dockButton: {
        height: 22,
        padding: '0 8px',
        fontSize: 12,
        lineHeight: '20px',
        color: 'var(--dsw-alias-label-secondary)',
        background: 'transparent',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 6,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      },
      // Frame-wide quick picker.
      quickBackdrop: {
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        background: 'rgba(0,0,0,0.28)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '12vh 16px 16px',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
      },
      quickCard: {
        width: '100%',
        maxWidth: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 10,
        background: 'var(--dsw-alias-bg-layer-1)',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 12,
        boxShadow: '0 18px 44px rgba(0,0,0,0.28)',
        boxSizing: 'border-box',
      },
      quickInput: {
        height: 34,
        padding: '0 10px',
        fontSize: 13,
        color: 'var(--dsw-alias-label-primary)',
        background: 'var(--dsw-alias-bg-base)',
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 8,
        outline: 'none',
      },
      quickList: { display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '46vh', overflowY: 'auto' },
      quickRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '7px 9px',
        textAlign: 'left',
        color: 'var(--dsw-alias-label-primary)',
        background: 'transparent',
        border: '1px solid transparent',
        borderRadius: 7,
        cursor: 'pointer',
        fontSize: 13,
        lineHeight: '18px',
      },
      quickRowActive: {
        background: 'var(--dsw-alias-interactive-bg-hover)',
        borderColor: 'var(--dsw-alias-brand-primary)',
      },
      quickTitle: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      quickLang: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', whiteSpace: 'nowrap' },
      quickEmpty: {
        padding: '14px 10px',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary)',
        textAlign: 'center',
      },
      quickFoot: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 4px 2px',
        fontSize: 11,
        lineHeight: '16px',
        color: 'var(--dsw-alias-label-tertiary)',
      },
      quickNote: { color: 'var(--dsw-alias-state-error-primary)' },
      quickCount: { marginLeft: 'auto' },
    }

    function button(label, onClick, options) {
      const opts = options || {}
      const style = {
        height: 26,
        padding: '0 9px',
        fontSize: 12,
        lineHeight: '24px',
        color: opts.primary
          ? 'var(--dsw-alias-bg-base)'
          : opts.subtle
            ? 'var(--dsw-alias-label-tertiary)'
            : opts.danger
            ? 'var(--dsw-alias-state-error-primary)'
            : 'var(--dsw-alias-label-secondary)',
        background: opts.primary ? 'var(--dsw-alias-button-primary-fill)' : 'transparent',
        border: opts.primary
          ? '1px solid transparent'
          : opts.subtle
            ? '1px solid transparent'
            : '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 6,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }
      return h('button', { type: 'button', style, title: opts.title, onClick, disabled: opts.disabled }, label)
    }

    function chip(label, active, onClick) {
      return h(
        'button',
        {
          type: 'button',
          onClick,
          style: {
            height: 24,
            padding: '0 9px',
            fontSize: 12,
            lineHeight: '22px',
            borderRadius: 999,
            cursor: 'pointer',
            color: active ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-label-tertiary)',
            background: active ? 'var(--dsw-alias-interactive-bg-hover)' : 'transparent',
            border: `1px solid ${active ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l1)'}`,
          },
        },
        label,
      )
    }

    function formatDate(ts) {
      try {
        const d = new Date(ts)
        return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      } catch {
        return ''
      }
    }

    /** Leave the global panel and return to the Conversation. */
    function backToConversation() {
      try {
        const service = layoutOf()
        if (service && typeof service.selectPanel === 'function') {
          // The Conversation is not a registered main panel: the shell shows it when no
          // global panel is selected, so the way back is selectPanel(null).
          service.selectPanel(null)
          return true
        }
      } catch (error) {
        console.error('[code-vault] could not return to the conversation', error)
        return false
      }
      console.warn('[code-vault] layout service unavailable — cannot leave this panel')
      return false
    }

    // --------------------------------------------------------------- selection

    function joinCodes(items) {
      return items.map((item) => item.code.replace(/\s+$/, '')).join('\n\n')
    }

    // One fenced block per entry, in list order, each headed by its own title: pasting the
    // result into a chat keeps every language's highlighting intact.
    function mergeText(items) {
      const block = []
      for (const item of items) {
        const name = String(item.title || item.lang || 'code')
          .replace(/\s+/g, ' ')
          .trim()
        const fence = /^[A-Za-z0-9_+#.-]{1,24}$/.test(item.lang || '') ? item.lang : ''
        block.push(`### ${name}`)
        block.push('```' + fence)
        block.push(item.code.replace(/\s+$/, ''))
        block.push('```')
        block.push('')
      }
      return block.join('\n').replace(/\s+$/, '') + '\n'
    }

    function defaultMergeTitle(items) {
      const first = items[0]
      const base = String((first && first.title) || 'Code').slice(0, 48)
      return `${base} +${Math.max(items.length - 1, 0)}`
    }

    /** Modal confirmation: Escape, backdrop click, and a first-focus all handled here. */
    // ---------------------------------------------------------------- code editor

    const EDIT_INDENT = '  '
    const EDIT_PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
    const EDIT_CLOSERS = new Set([')', ']', '}', '"', "'", '`'])
    const EDIT_OPEN_END = /[{\[(:]\s*$/

    const lineStartAt = (text, pos) => text.lastIndexOf('\n', Math.max(0, pos - 1)) + 1
    const indentAt = (text, pos) => {
      const from = lineStartAt(text, pos)
      const match = /^[ \t]*/.exec(text.slice(from, pos))
      return match ? match[0] : ''
    }
    const lineNumberAt = (text, pos) => text.slice(0, Math.max(0, pos)).split('\n').length

    // Cheap syntax feedback: bracket pairing plus a real parse for JSON and plain JS.
    // Nothing here runs the snippet — `new Function` only compiles it.
    const COMMENT_PREFIX = (lang) => {
      if (/^(sql|postgres|postgresql|mysql|sqlite|plsql|tsql)$/.test(lang)) return '--'
      if (/^(py|python|sh|bash|zsh|shell|console|yaml|yml|toml|ini|ruby|rb|r|perl|make|makefile)$/.test(lang)) return '#'
      if (/^(js|javascript|mjs|cjs|ts|typescript|tsx|jsx|java|c|cpp|csharp|cs|go|rust|rs|swift|kt|kotlin|scala|php|json5)$/.test(lang)) return '//'
      return ''
    }

    // Bracket counting is naive, so anything after a line comment is blanked out
    // first — otherwise `-- see (1` in a comment would report a phantom error.
    const maskComments = (code, lang) => {
      const prefix = COMMENT_PREFIX(lang)
      if (!prefix) return code
      return code
        .split('\n')
        .map((line) => {
          const at = line.indexOf(prefix)
          if (at < 0) return line
          return line.slice(0, at) + ' '.repeat(line.length - at)
        })
        .join('\n')
    }

    const LINT_MAX = 8
    const LINT_SCAN_MAX = 20000

    const lintCode = (code, lang, titleEmpty, dict) => {
      const issues = []
      const lower = String(lang || '').toLowerCase()
      const source = maskComments(code.length > LINT_SCAN_MAX ? code.slice(0, LINT_SCAN_MAX) : code, lower)

      // Walking the whole snippet (not stopping at the first mismatch) means one
      // pass can report every stray bracket, which is what people fix in batches.
      const stack = []
      let quote = ''
      for (let i = 0; i < source.length; i += 1) {
        const ch = source[i]
        if (quote) {
          if (ch === '\\') i += 1
          else if (ch === quote) quote = ''
          continue
        }
        if (ch === '"' || ch === "'" || ch === '`') {
          quote = ch
          continue
        }
        if (ch === '(' || ch === '[' || ch === '{') {
          stack.push({ ch, at: i })
          continue
        }
        if (ch === ')' || ch === ']' || ch === '}') {
          const open = stack.pop()
          if (!open || EDIT_PAIRS[open.ch] !== ch) {
            const line = lineNumberAt(source, i)
            issues.push({ level: 'error', line, text: dict.lintExtra(line, ch) })
          }
        }
      }
      if (stack.length) {
        const seen = new Set()
        for (const open of stack) {
          const line = lineNumberAt(source, open.at)
          if (seen.has(line)) continue
          seen.add(line)
          issues.push({ level: 'error', line, text: dict.lintUnclosed(line) })
          if (seen.size >= 3) break
        }
      }

      if (/^(json|jsonc|json5)$/.test(lower)) {
        try {
          JSON.parse(code)
        } catch (error) {
          issues.push({ level: 'error', line: 1, text: dict.lintJson(String((error && error.message) || error)) })
        }
      } else if (/^(js|javascript|mjs|cjs|node)$/.test(lower)) {
        try {
          // eslint-disable-next-line no-new-func
          new Function(code)
        } catch (error) {
          issues.push({ level: 'error', line: 1, text: dict.lintJs(String((error && error.message) || error)) })
        }
      }

      const trailing = code.split('\n').filter((line) => /[ \t]+$/.test(line)).length
      if (trailing) issues.push({ level: 'warn', line: 0, text: dict.lintTrailing(trailing) })
      if (titleEmpty) issues.push({ level: 'info', line: 0, text: dict.lintTitleEmpty })

      const unique = []
      const keys = new Set()
      for (const issue of issues) {
        const key = `${issue.level}:${issue.text}`
        if (keys.has(key)) continue
        keys.add(key)
        unique.push(issue)
      }
      unique.sort((a, b) => (a.line || 999) - (b.line || 999))
      const total = unique.length
      const shown = unique.slice(0, LINT_MAX)
      return { issues: shown, total }
    }

    function CodeEditor(props) {
      const dict = t()
      const value = typeof props.value === 'string' ? props.value : ''
      const textRef = React.useRef(null)
      const gutterRef = React.useRef(null)
      const caretRef = React.useRef(null)
      const lines = value.split('\n')
      const report = lintCode(value, props.lang, Boolean(props.titleEmpty), dict)
      const issues = report.issues
      const lintRef = React.useRef(null)
      const [wide, setWide] = React.useState(false)
      const errorLines = new Set(issues.filter((issue) => issue.level === 'error' && issue.line).map((issue) => issue.line))
      const warnLines = new Set(issues.filter((issue) => issue.level === 'warn' && issue.line).map((issue) => issue.line))

      // A controlled textarea loses the caret on every edit, so the position is
      // stashed and re-applied after React commits the new value.
      React.useEffect(() => {
        const spot = caretRef.current
        const node = textRef.current
        caretRef.current = null
        if (!spot || !node || typeof node.setSelectionRange !== 'function') return
        try {
          node.focus({ preventScroll: true })
          node.setSelectionRange(spot.start, spot.end)
        } catch {}
      })

      const commit = (next, start, end) => {
        caretRef.current = { start, end: end === undefined ? start : end }
        props.onChange(next)
      }

      const onKeyDown = (event) => {
        const node = event.currentTarget || {}
        const text = typeof node.value === 'string' ? node.value : value
        const start = typeof node.selectionStart === 'number' ? node.selectionStart : text.length
        const end = typeof node.selectionEnd === 'number' ? node.selectionEnd : start
        const key = event.key
        const mod = event.metaKey || event.ctrlKey

        if (mod && (key === 's' || key === 'S')) {
          event.preventDefault()
          props.onSave()
          return
        }

        if (key === 'Tab') {
          event.preventDefault()
          if (event.shiftKey) {
            const from = lineStartAt(text, start)
            const width = /^ {1,2}/.exec(text.slice(from)) ? /^ {1,2}/.exec(text.slice(from))[0].length : 0
            if (!width) return
            commit(text.slice(0, from) + text.slice(from + width), Math.max(from, start - width))
            return
          }
          commit(text.slice(0, start) + EDIT_INDENT + text.slice(end), start + EDIT_INDENT.length)
          return
        }

        if (key === 'Enter') {
          event.preventDefault()
          const base = indentAt(text, start)
          const currentLine = text.slice(lineStartAt(text, start), start)
          const opens = EDIT_OPEN_END.test(currentLine)
          const closesNext = /^\s*[)\]}]/.test(text.slice(end))
          const extra = opens ? EDIT_INDENT : ''
          if (opens && closesNext) {
            const insertion = `\n${base}${EDIT_INDENT}\n${base}`
            commit(text.slice(0, start) + insertion + text.slice(end), start + 1 + base.length + EDIT_INDENT.length)
            return
          }
          const insertion = `\n${base}${extra}`
          commit(text.slice(0, start) + insertion + text.slice(end), start + insertion.length)
          return
        }

        if (key === 'Backspace' && start === end && start > 0) {
          const before = text[start - 1]
          const after = text[start]
          if (EDIT_PAIRS[before] && EDIT_PAIRS[before] === after) {
            event.preventDefault()
            commit(text.slice(0, start - 1) + text.slice(start + 1), start - 1)
          }
          return
        }

        if (key.length === 1 && start === end) {
          const pair = EDIT_PAIRS[key]
          if (pair) {
            event.preventDefault()
            commit(text.slice(0, start) + key + pair + text.slice(end), start + 1)
            return
          }
          if (EDIT_CLOSERS.has(key) && text[start] === key) {
            event.preventDefault()
            commit(text, start + 1)
          }
        }
      }

      const jumpTo = (line) => {
        if (!line) return
        const wanted = Math.max(0, line - 1)
        let pos = 0
        for (let i = 0; i < wanted; i += 1) {
          const next = value.indexOf('\n', pos)
          if (next < 0) break
          pos = next + 1
        }
        caretRef.current = { start: pos, end: pos }
        setCaretPing((prev) => prev + 1)
      }
      const [, setCaretPing] = React.useState(0)
      const onScroll = (event) => {
        const gutter = gutterRef.current
        if (gutter && event.currentTarget) gutter.scrollTop = event.currentTarget.scrollTop
      }

      return h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        h(
          'div',
          { style: styles.editorRow },
          h(
            'div',
            { ref: gutterRef, style: styles.gutter, 'aria-hidden': 'true' },
            lines.map((_, i) =>
              h(
                'div',
                {
                  key: i,
                  style: errorLines.has(i + 1)
                    ? styles.gutterBad
                    : warnLines.has(i + 1)
                      ? styles.gutterWarn
                      : null,
                },
                String(i + 1),
              ),
            ),
          ),
          h('textarea', {
            ref: textRef,
            value,
            wrap: 'off',
            spellCheck: false,
            'aria-label': dict.editCodeLabel,
            onChange: (event) => props.onChange(event.target.value),
            onKeyDown,
            onScroll,
            style: styles.editorArea,
          }),
        ),
        h(
          'div',
          { style: styles.lintHead },
          report.total ? h('span', { style: styles.lintCount }, dict.lintCount(report.total)) : null,
          h('span', { style: styles.lintHint }, dict.editorHelp),
          h(
            'button',
            {
              type: 'button',
              style: styles.lintToggle,
              'aria-expanded': wide ? 'true' : 'false',
              onClick: () => setWide(!wide),
            },
            wide ? dict.lintCollapse : dict.lintExpand,
          ),
        ),
        h(
          'div',
          {
            ref: lintRef,
            className: 'cv-scroll',
            style: wide ? styles.lintBoxWide : styles.lintBox,
          },
          issues.length
            ? issues.map((issue, i) =>
                h(
                  'button',
                  {
                    key: i,
                    type: 'button',
                    title: dict.jumpHint,
                    style: {
                      ...styles.lintRow,
                      color:
                        issue.level === 'error'
                          ? 'var(--dsw-alias-state-error-primary)'
                          : issue.level === 'warn'
                            ? 'var(--dsw-alias-state-warn-primary)'
                            : 'var(--dsw-alias-label-tertiary)',
                      cursor: issue.line ? 'pointer' : 'default',
                    },
                    onClick: () => jumpTo(issue.line),
                  },
                  issue.text,
                ),
              )
            : h('span', { style: styles.lintOk }, dict.lintOk),
          report.total > issues.length
            ? h('span', { style: styles.lintMore }, dict.lintMore(report.total - issues.length))
            : null,
        ),
        h('style', {
          key: 'cv-scroll-css',
          dangerouslySetInnerHTML: {
            __html:
              '.cv-scroll{scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l3) var(--dsw-alias-bg-layer-1);}' +
              '.cv-scroll::-webkit-scrollbar{width:10px;height:10px;}' +
              '.cv-scroll::-webkit-scrollbar-track{background:var(--dsw-alias-bg-layer-1);border-radius:5px;}' +
              '.cv-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l3);border-radius:5px;}' +
              '.cv-scroll::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-label-tertiary);}',
          },
        }),
      )
    }

    function Dialog(props) {
      const dict = t()
      const cancelRef = React.useRef(props.onCancel)
      cancelRef.current = props.onCancel
      const nodeRef = React.useRef(null)

      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            cancelRef.current()
          }
        }
        document.addEventListener('keydown', onKey, true)
        const node = nodeRef.current
        // Focus the dialog itself; any input inside takes focus through autoFocus. The shortcut
        // recorder focuses its own keycap box instead, so it opts out.
        if (!props.noAutoFocus && node && typeof node.focus === 'function') {
          try {
            node.focus({ preventScroll: true })
          } catch {}
        }
        return () => document.removeEventListener('keydown', onKey, true)
      }, [])

      return h(
        'div',
        {
          style: styles.overlay,
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) cancelRef.current()
          },
        },
        h(
          'div',
          {
            ref: nodeRef,
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': props.title,
            tabIndex: -1,
            style: styles.dialog,
          },
          h('p', { style: styles.dialogTitle }, props.title),
          props.children,
          h(
            'div',
            { style: styles.dialogActions },
            props.left ? props.left : null,
            h('span', { style: { flex: 1 } }),
            props.singleAction ? null : button(dict.cancel, props.onCancel),
            button(props.confirmLabel || dict.create, props.onConfirm, {
              primary: true,
              danger: props.danger,
              disabled: props.disabled,
            }),
          ),
        ),
      )
    }

    // ------------------------------------------------------------------- panel

    function TagEditor(props) {
      const [open, setOpen] = React.useState(false)
      const [value, setValue] = React.useState('')
      const dict = t()
      if (!open) {
        return button(dict.addTag, () => setOpen(true), { title: dict.addTag })
      }
      const commit = () => {
        const tag = value.trim()
        if (tag && !props.tags.includes(tag)) props.onAdd(tag.slice(0, 24))
        setValue('')
        setOpen(false)
      }
      return h('input', {
        autoFocus: true,
        value,
        placeholder: dict.tagPlaceholder,
        onChange: (e) => setValue(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          } else if (e.key === 'Escape') {
            e.stopPropagation()
            setValue('')
            setOpen(false)
          }
        },
        style: { ...styles.input, flex: '0 0 150px', height: 24, fontSize: 12 },
      })
    }

    // Extra styles for the folder + draft layout, kept next to the components that use them.
    Object.assign(styles, {
      tabs: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' },
      tab: { font: 'inherit', cursor: 'pointer', border: '1px solid transparent', background: 'transparent', color: 'var(--dsw-alias-label-secondary)', borderRadius: 8, padding: '3px 10px', fontSize: 13 },
      tabOn: { color: 'var(--dsw-alias-label-primary)', background: 'var(--dsw-alias-bg-layer-2)', border: '1px solid var(--dsw-alias-border-l2)', fontWeight: 600 },
      tabsHint: { fontSize: 12, color: 'var(--dsw-alias-label-tertiary)', marginLeft: 4 },
      split: { display: 'flex', gap: 12, alignItems: 'flex-start' },
      tree: { width: 208, flex: '0 0 208px', display: 'flex', flexDirection: 'column', gap: 1, borderRight: '1px solid var(--dsw-alias-border-l2)', paddingRight: 10, minHeight: 120, position: 'sticky', top: 0, alignSelf: 'flex-start' },
      treeRow: { display: 'flex', alignItems: 'center', gap: 3, borderRadius: 8, padding: '4px 6px', cursor: 'pointer', fontSize: 13, color: 'var(--dsw-alias-label-secondary)', border: '1px solid transparent' },
      treeRowOn: { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)', fontWeight: 600, boxShadow: 'inset 2px 0 0 var(--dsw-alias-brand-primary)' },
      treeRowDrop: { border: '1px dashed var(--dsw-alias-brand-primary)', background: 'var(--dsw-alias-bg-layer-2)' },
      treeChev: { width: 16, height: 16, lineHeight: '14px', textAlign: 'center', fontSize: 10, color: 'var(--dsw-alias-label-tertiary)', border: 0, background: 'transparent', cursor: 'pointer', padding: 0, flex: '0 0 16px' },
      treeName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      treeCount: { marginLeft: 'auto', fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', fontVariantNumeric: 'tabular-nums' },
      treeSep: { height: 1, background: 'var(--dsw-alias-border-l2)', margin: '4px 2px' },
      main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 },
      crumbRow: { display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', minHeight: 22 },
      crumb: { font: 'inherit', cursor: 'pointer', border: 0, background: 'transparent', color: 'var(--dsw-alias-label-secondary)', padding: 0, fontSize: 12 },
      crumbOn: { color: 'var(--dsw-alias-label-primary)', fontWeight: 600 },
      crumbSep: { color: 'var(--dsw-alias-label-tertiary)', fontSize: 11 },
      cardFoot: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
      moreRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 2, borderTop: '1px dashed var(--dsw-alias-border-l2)', marginTop: 2 },
      folderBadge: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', background: 'var(--dsw-alias-bg-layer-2)', borderRadius: 999, padding: '1px 7px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      draftRow: { border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 10, padding: 10, background: 'var(--dsw-alias-bg-layer-1)', display: 'flex', flexDirection: 'column', gap: 5 },
      moveList: { display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 220, overflow: 'auto', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 8, padding: 3 },
      moveRow: { display: 'flex', alignItems: 'center', gap: 8, borderRadius: 7, padding: '6px 8px', cursor: 'pointer', fontSize: 13, color: 'var(--dsw-alias-label-secondary)', border: '1px solid transparent', marginBottom: 2 },
      moveRowHover: { background: 'var(--dsw-alias-interactive-bg-hover)', borderColor: 'var(--dsw-alias-border-l2)' },
      moveRowOn: { background: 'var(--dsw-alias-interactive-bg-hover)', borderColor: 'var(--dsw-alias-brand-primary)', color: 'var(--dsw-alias-label-primary)', fontWeight: 600 },
      moveDot: { flex: '0 0 14px', width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--dsw-alias-border-l3)', boxSizing: 'border-box' },
      moveDotOn: { flex: '0 0 14px', width: 14, height: 14, borderRadius: '50%', border: '4px solid var(--dsw-alias-brand-primary)', background: 'var(--dsw-alias-bg-base)', boxSizing: 'border-box' },
      moveLabel: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      moveCheck: { fontSize: 12, color: 'var(--dsw-alias-brand-primary)' },
      moveRowOn: { background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)', fontWeight: 600 },
      editTitle: { width: '100%', boxSizing: 'border-box', minHeight: 34, maxHeight: 96, resize: 'vertical', fontFamily: 'inherit', fontSize: 13, lineHeight: '18px', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)', color: 'var(--dsw-alias-label-primary)', outline: 'none' },
      editorRow: {
        display: 'flex',
        alignItems: 'stretch',
        maxHeight: 300,
        border: '1px solid var(--dsw-alias-border-l2)',
        borderRadius: 8,
        background: 'var(--dsw-alias-bg-base)',
        overflow: 'hidden',
      },
      gutter: {
        flex: '0 0 36px',
        padding: '8px 6px 8px 0',
        textAlign: 'right',
        overflow: 'hidden',
        userSelect: 'none',
        fontSize: 12,
        lineHeight: '18px',
        color: 'var(--dsw-alias-label-tertiary)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        background: 'var(--dsw-alias-bg-layer-1)',
        fontVariantNumeric: 'tabular-nums',
      },
      editorArea: {
        flex: 1,
        minWidth: 0,
        minHeight: 150,
        resize: 'vertical',
        border: 0,
        outline: 'none',
        background: 'transparent',
        color: 'var(--dsw-alias-label-primary)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        lineHeight: '18px',
        padding: 8,
        whiteSpace: 'pre',
        overflow: 'auto',
      },
      trashRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        border: '1px solid var(--dsw-alias-border-l1)',
        borderRadius: 10,
        background: 'var(--dsw-alias-card-fill)',
      },
      trashHead: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        color: 'var(--dsw-alias-label-tertiary)',
      },
      lintHead: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 8,
        minHeight: 15,
      },
      lintBox: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        gap: 1,
        height: 52,
        overflowY: 'scroll',
        overflowX: 'hidden',
        paddingRight: 4,
        resize: 'vertical',
      },
      lintBoxWide: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        gap: 1,
        height: 200,
        overflowY: 'scroll',
        overflowX: 'hidden',
        paddingRight: 4,
        resize: 'vertical',
      },
      lintToggle: {
        border: '1px solid var(--dsw-alias-border-l2)',
        background: 'transparent',
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: 10,
        lineHeight: '14px',
        padding: '1px 6px',
        borderRadius: 5,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      },
      lintHint: { fontSize: 10, color: 'var(--dsw-alias-label-tertiary)', whiteSpace: 'nowrap' },
      lintRow: {
        border: 0,
        background: 'transparent',
        padding: 0,
        textAlign: 'left',
        fontSize: 11,
        lineHeight: '16px',
        fontFamily: 'inherit',
        display: 'block',
        maxWidth: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      lintOk: { fontSize: 11, lineHeight: '16px', color: 'var(--dsw-alias-state-success-primary)' },
      lintCount: { fontSize: 10, color: 'var(--dsw-alias-state-warn-primary)', fontWeight: 600 },
      lintMore: { fontSize: 11, lineHeight: '16px', color: 'var(--dsw-alias-label-tertiary)' },
      gutterBad: { color: 'var(--dsw-alias-state-error-primary)', fontWeight: 600 },
      gutterWarn: { color: 'var(--dsw-alias-state-warn-primary)' },
      unsavedBadge: { color: 'var(--dsw-alias-state-warn-primary)' },
      editArea: { width: '100%', boxSizing: 'border-box', minHeight: 150, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.5, padding: 8, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-base)', color: 'var(--dsw-alias-label-primary)' },
      hint: { fontSize: 12, color: 'var(--dsw-alias-label-tertiary)' },
      folderBar: { display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' },
    })

    function folderLabelText(folders, folderId) {
      if (!folderId) return ''
      const chain = []
      let cursor = folderId
      let guard = 0
      while (cursor && guard < 50) {
        const folder = folders.find((item) => item.id === cursor)
        if (!folder) break
        chain.unshift(folder.name)
        cursor = folder.parentId
        guard += 1
      }
      return chain.join(' / ')
    }

    // A browser drags the whole element by default, which turns a 40-line block into a
    // card the size of the window. A small stand-in with the title and the first lines
    // keeps the target readable while the source card shrinks in place.
    const DRAG_GHOST_ID = 'code-vault-drag-ghost'
    const dragGhostFor = (asset) => {
      let node = document.getElementById(DRAG_GHOST_ID)
      if (!node) {
        node = document.createElement('div')
        node.id = DRAG_GHOST_ID
        document.body.appendChild(node)
      }
      node.setAttribute(
        'style',
        [
          'position:fixed',
          'top:-240px',
          'left:0',
          'width:264px',
          'padding:9px 11px',
          'border-radius:10px',
          'box-sizing:border-box',
          'border:1px solid var(--dsw-alias-brand-primary)',
          'background:var(--dsw-alias-bg-layer-1)',
          'box-shadow:0 12px 28px rgba(0,0,0,.22)',
          'pointer-events:none',
          'z-index:2147483000',
        ].join(';'),
      )
      node.textContent = ''
      const title = document.createElement('div')
      title.textContent = asset.title || titleOf(asset.code)
      title.setAttribute(
        'style',
        'font:600 12px/1.4 inherit;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
      )
      const body = document.createElement('div')
      body.textContent = previewOf(asset).split('\n').slice(0, 3).join('\n')
      body.setAttribute(
        'style',
        'margin-top:3px;max-height:48px;overflow:hidden;font:10px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--dsw-alias-label-secondary);white-space:pre',
      )
      const foot = document.createElement('div')
      foot.textContent = asset.tags.length ? `${asset.lang} · ${asset.tags.join(' · ')}` : asset.lang
      foot.setAttribute(
        'style',
        'margin-top:5px;font:10px/1.3 inherit;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
      )
      node.appendChild(title)
      node.appendChild(body)
      node.appendChild(foot)
      return node
    }

    function AssetCard(props) {
      const dict = t()
      const asset = props.asset
      const selectable = Boolean(props.selectable)
      const selected = Boolean(props.selected)
      const [flash, setFlash] = React.useState('')
      const [more, setMore] = React.useState(false)
      const [dragging, setDragging] = React.useState(false)
      const flashTimer = React.useRef(0)
      React.useEffect(() => () => window.clearTimeout(flashTimer.current), [])

      const say = (text) => {
        setFlash(text)
        window.clearTimeout(flashTimer.current)
        flashTimer.current = window.setTimeout(() => setFlash(''), 1200)
      }

      const tags = selectable
        ? null
        : asset.tags.map((tag, i) =>
            h(
              'button',
              {
                key: `${tag}-${i}`,
                type: 'button',
                title: dict.removeTagHint,
                onClick: () => props.onTag(asset.id, asset.tags.filter((_, index) => index !== i)),
                style: {
                  fontSize: 11,
                  lineHeight: '18px',
                  padding: '0 7px',
                  borderRadius: 999,
                  font: 'inherit',
                  cursor: 'pointer',
                  color: 'var(--dsw-alias-label-tertiary)',
                  background: 'var(--dsw-alias-bg-layer-2)',
                  border: '1px solid transparent',
                },
              },
              tag,
            ),
          )

      const head = h(
        'div',
        { style: styles.cardHead },
        selectable
          ? h(
              'span',
              { style: selected ? { ...styles.check, ...styles.checkOn } : styles.check, 'aria-hidden': true },
              selected ? '✓' : '',
            )
          : null,
        h('span', { style: styles.cardTitle, title: asset.title }, asset.title),
        asset.lang ? h('span', { style: styles.meta }, asset.lang) : null,
        props.folderLabel ? h('span', { style: styles.folderBadge, title: props.folderLabel }, props.folderLabel) : null,
        h('span', { style: { ...styles.meta, marginLeft: 'auto' } }, formatDate(asset.createdAt)),
      )

      const preview = previewOf(asset)
      const body = h(
        'pre',
        { style: styles.pre },
        preview.length > 4000 ? `${preview.slice(0, 4000)}\n…` : preview,
      )

      // In select mode the whole card is the hit target and the per-card actions step aside, so
      // a click can never mean two things at once.
      if (selectable) {
        return h(
          'div',
          {
            style: selected ? { ...styles.card, ...styles.cardSelected, cursor: 'pointer' } : { ...styles.card, cursor: 'pointer' },
            role: 'checkbox',
            'aria-checked': selected,
            'aria-label': asset.title,
            tabIndex: 0,
            onClick: () => props.onToggle(asset.id),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                props.onToggle(asset.id)
              }
            },
          },
          head,
          body,
        )
      }

      return h(
        'div',
        {
          style: dragging ? { ...styles.card, ...styles.cardDragging } : styles.card,
          draggable: true,
          title: dict.dragHint,
          onDragStart: (event) => {
            try {
              event.dataTransfer.setData('text/plain', asset.id)
              event.dataTransfer.effectAllowed = 'move'
              if (typeof event.dataTransfer.setDragImage === 'function') {
                event.dataTransfer.setDragImage(dragGhostFor(asset), 20, 18)
              }
            } catch {}
            setDragging(true)
          },
          onDragEnd: () => setDragging(false),
        },
        head,
        body,
        h(
          'div',
          { style: styles.actions },
          tags && tags.length ? h('div', { style: { display: 'flex', gap: 4, flexWrap: 'wrap' } }, tags) : null,
          h(TagEditor, { tags: asset.tags, onAdd: (tag) => props.onTag(asset.id, [...asset.tags, tag]) }),
          h('span', { style: { flex: 1 } }),
          flash ? h('span', { style: { ...styles.meta, color: 'var(--dsw-alias-state-success-primary)' } }, flash) : null,
          button(dict.copy, () => {
            copyText(asset.code, (ok) => say(ok ? dict.copied : dict.copyFailed))
          }),
          button(dict.insert, () => {
            // The composer only exists in the Conversation view, so leave this panel first;
            // the dock bridge drains the queue as soon as it mounts.
            backToConversation()
            requestInsert(asset.code, (ok) => say(ok ? dict.inserted : dict.noSession))
          }),
          button(`${more ? dict.less : dict.more} ▾`, () => setMore(!more), {
            title: dict.more,
            'aria-expanded': more,
          }),
        ),
        more
          ? h(
              'div',
              { style: styles.moreRow },
              button(dict.edit, () => props.onEdit(asset.id)),
              button(dict.move, () => props.onMove([asset.id])),
              h('span', { style: { flex: 1 } }),
              button(dict.remove, () => props.onAskRemove(asset.id), { danger: true }),
            )
          : null,
      )
    }

    function DraftRow(props) {
      const dict = t()
      const asset = props.asset
      const [flash, setFlash] = React.useState('')
      const flashTimer = React.useRef(0)
      React.useEffect(() => () => window.clearTimeout(flashTimer.current), [])
      const say = (text) => {
        setFlash(text)
        window.clearTimeout(flashTimer.current)
        flashTimer.current = window.setTimeout(() => setFlash(''), 1200)
      }
      const preview = previewOf(asset)
      const head = h(
        'div',
        { style: styles.cardHead },
        props.selectable
          ? h(
              'span',
              { style: props.selected ? { ...styles.check, ...styles.checkOn } : styles.check, 'aria-hidden': true },
              props.selected ? '✓' : '',
            )
          : null,
        h('span', { style: styles.cardTitle, title: asset.title }, asset.title),
        h('span', { style: { ...styles.meta, marginLeft: 'auto' } }, formatDate(asset.createdAt)),
      )
      const body = h('pre', { style: styles.pre }, preview.length > 900 ? `${preview.slice(0, 900)}\n…` : preview)
      if (props.selectable) {
        return h(
          'div',
          {
            style: props.selected ? { ...styles.draftRow, ...styles.cardSelected, cursor: 'pointer' } : { ...styles.draftRow, cursor: 'pointer' },
            role: 'checkbox',
            'aria-checked': props.selected,
            'aria-label': asset.title,
            tabIndex: 0,
            onClick: () => props.onToggle(asset.id),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                props.onToggle(asset.id)
              }
            },
          },
          head,
          body,
        )
      }
      return h(
        'div',
        { style: styles.draftRow },
        head,
        body,
        h(
          'div',
          { style: styles.cardFoot },
          flash ? h('span', { style: { ...styles.meta, color: 'var(--dsw-alias-state-success-primary)' } }, flash) : null,
          h('span', { style: { flex: 1 } }),
          button(dict.insert, () => {
            backToConversation()
            requestInsert(asset.code, (ok) => say(ok ? dict.inserted : dict.noSession))
          }),
          button(dict.toFavorites, () => props.onMove(asset.id)),
          button(dict.edit, () => props.onEdit(asset.id)),
          button(dict.remove, () => props.onAskRemove(asset.id), { danger: true }),
        ),
      )
    }

    // A plain recursive list instead of a tree widget: folders read top-down, the chevron only
    // shows when there is something to unfold, and every row is a drop target for a card.
    const formatStamp = (stamp) => {
      const date = new Date(stamp)
      const pad = (n) => String(n).padStart(2, '0')
      return `${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function TrashRow(props) {
      const dict = t()
      const asset = props.asset
      const preview = previewOf(asset)
      return h(
        'div',
        { style: styles.trashRow },
        h(
          'div',
          { style: styles.cardHead },
          h('span', { style: styles.cardTitle, title: asset.title }, asset.title),
          h('span', { style: styles.meta }, asset.lang || 'text'),
          h('span', { style: { ...styles.meta, marginLeft: 'auto' } }, dict.deletedOn(formatStamp(asset.trashedAt))),
        ),
        h('pre', { style: styles.pre }, preview.length > 600 ? `${preview.slice(0, 600)}\n…` : preview),
        h(
          'div',
          { style: styles.cardFoot },
          h('span', { style: { flex: 1 } }),
          button(dict.restore, () => props.onRestore(asset.id)),
          button(dict.deleteForever, () => props.onPurge(asset.id), { danger: true }),
        ),
      )
    }

    function FolderTree(props) {
      const dict = t()
      const children = new Map()
      for (const folder of props.folders) {
        const key = folder.parentId || ''
        if (!children.has(key)) children.set(key, [])
        children.get(key).push(folder)
      }
      for (const list of children.values()) list.sort((a, b) => a.name.localeCompare(b.name))

      const rows = []
      const row = (key, label, count, depth, opts) => {
        const active = props.current === key
        const drop = props.dragOver === key
        const style = { ...styles.treeRow, paddingLeft: 4 + depth * 12 }
        if (active) Object.assign(style, styles.treeRowOn)
        if (drop) Object.assign(style, styles.treeRowDrop)
        return h(
          'div',
          {
            key,
            style,
            role: 'treeitem',
            'aria-selected': active,
            tabIndex: 0,
            title: label,
            onClick: () => props.onSelect(key),
            onKeyDown: (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                props.onSelect(key)
              }
            },
            onDragOver: (event) => {
              if (!opts.droppable) return
              event.preventDefault()
              props.onDragOver(key)
            },
            onDragLeave: () => {
              if (opts.droppable && props.dragOver === key) props.onDragOver(null)
            },
            onDrop: (event) => {
              if (!opts.droppable) return
              event.preventDefault()
              props.onDragOver(null)
              props.onDrop(event, key)
            },
          },
          opts.toggle
            ? h(
                'button',
                {
                  type: 'button',
                  style: styles.treeChev,
                  title: dict.folderName,
                  'aria-hidden': true,
                  onClick: (event) => {
                    event.stopPropagation()
                    props.onToggle(key)
                  },
                },
                props.expanded.includes(key) ? '▾' : '▸',
              )
            : h('span', { style: { ...styles.treeChev, visibility: 'hidden' } }, '▸'),
          h('span', { style: styles.treeName }, label),
          h('span', { style: styles.treeCount }, String(count || 0)),
        )
      }

      const walk = (parentId, depth) => {
        for (const folder of children.get(parentId) || []) {
          const kids = children.get(folder.id) || []
          rows.push(
            row(folder.id, folder.name, props.counts.get(folder.id), depth, {
              droppable: true,
              toggle: kids.length > 0,
            }),
          )
          if (kids.length && props.expanded.includes(folder.id)) walk(folder.id, depth + 1)
        }
      }

      walk('', 0)

      const list = [
        row('all', dict.allItems, props.snippetCount, 0, { droppable: false, toggle: false }),
        ...rows,
      ]
      list.push(h('div', { key: 'sep', style: styles.treeSep, 'aria-hidden': true }))
      list.push(row('unfiled', dict.unfiled, props.unfiledCount, 0, { droppable: true, toggle: false }))
      return h('div', { style: styles.tree, role: 'tree', 'aria-label': dict.favorites }, list)
    }

    function HelpBlock(props) {
      const dict = t()
      return h(
        'div',
        { style: styles.help },
        props.showTitle ? h('p', { style: styles.helpTitle }, dict.empty) : null,
        h('p', { style: styles.helpText }, dict.step1),
        h('p', { style: styles.helpText }, dict.step2),
        h('p', { style: styles.helpText }, dict.step3),
        h('p', { style: styles.helpText }, `${dict.step4} (${shortcutLabel()})`),
        h('p', { style: styles.helpNote }, dict.localOnly),
        h(
          'div',
          { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
          button(dict.openChat, props.onOpenChat, { primary: true }),
          props.onShortcut ? button(`${dict.changeShortcut} (${shortcutLabel()})`, props.onShortcut) : null,
        ),
      )
    }

    function Panel() {
      const dict = t()
      const [items, setItems] = React.useState(() => readAll().slice())
      const [trash, setTrash] = React.useState(() => readTrash().slice())
      const [shortDraft, setShortDraft] = React.useState(null)
      const [shortError, setShortError] = React.useState('')
      const [folders, setFolders] = React.useState(() => readState().folders.slice())
      const [tab, setTab] = React.useState('favorites')
      const [current, setCurrent] = React.useState('all')
      const [expanded, setExpanded] = React.useState([])
      const [query, setQuery] = React.useState('')
      const [langFilter, setLangFilter] = React.useState('')
      const [helpOpen, setHelpOpen] = React.useState(() => readAll().length === 0)
      const [notice, setNotice] = React.useState('')
      const [noticeError, setNoticeError] = React.useState(false)
      const noticeTimer = React.useRef(0)
      const fileRef = React.useRef(null)
      const [selectMode, setSelectMode] = React.useState(false)
      const [selected, setSelected] = React.useState([])
      const [dialog, setDialog] = React.useState(null)
      const [dialogError, setDialogError] = React.useState('')
      const [tagDraft, setTagDraft] = React.useState('')
      const [mergeTitle, setMergeTitle] = React.useState('')
      const [nameDraft, setNameDraft] = React.useState('')
      const [editTitle, setEditTitle] = React.useState('')
      const [editCode, setEditCode] = React.useState('')
      const [editLang, setEditLang] = React.useState('text')
      const [editBase, setEditBase] = React.useState({ title: '', code: '' })
      const [movePick, setMovePick] = React.useState('root')
      const [moveHover, setMoveHover] = React.useState('')
      const [dragOver, setDragOver] = React.useState(null)

      const announce = (text, error) => {
        setNotice(text)
        setNoticeError(Boolean(error))
        window.clearTimeout(noticeTimer.current)
        noticeTimer.current = window.setTimeout(() => setNotice(''), error ? 4000 : 2400)
      }
      React.useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

      React.useEffect(
        () =>
          subscribe(() => {
            setItems(readAll().slice())
            setTrash(readTrash().slice())
            setFolders(readState().folders.slice())
          }),
        [],
      )

      // Selection lives by id: entries removed here, in another tab, or by an import silently
      // drop out instead of leaving a phantom count behind.
      React.useEffect(() => {
        setSelected((prev) => {
          const next = prev.filter((id) => items.some((item) => item.id === id))
          return next.length === prev.length ? prev : next
        })
      }, [items])

      // A folder can disappear (deleted here or in another tab); fall back to the full list.
      React.useEffect(() => {
        if (current === 'all' || current === 'unfiled') return
        if (!folders.some((folder) => folder.id === current)) setCurrent('all')
      }, [folders, current])

      const snippets = items.filter((item) => item.kind === 'snippet')
      const drafts = items.filter((item) => item.kind === 'draft')
      const tabItems = tab === 'drafts' ? drafts : tab === 'trash' ? trash : snippets
      const needle = query.trim().toLowerCase()
      const searching = needle !== ''
      const within = (item) => {
        if (searching) return true
        if (current === 'all') return true
        if (current === 'unfiled') return !item.folderId
        return item.folderId === current
      }
      const view = tabItems.filter(
        (item) =>
          (tab === 'trash' || within(item)) &&
          (!langFilter || item.lang === langFilter) &&
          (!searching || searchTextOf(item).includes(needle)),
      )

      const langs = []
      for (const item of tabItems) {
        if (item.lang && !langs.includes(item.lang)) langs.push(item.lang)
      }
      langs.sort()

      // Folder badges count every snippet underneath, so a parent folder answers "how much is in
      // here" without unfolding it.
      const counts = new Map()
      for (const item of snippets) {
        let cursor = item.folderId
        const seen = new Set()
        while (cursor && !seen.has(cursor)) {
          seen.add(cursor)
          counts.set(cursor, (counts.get(cursor) || 0) + 1)
          const folder = folders.find((entry) => entry.id === cursor)
          cursor = folder ? folder.parentId : null
        }
      }
      const unfiledCount = snippets.filter((item) => !item.folderId).length

      const selectedItems = tabItems.filter((item) => selected.includes(item.id))
      const selectedIds = selectedItems.map((item) => item.id)
      const toggleSelect = (id) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      const exitSelect = () => {
        setSelectMode(false)
        setSelected([])
        setDialog(null)
        setDialogError('')
        setTagDraft('')
      }
      const switchTab = (next) => {
        if (next === tab) return
        setTab(next)
        setCurrent('all')
        setLangFilter('')
        exitSelect()
      }

      const exportAll = () => {
        try {
          const blob = new Blob([JSON.stringify({ version: 3, items, folders }, null, 2)], {
            type: 'application/json',
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'code-vault.json'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.setTimeout(() => URL.revokeObjectURL(url), 2000)
        } catch {}
      }

      const importFile = (file) => {
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const result = mergeImport(JSON.parse(String(reader.result)))
            if (result.failed && !result.added) announce(dict.importFailed, true)
            else if (result.failed) announce(dict.storeFailed, true)
            else announce(result.added > 0 ? dict.imported(result.added) : dict.importNone)
          } catch {
            announce(dict.importFailed, true)
          }
        }
        reader.onerror = () => announce(dict.importFailed, true)
        reader.readAsText(file)
      }

      const openChat = () => {
        if (!backToConversation()) announce(dict.noSession, true)
      }

      // ------------------------------------------------------------- batch ops

      const copySelected = () => {
        if (!selectedItems.length) return announce(dict.selectedEmpty, true)
        copyText(joinCodes(selectedItems), (ok) =>
          announce(ok ? dict.copiedMany(selectedItems.length) : dict.copyFailed, !ok),
        )
      }

      const askDelete = (ids) => {
        if (!ids.length) return announce(dict.selectedEmpty, true)
        setDialogError('')
        setDialog({ kind: 'delete', ids: ids.slice() })
      }

      const runDelete = (ids) => {
        const ok = trashItems(ids)
        setDialog(null)
        setSelected((prev) => prev.filter((id) => !ids.includes(id)))
        announce(ok ? dict.removed : dict.storeFailed, !ok)
      }

      const restoreOne = (id) => {
        const ok = restoreItems([id])
        announce(ok ? dict.restored : dict.storeFailed, !ok)
      }

      const askPurge = (id) => {
        setDialogError('')
        setDialog({ kind: 'purge', ids: [id] })
      }

      const runPurge = (ids) => {
        const ok = removeItems(ids)
        setDialog(null)
        announce(ok ? dict.purged : dict.storeFailed, !ok)
      }

      const runEmptyTrash = () => {
        const ok = emptyTrash()
        setDialog(null)
        announce(ok ? dict.purged : dict.storeFailed, !ok)
      }

      const openShortcut = () => {
        setShortError('')
        setShortDraft(readCombo())
        setDialog({ kind: 'shortcut' })
      }

      const saveShortcut = () => {
        if (!shortDraft) {
          setShortError(dict.shortcutNeedMod)
          return
        }
        const ok = writeCombo(shortDraft)
        setDialog(null)
        announce(ok ? dict.shortcutSaved : dict.storeFailed, !ok)
      }

      const resetShortcut = () => {
        writeCombo(DEFAULT_COMBO)
        setDialog(null)
        announce(dict.shortcutReset, false)
      }

      const openMerge = () => {
        if (selectedItems.length < 2) return announce(dict.selectedEmpty, true)
        setDialogError('')
        setMergeTitle(defaultMergeTitle(selectedItems))
        setDialog({ kind: 'merge' })
      }

      const mergedCode = mergeText(selectedItems)
      const mergedTooLong = mergedCode.length > MAX_CODE

      const runMerge = () => {
        if (selectedItems.length < 2) return
        if (mergedCode.length > MAX_CODE) {
          announce(dict.mergeFailed, true)
          return
        }
        const tags = []
        for (const item of selectedItems) {
          for (const tag of item.tags) if (!tags.includes(tag)) tags.push(tag)
        }
        const title = mergeTitle.trim() || defaultMergeTitle(selectedItems)
        const folderId = current !== 'all' && current !== 'unfiled' ? current : null
        const added = addAsset({ title, lang: 'markdown', code: mergedCode, tags, folderId })
        setDialog(null)
        if (!added) return announce(dict.mergeFailed, true)
        setSelected([])
        setSelectMode(false)
        announce(dict.merged)
      }

      const runTag = () => {
        const tag = tagDraft.trim().slice(0, 24)
        setDialog(null)
        setTagDraft('')
        if (!tag) return
        let applied = 0
        let failed = 0
        for (const item of selectedItems) {
          const next = item.tags.includes(tag) ? item.tags : [...item.tags, tag]
          if (updateItem(item.id, { tags: next })) applied += 1
          else failed += 1
        }
        announce(failed ? dict.storeFailed : dict.tagged(applied), Boolean(failed))
      }

      const openMove = (ids) => {
        if (!ids.length) return announce(dict.selectedEmpty, true)
        const first = items.find((item) => item.id === ids[0])
        setMovePick(first && first.folderId ? first.folderId : 'root')
        setDialogError('')
        setDialog({ kind: 'move', ids: ids.slice(), promote: tab === 'drafts' })
      }

      const runMove = () => {
        const ids = dialog && dialog.ids ? dialog.ids : []
        const promote = Boolean(dialog && dialog.promote)
        const folderId = movePick === 'root' ? null : movePick
        const ok = promote ? promoteItems(ids, folderId) : moveItems(ids, folderId)
        setDialog(null)
        if (!ok) return announce(dict.moveFailed, true)
        setSelectMode(false)
        setSelected([])
        announce(promote ? dict.draftMoved(ids.length) : dict.moved(ids.length))
      }

      const openEdit = (id) => {
        const item = items.find((entry) => entry.id === id)
        if (!item) return
        setEditTitle(item.title)
        setEditCode(item.code)
        setEditLang(item.lang)
        setEditBase({ title: item.title, code: item.code })
        setDialogError('')
        setDialog({ kind: 'edit', id })
      }

      const runEdit = () => {
        const id = dialog && dialog.id
        if (!editCode.trim()) {
          setDialogError(dict.editFailed)
          return
        }
        const nextTitle = editTitle.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim()
        const ok = updateItem(id, { title: nextTitle || titleOf(editCode), code: editCode })
        setDialog(null)
        announce(ok ? dict.editSaved : dict.editFailed, !ok)
      }

      const openFolderCreate = (parentId) => {
        setNameDraft('')
        setDialogError('')
        setDialog({ kind: 'folder', mode: 'create', parentId: parentId || null })
      }

      const openFolderRename = () => {
        const folder = folders.find((entry) => entry.id === current)
        if (!folder) return
        setNameDraft(folder.name)
        setDialogError('')
        setDialog({ kind: 'folder', mode: 'rename', id: folder.id })
      }

      const submitFolderName = () => {
        const raw = nameDraft.trim()
        if (!raw) return

        if (dialog.mode === 'rename') {
          // A folder name is one label, so a slash cannot open a new level here.
          const result = renameFolder(dialog.id, raw.replace(/\//g, ' ').trim())
          if (result.error) {
            setDialogError(result.error === 'dup' ? dict.folderExists : dict.folderFailed)
            return
          }
          setDialog(null)
          setDialogError('')
          return announce(dict.folderRenamed)
        }

        // "项目 A / 前端" opens both levels at once, the way a file dialog would.
        const segments = raw
          .split('/')
          .map((part) => part.trim())
          .filter(Boolean)
          .slice(0, 6)
        if (!segments.length) return
        let parentId = dialog.parentId || null
        const touched = []
        for (const segment of segments) {
          const result = createFolder(segment, parentId)
          if (result.error === 'dup') {
            // Re-use the folder that is already there instead of failing the whole path.
            const existing = readState().folders.find(
              (folder) => folder.name === segment.slice(0, 40) && (folder.parentId || null) === parentId,
            )
            if (!existing) {
              setDialogError(dict.folderFailed)
              return
            }
            parentId = existing.id
            touched.push(parentId)
            continue
          }
          if (result.error) {
            setDialogError(dict.folderFailed)
            return
          }
          parentId = result.folder.id
          touched.push(parentId)
        }
        setDialog(null)
        setDialogError('')
        setExpanded((prev) => {
          const next = prev.slice()
          for (const id of touched) if (!next.includes(id)) next.push(id)
          return next
        })
        setCurrent(parentId)
        announce(dict.folderCreated)
      }

      const runDeleteFolder = () => {
        const ok = deleteFolder(dialog.id)
        setDialog(null)
        if (!ok) return announce(dict.folderFailed, true)
        setCurrent('all')
        announce(dict.removed)
      }

      const dropOnFolder = (event, key) => {
        let id = ''
        try {
          id = event.dataTransfer.getData('text/plain')
        } catch {}
        if (!id) return
        const folderId = key === 'unfiled' ? null : key
        const ok = moveItems([id], folderId)
        announce(ok ? dict.moved(1) : dict.moveFailed, !ok)
      }

      // ----------------------------------------------------------------- chrome

      const head = h(
        'div',
        { style: styles.titleRow },
        h('h2', { style: styles.title }, dict.title),
        h('span', { style: styles.badge }, dict.count(snippets.length)),
        h(
          'div',
          { style: styles.headRight },
          button(`${dict.quick} ${shortcutLabel()}`, () => toggleQuick(true), { title: dict.quick }),
          button(dict.shortcut, openShortcut, { title: dict.shortcutTitle }),
          h(
            'span',
            {
              style: { display: 'flex', gap: 4 },
              title: dict.langHint,
              role: 'group',
              'aria-label': dict.langHint,
            },
            chip('中文', lang === 'zh', () => setLang('zh')),
            chip('EN', lang === 'en', () => setLang('en')),
          ),
          button(dict.how, () => {
            setDialogError('')
            setDialog({ kind: 'guide' })
          }, { title: dict.how }),
        ),
      )

      const tabs = h(
        'div',
        { style: styles.tabs, role: 'tablist' },
        button(`${dict.favorites} · ${snippets.length}`, () => switchTab('favorites'), {
          primary: tab === 'favorites',
          title: dict.favoritesHint,
        }),
        button(`${dict.drafts} · ${drafts.length}`, () => switchTab('drafts'), {
          primary: tab === 'drafts',
          title: dict.draftsHint,
        }),
        button(`${dict.trash} · ${trash.length}`, () => switchTab('trash'), {
          primary: tab === 'trash',
          title: dict.trashHint,
        }),
        h(
          'span',
          { style: styles.tabsHint },
          tab === 'trash' ? dict.trashHint : tab === 'drafts' ? dict.draftsHint : dict.favoritesHint,
        ),
      )

      const toolbar = h(
        'div',
        { style: styles.toolbar },
        h('input', {
          value: query,
          placeholder: dict.search,
          onChange: (e) => setQuery(e.target.value),
          style: styles.input,
        }),
        tab === 'trash'
          ? null
          : button(selectMode ? dict.exitSelect : dict.select, () => {
              if (selectMode) exitSelect()
              else setSelectMode(true)
            }, { disabled: tabItems.length === 0 }),
        tab === 'favorites'
          ? button(
              current !== 'all' && current !== 'unfiled' ? dict.newSubfolder : dict.newFolder,
              () => openFolderCreate(current !== 'all' && current !== 'unfiled' ? current : null),
            )
          : null,
        tab === 'trash'
          ? button(dict.emptyTrash, () => {
              if (!trash.length) return
              setDialogError('')
              setDialog({ kind: 'emptyTrash' })
            }, { danger: true, disabled: trash.length === 0 })
          : null,
        button(dict.export, exportAll, { disabled: items.length === 0 }),
        button(dict.import, () => fileRef.current && fileRef.current.click()),
        h('input', {
          ref: fileRef,
          type: 'file',
          accept: 'application/json,.json',
          style: { display: 'none' },
          onChange: (e) => {
            const file = e.target.files && e.target.files[0]
            if (file) importFile(file)
            e.target.value = ''
          },
        }),
      )

      const selectBar = selectMode && tab !== 'trash'
        ? h(
            'div',
            { style: styles.selBar },
            h(
              'span',
              { style: styles.meta },
              selectedItems.length ? dict.selectedCount(selectedItems.length) : dict.selectHint,
            ),
            button(dict.selectAll, () => setSelected(view.map((item) => item.id)), { disabled: !view.length }),
            button(dict.clearSelection, () => setSelected([]), { disabled: !selected.length }),
            h('span', { style: { flex: 1 } }),
            button(dict.batchCopy, copySelected, { disabled: !selectedItems.length }),
            tab === 'favorites'
              ? button(dict.batchTag, () => {
                  setDialogError('')
                  setTagDraft('')
                  setDialog({ kind: 'tag' })
                }, { disabled: !selectedItems.length })
              : null,
            tab === 'favorites'
              ? button(dict.merge, openMerge, { disabled: selectedItems.length < 2 })
              : null,
            button(tab === 'drafts' ? dict.toFavorites : dict.move, () => openMove(selectedIds), {
              disabled: !selectedItems.length,
            }),
            button(dict.batchDelete, () => askDelete(selectedIds), {
              disabled: !selectedItems.length,
              danger: true,
            }),
          )
        : null

      const chips = langs.length
        ? h(
            'div',
            { style: styles.chipRow },
            chip(dict.all, langFilter === '', () => setLangFilter('')),
            langs.map((name) =>
              h(
                'span',
                { key: name, style: { display: 'contents' } },
                chip(name, langFilter === name, () => setLangFilter(langFilter === name ? '' : name)),
              ),
            ),
          )
        : null

      const noticeNode = notice
        ? h(
            'p',
            {
              style: noticeError
                ? { ...styles.notice, color: 'var(--dsw-alias-state-error-primary)' }
                : styles.notice,
            },
            notice,
          )
        : null

      // Breadcrumb doubles as the folder toolbar: the actions act on the folder you are inside.
      let crumb = null
      if (tab === 'favorites') {
        const path = current !== 'all' && current !== 'unfiled' ? folderPathOf(current) : []
        const parts = [
          h(
            'button',
            {
              key: 'all',
              type: 'button',
              style: current === 'all' ? { ...styles.crumb, ...styles.crumbOn } : styles.crumb,
              onClick: () => setCurrent('all'),
            },
            dict.allItems,
          ),
        ]
        for (const folder of path) {
          parts.push(h('span', { key: `sep-${folder.id}`, style: styles.crumbSep }, '›'))
          parts.push(
            h(
              'button',
              {
                key: folder.id,
                type: 'button',
                style: folder.id === current ? { ...styles.crumb, ...styles.crumbOn } : styles.crumb,
                onClick: () => setCurrent(folder.id),
              },
              folder.name,
            ),
          )
        }
        if (current === 'unfiled') {
          parts.push(h('span', { key: 'sep-unfiled', style: styles.crumbSep }, '›'))
          parts.push(h('span', { key: 'unfiled', style: { ...styles.crumb, ...styles.crumbOn } }, dict.unfiled))
        }
        if (searching) parts.push(h('span', { key: 'search', style: styles.hint }, `· ${dict.searchInAll}`))
        const real = current !== 'all' && current !== 'unfiled'
        parts.push(
          h(
            'div',
            { key: 'actions', style: styles.folderBar },
            real
              ? button(dict.renameFolder, openFolderRename)
              : null,
            real ? button(dict.newSubfolder, () => openFolderCreate(current)) : null,
            real ? button(dict.deleteFolder, () => {
              setDialogError('')
              setDialog({ kind: 'folderDelete', id: current })
            }, { danger: true }) : null,
          ),
        )
        crumb = h('div', { style: styles.crumbRow }, parts)
      }

      const editDirty = editCode !== editBase.code || editTitle !== editBase.title

      const folderLabelFor = (item) =>
        searching && item.folderId ? folderLabelText(folders, item.folderId) : ''

      const favoritesBody = h(
        'div',
        { style: styles.split },
        h(FolderTree, {
          folders,
          counts,
          current,
          expanded,
          dragOver,
          snippetCount: snippets.length,
          unfiledCount,
          onSelect: (key) => {
            setCurrent(key)
            if (key !== 'all' && key !== 'unfiled') {
              setExpanded((prev) => (prev.includes(key) ? prev : [...prev, key]))
            }
          },
          onToggle: (key) =>
            setExpanded((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key])),
          onDragOver: setDragOver,
          onDrop: dropOnFolder,
        }),
        h(
          'div',
          { style: styles.main },
          crumb,
          chips,
          view.length
            ? h(
                'div',
                { style: styles.list },
                view.map((asset) =>
                  h(AssetCard, {
                    key: asset.id,
                    asset,
                    selectable: selectMode,
                    selected: selected.includes(asset.id),
                    folderLabel: folderLabelFor(asset),
                    onToggle: toggleSelect,
                    onAskRemove: (id) => askDelete([id]),
                    onEdit: openEdit,
                    onMove: openMove,
                    onTag: (id, tags) => {
                      if (!updateItem(id, { tags })) announce(dict.storeFailed, true)
                    },
                  }),
                ),
              )
            : searching || langFilter
              ? h('p', { style: styles.empty }, dict.searchEmpty)
              : current === 'all' || current === 'unfiled'
                ? snippets.length
                  ? h('p', { style: styles.empty }, dict.searchEmpty)
                  : helpOpen
                    ? null
                    : h('p', { style: styles.empty }, dict.empty)
                : h(
                    'div',
                    { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
                    h('p', { style: styles.empty }, dict.folderEmpty),
                    h('p', { style: styles.hint }, dict.folderEmptyHint),
                  ),
        ),
      )

      const draftsBody = h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        chips,
        view.length
          ? h(
              'div',
              { style: styles.list },
              view.map((asset) =>
                h(DraftRow, {
                  key: asset.id,
                  asset,
                  selectable: selectMode,
                  selected: selected.includes(asset.id),
                  onToggle: toggleSelect,
                  onAskRemove: (id) => askDelete([id]),
                  onEdit: openEdit,
                  onMove: (id) => openMove([id]),
                }),
              ),
            )
          : h('p', { style: styles.empty }, searching || langFilter ? dict.searchEmpty : dict.draftsEmpty),
      )

      const trashBody = h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        h('p', { style: styles.meta }, dict.trashNote),
        chips,
        view.length
          ? h(
              'div',
              { style: styles.list },
              view.map((asset) =>
                h(TrashRow, {
                  key: asset.id,
                  asset,
                  onRestore: restoreOne,
                  onPurge: askPurge,
                }),
              ),
            )
          : h('p', { style: styles.empty }, searching || langFilter ? dict.searchEmpty : dict.trashEmpty),
      )

      // Dialogs -----------------------------------------------------------------

      let dialogNode = null
      if (dialog && dialog.kind === 'delete') {
        const count = dialog.ids.length
        dialogNode = h(
          Dialog,
          {
            title: count > 1 ? dict.batchDelete : dict.remove,
            confirmLabel: dict.deleteLabel,
            danger: true,
            onCancel: () => setDialog(null),
            onConfirm: () => runDelete(dialog.ids),
          },
          h('p', { style: styles.dialogText }, count > 1 ? dict.confirmDeleteMany(count) : dict.confirmDeleteOne),
        )
      } else if (dialog && dialog.kind === 'guide') {
        const line = (text) => h('p', { style: styles.guideLine }, text)
        dialogNode = h(
          Dialog,
          {
            title: dict.guideTitle,
            confirmLabel: dict.gotIt,
            onCancel: () => setDialog(null),
            onConfirm: () => setDialog(null),
            singleAction: true,
          },
          h('p', { style: styles.guideStep }, dict.step1),
          h('p', { style: styles.guideStep }, dict.step2),
          h('p', { style: styles.guideStep }, dict.step3),
          h('p', { style: styles.guideStep }, dict.step4),
          h('div', { style: styles.guideDivider }),
          line(dict.guideShortcut(shortcutLabel())),
          line(dict.trashHint),
          h(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } },
            h('p', { style: styles.guideNote }, dict.guideTip),
            button(dict.changeShortcut, openShortcut, { subtle: true }),
          ),
        )
      } else if (dialog && dialog.kind === 'shortcut') {
        const conflict = shortDraft ? comboConflictLabel(shortDraft) : ''
        const clash = conflict && KNOWN_COMBOS.includes(conflict) ? prettyKnown(conflict) : ''
        dialogNode = h(
          Dialog,
          {
            title: dict.shortcutTitle,
            confirmLabel: dict.saveChanges,
            disabled: !shortDraft,
            onCancel: () => setDialog(null),
            onConfirm: saveShortcut,
            noAutoFocus: true,
            left: button(dict.shortcutDefault, resetShortcut, { subtle: true }),
          },
          h('p', { style: styles.dialogText }, dict.shortcutHint),
          h(ShortcutRecorder, {
            combo: shortDraft,
            onKeyDown: (event) => {
              if (event.key === 'Tab') return
              event.preventDefault()
              event.stopPropagation()
              const combo = eventToCombo(event)
              if (!combo) {
                setShortError(dict.shortcutNeedMod)
                return
              }
              setShortError('')
              setShortDraft(combo)
            },
          }),
          h('p', { style: styles.recorderHint }, dict.shortcutNote),
          clash
            ? h('p', { style: { ...styles.recorderHint, color: 'var(--dsw-alias-state-warn-primary)' } }, dict.shortcutConflict(clash))
            : null,
          shortError ? h('p', { style: { ...styles.dialogError, textAlign: 'center' } }, shortError) : null,
        )
      } else if (dialog && dialog.kind === 'purge') {
        const count = dialog.ids.length
        dialogNode = h(
          Dialog,
          {
            title: dict.deleteForever,
            confirmLabel: dict.deleteForever,
            danger: true,
            onCancel: () => setDialog(null),
            onConfirm: () => runPurge(dialog.ids),
          },
          h('p', { style: styles.dialogText }, count > 1 ? dict.purgeMany(count) : dict.purgeOne),
        )
      } else if (dialog && dialog.kind === 'emptyTrash') {
        dialogNode = h(
          Dialog,
          {
            title: dict.emptyTrash,
            confirmLabel: dict.emptyTrash,
            danger: true,
            onCancel: () => setDialog(null),
            onConfirm: runEmptyTrash,
          },
          h('p', { style: styles.dialogText }, dict.emptyTrashText(trash.length)),
        )
      } else if (dialog && dialog.kind === 'tag') {
        dialogNode = h(
          Dialog,
          {
            title: dict.batchTag,
            confirmLabel: dict.batchTag,
            disabled: !tagDraft.trim(),
            onCancel: () => setDialog(null),
            onConfirm: runTag,
          },
          h('input', {
            autoFocus: true,
            value: tagDraft,
            placeholder: dict.tagPrompt,
            onChange: (e) => setTagDraft(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (tagDraft.trim()) runTag()
              }
            },
            style: styles.input,
          }),
          h('p', { style: styles.dialogText }, dict.selectedCount(selectedItems.length)),
        )
      } else if (dialog && dialog.kind === 'merge') {
        dialogNode = h(
          Dialog,
          {
            title: dict.merge,
            confirmLabel: dict.create,
            disabled: mergedTooLong || selectedItems.length < 2,
            onCancel: () => setDialog(null),
            onConfirm: runMerge,
          },
          h('p', { style: styles.dialogText }, dict.mergeHint),
          h('input', {
            autoFocus: true,
            value: mergeTitle,
            placeholder: dict.mergeTitle,
            onChange: (e) => setMergeTitle(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (!mergedTooLong) runMerge()
              }
            },
            style: styles.input,
          }),
          h('p', { style: styles.meta }, `${dict.mergePreview} · ${selectedItems.length}`),
          h(
            'pre',
            { style: styles.preview },
            mergedCode.length > 1200 ? `${mergedCode.slice(0, 1200)}\n…` : mergedCode,
          ),
          mergedTooLong ? h('p', { style: styles.dialogError }, dict.mergeFailed) : null,
        )
      } else if (dialog && dialog.kind === 'move') {
        const pickRow = (id, label, depth) => {
          const on = movePick === id
          const rowStyle = { ...styles.moveRow, paddingLeft: 8 + depth * 14 }
          if (on) Object.assign(rowStyle, styles.moveRowOn)
          else if (moveHover === id) Object.assign(rowStyle, styles.moveRowHover)
          return h(
            'div',
            {
              key: id,
              style: rowStyle,
              role: 'radio',
              'aria-checked': on,
              tabIndex: 0,
              onClick: () => setMovePick(id),
              onMouseEnter: () => setMoveHover(id),
              onMouseLeave: () => setMoveHover(''),
              onFocus: () => setMoveHover(id),
              onBlur: () => setMoveHover(''),
              onKeyDown: (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setMovePick(id)
                }
              },
            },
            h('span', { style: on ? styles.moveDotOn : styles.moveDot }),
            h('span', { style: styles.moveLabel }, label),
            on ? h('span', { style: styles.moveCheck }, '✓') : null,
          )
        }
        const rows = [pickRow('root', dict.moveRoot, 0)]
        const walkMove = (parentId, depth) => {
          const list = folders
            .filter((folder) => (folder.parentId || null) === (parentId || null))
            .sort((a, b) => a.name.localeCompare(b.name))
          for (const folder of list) {
            rows.push(pickRow(folder.id, folder.name, depth))
            walkMove(folder.id, depth + 1)
          }
        }
        walkMove(null, 1)
        dialogNode = h(
          Dialog,
          {
            title: dialog.promote ? dict.toFavorites : dict.moveTitle,
            confirmLabel: dict.move,
            onCancel: () => setDialog(null),
            onConfirm: runMove,
          },
          h('p', { style: styles.dialogText }, dict.moveHint),
          h('div', { style: styles.moveList, role: 'radiogroup' }, rows),
          h('p', { style: styles.meta }, dict.selectedCount(dialog.ids.length)),
        )
      } else if (dialog && dialog.kind === 'folder') {
        dialogNode = h(
          Dialog,
          {
            title: dialog.mode === 'rename' ? dict.renameFolder : dict.newFolder,
            confirmLabel: dialog.mode === 'rename' ? dict.saveChanges : dict.create,
            disabled: !nameDraft.trim(),
            onCancel: () => setDialog(null),
            onConfirm: submitFolderName,
          },
          h('p', { style: styles.dialogText }, dialog.mode === 'rename' ? dict.folderName : dict.folderNamePlaceholder),
          h('input', {
            autoFocus: true,
            value: nameDraft,
            placeholder: dict.folderNamePlaceholder,
            onChange: (e) => {
              setNameDraft(e.target.value)
              if (dialogError) setDialogError('')
            },
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (nameDraft.trim()) submitFolderName()
              }
            },
            style: styles.input,
          }),
          dialogError ? h('p', { style: styles.dialogError }, dialogError) : null,
        )
      } else if (dialog && dialog.kind === 'folderDelete') {
        const inside = snippets.filter((item) => item.folderId === dialog.id).length
        dialogNode = h(
          Dialog,
          {
            title: dict.folderDeleteTitle,
            confirmLabel: dict.deleteFolder,
            danger: true,
            onCancel: () => setDialog(null),
            onConfirm: runDeleteFolder,
          },
          h('p', { style: styles.dialogText }, dict.folderDeleteText(inside)),
        )
      } else if (dialog && dialog.kind === 'edit') {
        dialogNode = h(
          Dialog,
          {
            title: dict.edit,
            confirmLabel: dict.saveChanges,
            disabled: !editCode.trim(),
            onCancel: () => setDialog(null),
            onConfirm: runEdit,
          },
          h('p', { style: styles.meta }, dict.editTitleLabel),
          h('textarea', {
            value: editTitle,
            rows: Math.min(4, Math.max(1, editTitle.split('\n').length + Math.floor(editTitle.length / 40))),
            spellCheck: false,
            onChange: (e) => setEditTitle(e.target.value),
            style: styles.editTitle,
          }),
          h(
            'p',
            { style: styles.meta },
            dict.editCodeLabel,
            editDirty ? h('span', { style: styles.unsavedBadge }, ` · ${dict.unsaved}`) : null,
          ),
          h(CodeEditor, {
            value: editCode,
            lang: editLang,
            titleEmpty: !editTitle.trim(),
            onChange: setEditCode,
            onSave: runEdit,
          }),
          dialogError ? h('p', { style: styles.dialogError }, dialogError) : null,
        )
      }

      return h(
        'div',
        { style: styles.root },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: 2 } },
          head,
          h('p', { style: styles.subtitle }, dict.subtitle),
          tabs,
        ),
        toolbar,
        noticeNode,
        selectBar,
        h(
          'div',
          { style: styles.scroll },
          tab === 'favorites' ? favoritesBody : tab === 'drafts' ? draftsBody : trashBody,
          helpOpen && tab === 'favorites' && snippets.length === 0
            ? h(HelpBlock, { onOpenChat: openChat, onShortcut: openShortcut, showTitle: true })
            : null,
          helpOpen && tab === 'favorites' && snippets.length > 0
            ? h(HelpBlock, { onOpenChat: openChat, onShortcut: openShortcut, showTitle: false })
            : null,
        ),
        dialogNode,
      )
    }

    // ----------------------------------------------------------- chat code fence

    function FenceLayer(props) {
      // A fence layer receives `{ owner, children }`: the fence info (lang/code/streaming/meta)
      // arrives as `owner`, while the rendered code block arrives as `children`.
      const info = props.owner || props
      const dict = t()
      const code = typeof info.code === 'string' ? info.code : ''
      const fenceLang = typeof info.lang === 'string' ? info.lang : ''
      const streaming = Boolean(info.streaming)
      const children = props.children
      const [hovered, setHovered] = React.useState(false)
      const [saved, setSaved] = React.useState(() => isSaved(fenceLang, code.length > MAX_CODE ? code.slice(0, MAX_CODE) : code))
      const [failed, setFailed] = React.useState(false)
      const [notice, setNotice] = React.useState('')
      const [, setVersion] = React.useState(0)
      const failTimer = React.useRef(0)
      const noticeTimer = React.useRef(0)
      const langSeen = React.useRef(lang)

      const flash = (text, ms) => {
        setNotice(text)
        window.clearTimeout(noticeTimer.current)
        if (text) noticeTimer.current = window.setTimeout(() => setNotice(''), ms)
      }

      // The store is the source of truth: saving here, deleting in the panel, importing, or
      // switching the language all re-read this button instead of leaving stale text behind.
      React.useEffect(
        () =>
          subscribe(() => {
            setSaved(isSaved(fenceLang, code.length > MAX_CODE ? code.slice(0, MAX_CODE) : code))
            // Text only depends on the language; other store writes are already covered by setSaved.
            if (langSeen.current !== lang) {
              langSeen.current = lang
              setVersion((version) => version + 1)
            }
          }),
        [fenceLang, code],
      )
      React.useEffect(
        () => () => {
          window.clearTimeout(failTimer.current)
          window.clearTimeout(noticeTimer.current)
        },
        [],
      )

      const storedCode = code.length > MAX_CODE ? code.slice(0, MAX_CODE) : code
      const canSave = !streaming && !SKIP_LANGS.has(fenceLang.toLowerCase()) && code.trim() !== ''

      // One button, two directions: a mis-click is undone by clicking the same spot again.
      const toggle = () => {
        if (saved) {
          if (unsaveAsset(fenceLang, storedCode)) {
            setSaved(false)
            setFailed(false)
            flash(dict.unsaved, 1200)
          } else {
            setFailed(true)
            window.clearTimeout(failTimer.current)
            failTimer.current = window.setTimeout(() => setFailed(false), 1600)
          }
          return
        }
        const item = addAsset({ lang: fenceLang, code: storedCode })
        if (item) {
          setSaved(true)
          setFailed(false)
          flash('', 0)
          return
        }
        setFailed(true)
        window.clearTimeout(failTimer.current)
        failTimer.current = window.setTimeout(() => setFailed(false), 1600)
      }

      const text = failed ? dict.saveFailed : notice || (saved ? dict.saved : dict.save)
      // Always visible while the block can be saved: a hover-only control is too easy to miss.
      const overlay = canSave
        ? h(
            'button',
            {
              type: 'button',
              onClick: toggle,
              title: saved ? dict.unsaveHint : dict.save,
              'aria-label': text,
              'aria-pressed': saved,
              style: {
                position: 'absolute',
                bottom: 8,
                right: 10,
                zIndex: 2,
                height: 26,
                padding: '0 10px',
                fontSize: 12,
                lineHeight: '24px',
                cursor: 'pointer',
                opacity: saved || hovered || failed ? 1 : 0.55,
                transition: 'opacity 120ms ease',
                color: saved
                  ? 'var(--dsw-alias-state-success-primary)'
                  : failed
                    ? 'var(--dsw-alias-state-error-primary)'
                    : 'var(--dsw-alias-label-secondary)',
                background: saved ? 'var(--dsw-alias-bg-layer-2)' : 'var(--dsw-alias-bg-layer-1)',
                border: `1px solid ${saved ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-border-l2)'}`,
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              },
            },
            text,
          )
        : null

      return h(
        'div',
        {
          style: { position: 'relative' },
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        },
        children,
        overlay,
      )
    }

    // ------------------------------------------------ composer insert consumer

    // Two jobs on the same dock row: drain the insert queue that every surface feeds, and give
    // a half-written draft a one-click way into the vault before it is lost.
    function ComposerBridge(props) {
      const [, bump] = React.useState(0)
      const [flash, setFlash] = React.useState('')
      const flashTimer = React.useRef(0)
      const useInput = typeof props.useInput === 'function' ? props.useInput : null
      const draft = useInput ? useInput((state) => state.draft) : ''

      React.useEffect(() => subscribeInsert(() => bump((v) => v + 1)), [])
      React.useEffect(() => () => window.clearTimeout(flashTimer.current), [])

      React.useEffect(() => {
        if (!pending.length) return
        while (pending.length) {
          const item = pending.shift()
          window.clearTimeout(item.timer)
          let ok = false
          try {
            const actions = props.inputActions
            if (actions && actions.captureInsertion && actions.insertText) {
              ok = actions.insertText(item.text, actions.captureInsertion())
            }
          } catch {}
          if (!ok) {
            try {
              const current = typeof draft === 'string' ? draft : ''
              props.inputActions.setDraft(current ? `${current}\n${item.text}` : item.text)
              ok = true
            } catch {}
          }
          if (item.onResult) {
            try {
              item.onResult(ok)
            } catch {}
          }
        }
      })

      const report = (text) => {
        setFlash(text)
        window.clearTimeout(flashTimer.current)
        flashTimer.current = window.setTimeout(() => setFlash(''), 2000)
      }

      const text = typeof draft === 'string' ? draft : ''
      const canSave = text.trim() !== ''

      // Drafts are stored as plain text: they are prose or a partial edit, not a code fence.
      // Surrounding whitespace is dropped so re-saving the same draft dedupes instead of
      // producing a twin entry.
      const saveDraft = () => {
        const trimmed = text.trim()
        const code = trimmed.length > MAX_CODE ? trimmed.slice(0, MAX_CODE) : trimmed
        const draftCount = () => readAll().filter((item) => item.kind === 'draft').length
        const before = draftCount()
        if (!addDraft({ title: titleOf(code), lang: 'text', code })) {
          report(t().saveFailed)
          return
        }
        report(draftCount() > before ? t().draftSaved : t().draftDup)
      }

      if (!canSave && !flash) return h('span', { style: { display: 'none' } })

      return h(
        'div',
        { style: styles.dockBar },
        flash ? h('span', { style: styles.dockNote }, flash) : null,
        canSave
          ? h(
              'button',
              { type: 'button', style: styles.dockButton, title: t().saveDraft, onClick: saveDraft },
              t().saveDraft,
            )
          : null,
      )
    }

    // -------------------------------------------------------------- quick picker

    // Registered in `shell.overlay`: the frame-wide layer is click-through, so this component
    // renders nothing until the shortcut (or the panel button) opens it.
    function QuickPicker() {
      const dict = t()
      const [, bump] = React.useState(0)
      const [cursor, setCursor] = React.useState(0)
      const [note, setNote] = React.useState('')
      const inputRef = React.useRef(null)
      const noteTimer = React.useRef(0)

      React.useEffect(() => subscribeQuick(() => bump((v) => v + 1)), [])
      React.useEffect(() => subscribe(() => bump((v) => v + 1)), [])
      React.useEffect(() => () => window.clearTimeout(noteTimer.current), [])
      React.useEffect(() => {
        if (!quickOpen || !inputRef.current) return
        try {
          inputRef.current.focus()
        } catch {}
      }, [quickOpen])

      // Esc must work even after focus moved to a row (or the backdrop) by a click.
      React.useEffect(() => {
        if (!quickOpen) return
        const onDocKey = (event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          toggleQuick(false)
        }
        document.addEventListener('keydown', onDocKey)
        return () => document.removeEventListener('keydown', onDocKey)
      }, [quickOpen])

      if (!quickOpen) return null

      // Drafts are scratch text, not something to paste back as code.
      const all = readAll().filter((item) => item.kind === 'snippet')
      const needle = quickQuery.trim().toLowerCase()
      const hits = (needle ? all.filter((item) => searchTextOf(item).includes(needle)) : all).slice(0, 8)
      const active = hits.length ? Math.min(cursor, hits.length - 1) : 0

      const close = () => toggleQuick(false)
      const flash = (text) => {
        setNote(text)
        window.clearTimeout(noteTimer.current)
        noteTimer.current = window.setTimeout(() => setNote(''), 2200)
      }

      // Stays open until the composer answers: with no conversation mounted the queue times out
      // and the hint says why nothing landed instead of closing on a silent failure.
      const insert = (item) => {
        if (!item) return
        requestInsert(item.code, (ok) => {
          if (ok) close()
          else flash(dict.noSession)
        })
      }

      const onKeyDown = (event) => {
        const key = event.key || ''
        // An Enter that confirms an IME candidate must not insert a snippet instead.
        if (event.isComposing && key !== 'Escape') return
        if (key === 'Escape') {
          event.preventDefault()
          close()
          return
        }
        if (key === 'ArrowDown') {
          event.preventDefault()
          setCursor((value) => Math.min(value + 1, Math.max(hits.length - 1, 0)))
          return
        }
        if (key === 'ArrowUp') {
          event.preventDefault()
          setCursor((value) => Math.max(value - 1, 0))
          return
        }
        if (key === 'Enter') {
          event.preventDefault()
          insert(hits[active])
        }
      }

      return h(
        'div',
        {
          style: styles.quickBackdrop,
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) close()
          },
        },
        h(
          'div',
          { style: styles.quickCard, role: 'dialog', 'aria-modal': 'true', 'aria-label': dict.quick },
          h('input', {
            ref: inputRef,
            value: quickQuery,
            placeholder: dict.quickPlaceholder,
            'aria-label': dict.quickPlaceholder,
            onChange: (event) => {
              setQuickQuery(event.target.value)
              setCursor(0)
            },
            onKeyDown,
            style: styles.quickInput,
          }),
          hits.length
            ? h(
                'div',
                { style: styles.quickList },
                hits.map((item, index) =>
                  h(
                    'button',
                    {
                      key: item.id,
                      type: 'button',
                      style: index === active ? { ...styles.quickRow, ...styles.quickRowActive } : styles.quickRow,
                      onMouseEnter: () => setCursor(index),
                      onClick: () => insert(item),
                    },
                    h('span', { style: styles.quickTitle }, item.title),
                    h('span', { style: styles.quickLang }, item.lang || '—'),
                  ),
                ),
              )
            : h('div', { style: styles.quickEmpty }, all.length ? dict.quickEmpty : dict.quickNoAssets),
          h(
            'div',
            { style: styles.quickFoot },
            note ? h('span', { style: styles.quickNote }, note) : null,
            h('span', null, dict.quickHint),
            h('span', { style: styles.quickCount }, dict.quickCount(all.length)),
          ),
        ),
      )
    }

    // ------------------------------------------------------------------- icon

    function SidebarIcon(props) {
      const size = (props && props.size) || 16
      const active = Boolean(props && props.active)
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          style: { display: 'block', color: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor' },
        },
        h('path', {
          d: 'M6.5 3.75h11a1.75 1.75 0 0 1 1.75 1.75v14.25l-7.25-4.4-7.25 4.4V5.5A1.75 1.75 0 0 1 6.5 3.75Z',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M9.25 8.5h5.5',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
        }),
      )
    }

    // ------------------------------------------------------------------ plugin

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        // `layout` is not a declared dependency, so read it optionally instead of
        // touching ctx.layout (that throws for services the plugin did not inject).
        try {
          layout = typeof ctx.get === 'function' ? ctx.get('layout') || null : null
        } catch {
          layout = null
        }
        layoutOf = () => {
          try {
            return layout || (typeof ctx.get === 'function' ? ctx.get('layout') : null) || null
          } catch {
            return layout
          }
        }
        const syncLang = (snapshot) => {
          lang = detectLang(snapshot)
          emit()
        }
        try {
          syncLang(ctx.locale.getLocale())
        } catch {
          syncLang(null)
        }
        ctx.on('locale/change', syncLang)

        // Another tab may have saved, deleted, or imported entries: drop the cache and re-read.
        ctx.effect(() => {
          const onStorage = (event) => {
            if (event && event.key && event.key !== STORE_KEY) return
            forgetCache()
          }
          window.addEventListener('storage', onStorage)
          return () => window.removeEventListener('storage', onStorage)
        })

        // Each surface registers on its own: one broken slot must not take the rest down.
        const register = (slotName, options, component) => {
          try {
            ctx.slots.inject(slotName, () => ctx.slots.register(options, component))
          } catch (error) {
            console.error('[code-vault] could not register in', slotName, error)
          }
        }

        register('main', { name: 'main', key: PANEL_ID }, Panel)
        register(
          'sidebar.panellist',
          { name: 'sidebar.panellist', id: PANEL_ID, order: 5, label: () => t().title },
          SidebarIcon,
        )
        register('conversation.chat.markdown.fence', { name: 'conversation.chat.markdown.fence', id: PANEL_ID, order: 20 }, FenceLayer)
        register('conversation.composer.dock', { name: 'conversation.composer.dock', id: PANEL_ID, order: 40 }, ComposerBridge)
        // A fresh id sits beside the shipped overlay entries instead of replacing any of them.
        register('shell.overlay', { name: 'shell.overlay', id: `${PANEL_ID}.quick`, order: 50 }, QuickPicker)

        // The shortcut is global on purpose: the picker must be one keystroke from anywhere.
        ctx.effect(() => {
          const onKey = (event) => {
            if (!event || event.isComposing) return
            if (!matchesCombo(readCombo(), event)) return
            event.preventDefault()
            toggleQuick()
          }
          window.addEventListener('keydown', onKey)
          return () => window.removeEventListener('keydown', onKey)
        })

        const disposePanel = () => {
          toggleQuick(false)
          try {
            const panelLayout = layout || (typeof ctx.get === 'function' ? ctx.get('layout') : null)
            if (panelLayout && panelLayout.panelInfo && panelLayout.panelInfo.getSnapshot().activePanelId === PANEL_ID) {
              panelLayout.selectPanel(null)
            }
          } catch {}
        }
        ctx.effect(() => disposePanel)
      },
    }
  },
})
