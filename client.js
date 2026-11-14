window.__ModuleLoader__.load({
  id: 'dsh-code-vault',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const PANEL_ID = 'code-vault'
    // Kept from the 0.1.0 name on purpose: assets saved before the rename stay readable.
    const STORE_KEY = 'dsh-session-assets:v1'
    const LANG_KEY = 'dsh-code-vault:lang'
    const LIMIT = 400
    const MAX_CODE = 200000

    // ---------------------------------------------------------------- language

    const DICT = {
      en: {
        title: 'Code Vault',
        subtitle: 'Keep code from this chat — local, searchable, one click away',
        search: 'Search code, language, or tag',
        all: 'All',
        empty: 'Nothing saved yet — here is the whole flow in three steps:',
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
        searchEmpty: 'No saved code matches this search.',
        how: 'How it works',
        hideHow: 'Hide',
        step1: 'In a conversation, every code block has a “Save to vault” button in its bottom-right corner.',
        step2: 'Click it — the block is stored in this browser only.',
        step3: 'Come back here to search, tag, copy, or put it straight back into the composer.',
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
        confirmDeleteOne: 'Delete this saved code? This cannot be undone.',
        confirmDeleteMany: (n) => `Delete ${n} selected entries? This cannot be undone.`,
        confirmMerge: (n) => `Merge ${n} selected entries into one new entry? The originals stay.`,
        merged: 'Merged into a new entry',
        mergeFailed: 'Could not merge — browser storage may be full',
        tagged: (n) => `Tag added to ${n} entries`,
        copiedMany: (n) => `Copied ${n} block(s)`,
        removed: 'Deleted',
        tagPrompt: 'Tag name, then Enter',
        confirmNote: 'This step needs one more click.',
      },
      zh: {
        title: '代码收藏夹',
        subtitle: '把对话里的代码收进本地收藏夹，随时搜、随时插',
        search: '搜代码 / 语言 / 标签',
        all: '全部',
        empty: '还没有收藏。用法就三步：',
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
        searchEmpty: '没有匹配的收藏。',
        how: '怎么用',
        hideHow: '收起',
        step1: '在对话里，每个代码块右下角都有一个「收藏代码块」按钮。',
        step2: '点它就好——代码只存在这台浏览器里，不上传。',
        step3: '回到这个面板：搜索、打标签、复制，或一键插回输入框继续改。',
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
        confirmDeleteOne: '删除这条收藏？此操作不可撤销。',
        confirmDeleteMany: (n) => `删除选中的 ${n} 条收藏？此操作不可撤销。`,
        confirmMerge: (n) => `把选中的 ${n} 条合并成一条新收藏？原收藏会保留。`,
        merged: '已合并为一条新收藏',
        mergeFailed: '合并失败，浏览器存储可能已满',
        tagged: (n) => `已给 ${n} 条加上标签`,
        copiedMany: (n) => `已复制 ${n} 段代码`,
        removed: '已删除',
        tagPrompt: '标签名，回车确认',
        confirmNote: '这一步需要再点一次确认。',
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

    let cache = null
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

    // Entries saved before titles were cleaned kept the raw first line, comment marker and
    // all. Re-derive those on read; titles the user typed (merge results) are left alone.
    function titleFrom(raw) {
      const stored = typeof raw.title === 'string' ? raw.title.trim().slice(0, 80) : ''
      if (!stored) return titleOf(raw.code)
      const legacy = firstLine(raw.code).slice(0, 60)
      return stored === legacy ? titleOf(raw.code) : stored
    }

    function normalize(raw) {
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
        createdAt: Number.isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
      }
    }

    function readAll() {
      if (cache) return cache
      try {
        const raw = window.localStorage.getItem(STORE_KEY)
        const parsed = raw ? JSON.parse(raw) : []
        const list = Array.isArray(parsed) ? parsed.map(normalize).filter(Boolean) : []
        cache = list
      } catch {
        cache = []
      }
      return cache
    }

    function writeAll(list) {
      const seen = new Set()
      const next = []
      for (const item of list) {
        const copy = seen.has(item.id) ? { ...item, id: newId() } : item
        seen.add(copy.id)
        next.push(copy)
      }
      next.length = Math.min(next.length, LIMIT)
      const previous = cache
      cache = next
      savedSigs = null
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(next))
      } catch {
        // Quota or a locked-down storage: revert so memory never claims what storage refused.
        cache = previous
        savedSigs = null
        return false
      }
      emit()
      return true
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
      if (!savedSigs) savedSigs = new Set(readAll().map((item) => sigOf(item.lang, item.code)))
      // The index answers "almost certainly no" fast; a hit is confirmed by value so a hash
      // collision can never make a block look saved (and block saving it for real).
      if (!savedSigs.has(sigOf(lang || '', code))) return false
      return readAll().some((item) => item.lang === (lang || '') && item.code === code)
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
      cache = null
      savedSigs = null
      emit()
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

    function addAsset(input) {
      const item = normalize({ ...input, createdAt: Date.now() })
      if (!item) return null
      const list = readAll()
      const dup = list.find((x) => x.code === item.code && x.lang === item.lang)
      if (dup) return dup
      return writeAll([item, ...list]) ? item : null
    }

    function mergeAssets(items) {
      const list = readAll().slice()
      let added = 0
      for (const raw of items) {
        const item = normalize(raw)
        if (!item) continue
        if (list.some((x) => x.code === item.code && x.lang === item.lang)) continue
        list.push(item)
        added += 1
      }
      if (!added) return 0
      return writeAll(list) ? added : -1
    }

    function removeAsset(id) {
      return writeAll(readAll().filter((x) => x.id !== id))
    }

    // The fence button toggles by content: it never knows an asset id, and the same code with
    // the same language is one entry thanks to the save-time dedupe.
    function unsaveAsset(lang, code) {
      const hit = readAll().find((item) => item.lang === (lang || '') && item.code === code)
      if (!hit) return false
      return writeAll(readAll().filter((item) => item.id !== hit.id))
    }

    function patchAsset(id, patch) {
      return writeAll(readAll().map((x) => (x.id === id ? normalize({ ...x, ...patch }) || x : x)))
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
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        outline: 'none',
      },
      dialogTitle: { margin: 0, fontSize: 14, fontWeight: 600, lineHeight: '20px' },
      dialogText: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' },
      dialogError: { margin: 0, fontSize: 12, lineHeight: '18px', color: 'var(--dsw-alias-state-error-primary)' },
      dialogActions: { display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 2 },
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
      list: { flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 2 },
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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0,
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
          : opts.danger
            ? 'var(--dsw-alias-state-error-primary)'
            : 'var(--dsw-alias-label-secondary)',
        background: opts.primary ? 'var(--dsw-alias-button-primary-fill)' : 'transparent',
        border: opts.primary ? '1px solid transparent' : '1px solid var(--dsw-alias-border-l2)',
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
        // Focus the dialog itself; any input inside takes focus through autoFocus.
        if (node && typeof node.focus === 'function') {
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
            button(dict.cancel, props.onCancel),
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

    function AssetCard(props) {
      const dict = t()
      const asset = props.asset
      const selectable = Boolean(props.selectable)
      const selected = Boolean(props.selected)
      const [flash, setFlash] = React.useState('')
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
        { style: styles.card },
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
          button(dict.remove, () => props.onAskRemove(asset.id), { danger: true }),
        ),
      )
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
        h('p', { style: styles.helpNote }, dict.localOnly),
        h('div', { style: { display: 'flex', gap: 6 } }, button(dict.openChat, props.onOpenChat, { primary: true })),
      )
    }

    function Panel() {
      const dict = t()
      const [items, setItems] = React.useState(() => readAll().slice())
      const [query, setQuery] = React.useState('')
      const [langFilter, setLangFilter] = React.useState('')
      const [helpOpen, setHelpOpen] = React.useState(() => readAll().length === 0)
      const fileRef = React.useRef(null)
      const [notice, setNotice] = React.useState('')
      const [noticeError, setNoticeError] = React.useState(false)
      const noticeTimer = React.useRef(0)
      const [selectMode, setSelectMode] = React.useState(false)
      const [selected, setSelected] = React.useState([])
      const [dialog, setDialog] = React.useState(null)
      const [tagDraft, setTagDraft] = React.useState('')
      const [mergeTitle, setMergeTitle] = React.useState('')

      const announce = (text, error) => {
        setNotice(text)
        setNoticeError(Boolean(error))
        window.clearTimeout(noticeTimer.current)
        noticeTimer.current = window.setTimeout(() => setNotice(''), error ? 4000 : 2400)
      }
      React.useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

      React.useEffect(() => subscribe(() => setItems(readAll().slice())), [])

      // Selection lives by id: entries removed here, in another tab, or by an import silently
      // drop out instead of leaving a phantom count behind.
      React.useEffect(() => {
        setSelected((prev) => {
          const next = prev.filter((id) => items.some((item) => item.id === id))
          return next.length === prev.length ? prev : next
        })
      }, [items])

      const langs = []
      for (const item of items) {
        if (item.lang && !langs.includes(item.lang)) langs.push(item.lang)
      }
      langs.sort()

      const needle = query.trim().toLowerCase()
      const view = items.filter((item) => {
        if (langFilter && item.lang !== langFilter) return false
        if (!needle) return true
        return searchTextOf(item).includes(needle)
      })

      const selectedItems = items.filter((item) => selected.includes(item.id))
      const selectedIds = selectedItems.map((item) => item.id)
      const toggleSelect = (id) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      const exitSelect = () => {
        setSelectMode(false)
        setSelected([])
        setDialog(null)
        setTagDraft('')
      }

      const exportAll = () => {
        try {
          const blob = new Blob([JSON.stringify({ version: 1, assets: items }, null, 2)], { type: 'application/json' })
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
            const data = JSON.parse(String(reader.result))
            const list = Array.isArray(data) ? data : data && Array.isArray(data.assets) ? data.assets : null
            if (!list) throw new Error('shape')
            const added = mergeAssets(list)
            if (added < 0) announce(dict.storeFailed, true)
            else announce(added > 0 ? dict.imported(added) : dict.importNone)
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
        setDialog({ kind: 'delete', ids: ids.slice() })
      }

      const runDelete = (ids) => {
        let failed = 0
        for (const id of ids) {
          if (!removeAsset(id)) failed += 1
        }
        setDialog(null)
        setSelected((prev) => prev.filter((id) => !ids.includes(id)))
        announce(failed ? dict.storeFailed : dict.removed, Boolean(failed))
      }

      const openMerge = () => {
        if (selectedItems.length < 2) return announce(dict.selectedEmpty, true)
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
        const added = addAsset({ title, lang: 'markdown', code: mergedCode, tags })
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
          if (patchAsset(item.id, { tags: next })) applied += 1
          else failed += 1
        }
        announce(failed ? dict.storeFailed : dict.tagged(applied), Boolean(failed))
      }

      // ----------------------------------------------------------------- chrome

      const head = h(
        'div',
        { style: styles.titleRow },
        h('h2', { style: styles.title }, dict.title),
        h('span', { style: styles.badge }, dict.count(items.length)),
        h(
          'div',
          { style: styles.headRight },
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
          button(helpOpen ? dict.hideHow : dict.how, () => setHelpOpen(!helpOpen), { title: dict.how }),
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
        button(selectMode ? dict.exitSelect : dict.select, () => {
          if (selectMode) exitSelect()
          else setSelectMode(true)
        }, { disabled: items.length === 0 }),
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

      const selectBar = selectMode
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
            button(dict.batchTag, () => setDialog({ kind: 'tag' }), { disabled: !selectedItems.length }),
            button(dict.merge, openMerge, { disabled: selectedItems.length < 2 }),
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

      const body = view.length
        ? h(
            'div',
            { style: styles.list },
            view.map((asset) =>
              h(AssetCard, {
                key: asset.id,
                asset,
                selectable: selectMode,
                selected: selected.includes(asset.id),
                onToggle: toggleSelect,
                onAskRemove: (id) => askDelete([id]),
                onTag: (id, tags) => {
                  if (!patchAsset(id, { tags })) announce(dict.storeFailed, true)
                },
              }),
            ),
          )
        : items.length || query.trim()
          ? h('p', { style: styles.empty }, dict.searchEmpty)
          : helpOpen
            ? null
            : h('p', { style: styles.empty }, dict.empty)

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
      }

      return h(
        'div',
        { style: styles.root },
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: 4 } },
          head,
          h('p', { style: styles.subtitle }, dict.subtitle),
        ),
        toolbar,
        selectBar,
        notice
          ? h(
              'p',
              {
                style: noticeError
                  ? { ...styles.notice, color: 'var(--dsw-alias-state-error-primary)' }
                  : styles.notice,
              },
              notice,
            )
          : null,
        chips,
        helpOpen || items.length === 0 ? h(HelpBlock, { onOpenChat: openChat, showTitle: items.length === 0 }) : null,
        body,
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

    function InsertBridge(props) {
      const [, bump] = React.useState(0)
      const useInput = typeof props.useInput === 'function' ? props.useInput : null
      const draft = useInput ? useInput((state) => state.draft) : ''

      React.useEffect(() => subscribeInsert(() => bump((v) => v + 1)), [])

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

      return h('span', { style: { display: 'none' } })
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
        register('conversation.composer.dock', { name: 'conversation.composer.dock', id: PANEL_ID, order: 40 }, InsertBridge)

        const disposePanel = () => {
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
