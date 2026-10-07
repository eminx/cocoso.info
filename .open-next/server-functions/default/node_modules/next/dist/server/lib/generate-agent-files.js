/**
 * Create or update AGENTS.md with managed Next.js instructions when `next dev`
 * detects an AI coding agent.
 *
 * Keep the marker and block content in sync with:
 *   - packages/create-next-app/helpers/generate-agent-files.ts
 *   - packages/next-codemod/lib/agents-md.ts
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    AGENT_FEEDBACK_END_MARKER: null,
    AGENT_FEEDBACK_START_MARKER: null,
    AGENT_RULES_END_MARKER: null,
    AGENT_RULES_START_MARKER: null,
    hasCurrentAgentFeedback: null,
    hasCurrentAgentRules: null,
    removeAgentFeedbackFiles: null,
    removeAgentRulesFiles: null,
    writeAgentFeedbackFiles: null,
    writeAgentFiles: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AGENT_FEEDBACK_END_MARKER: function() {
        return AGENT_FEEDBACK_END_MARKER;
    },
    AGENT_FEEDBACK_START_MARKER: function() {
        return AGENT_FEEDBACK_START_MARKER;
    },
    AGENT_RULES_END_MARKER: function() {
        return AGENT_RULES_END_MARKER;
    },
    AGENT_RULES_START_MARKER: function() {
        return AGENT_RULES_START_MARKER;
    },
    hasCurrentAgentFeedback: function() {
        return hasCurrentAgentFeedback;
    },
    hasCurrentAgentRules: function() {
        return hasCurrentAgentRules;
    },
    removeAgentFeedbackFiles: function() {
        return removeAgentFeedbackFiles;
    },
    removeAgentRulesFiles: function() {
        return removeAgentRulesFiles;
    },
    writeAgentFeedbackFiles: function() {
        return writeAgentFeedbackFiles;
    },
    writeAgentFiles: function() {
        return writeAgentFiles;
    }
});
const _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const AGENT_RULES_START_MARKER = '<!-- BEGIN:nextjs-agent-rules -->';
const AGENT_RULES_END_MARKER = '<!-- END:nextjs-agent-rules -->';
const AGENT_FEEDBACK_START_MARKER = '<!-- BEGIN:nextjs-agent-feedback -->';
const AGENT_FEEDBACK_END_MARKER = '<!-- END:nextjs-agent-feedback -->';
/**
 * Markers written by the pre-bundled-docs version of `agents-md`.
 * Stripped on upsert so projects that ran the old codemod end up with
 * a single current block instead of two stale-and-current blocks.
 */ const LEGACY_AGENT_RULES_START_MARKER = '<!-- NEXT-AGENTS-MD-START -->';
const LEGACY_AGENT_RULES_END_MARKER = '<!-- NEXT-AGENTS-MD-END -->';
function buildAgentRulesBlock() {
    return `${AGENT_RULES_START_MARKER}

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in \`node_modules/next/dist/docs/\` (resolved from this file's directory; in monorepos the \`next\` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by \`next dev\` — verify at \`node_modules/next/dist/server/lib/generate-agent-files.js\`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

${AGENT_RULES_END_MARKER}`;
}
/**
 * The block points agents at `next internal agent-feedback-instructions`.
 * That command is not covered by semver, which is acceptable here because
 * `next dev` rewrites this block whenever the installed version changes it,
 * so a project never keeps an instruction that its own `next` can't serve.
 */ function buildAgentFeedbackBlock() {
    return `${AGENT_FEEDBACK_START_MARKER}

## Report Next.js feedback

The project owner enabled \`experimental.agentFeedback\`, authorizing this feedback pass. When enabled, \`next dev\` writes this block and restores it if removed. Commit \`AGENTS.md\` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Ignore routine debugging and unverified changes. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Keep a qualifying candidate through the reporting pass even if you resolve or work around it. A successful fix changes the report outcome; it does not erase the friction that qualified it.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run \`node node_modules/next/dist/bin/next internal agent-feedback-instructions\` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

${AGENT_FEEDBACK_END_MARKER}`;
}
/**
 * Returns the managed block (markers included) found in `content`, or
 * `null` when the markers are absent or malformed.
 */ function extractAgentRulesBlock(content) {
    return extractManagedBlock(content, AGENT_RULES_START_MARKER, AGENT_RULES_END_MARKER);
}
function extractManagedBlock(content, startMarker, endMarker) {
    const start = content.indexOf(startMarker);
    if (start === -1) return null;
    const end = content.indexOf(endMarker, start);
    if (end === -1) return null;
    return content.slice(start, end + endMarker.length);
}
function hasCurrentAgentRules(dir) {
    const block = buildAgentRulesBlock();
    const content = tryReadFile(_path.default.join(dir, 'AGENTS.md'));
    if (!content) return false;
    const installed = extractAgentRulesBlock(content);
    return installed !== null && normalizeEol(installed, '\n') === block;
}
function hasCurrentAgentFeedback(dir) {
    const block = buildAgentFeedbackBlock();
    const content = tryReadFile(_path.default.join(dir, 'AGENTS.md'));
    if (!content) return false;
    const installed = extractManagedBlock(content, AGENT_FEEDBACK_START_MARKER, AGENT_FEEDBACK_END_MARKER);
    return installed !== null && normalizeEol(installed, '\n') === block;
}
function writeAgentFiles(projectDir) {
    const agentsMdPath = _path.default.join(projectDir, 'AGENTS.md');
    const block = buildAgentRulesBlock();
    if (_fs.default.existsSync(agentsMdPath)) {
        return {
            agentsMd: upsertFile(agentsMdPath, block)
        };
    }
    _fs.default.writeFileSync(agentsMdPath, block + '\n', 'utf-8');
    return {
        agentsMd: 'created'
    };
}
function writeAgentFeedbackFiles(projectDir) {
    const agentsMdPath = _path.default.join(projectDir, 'AGENTS.md');
    const block = buildAgentFeedbackBlock();
    if (_fs.default.existsSync(agentsMdPath)) {
        return {
            agentsMd: upsertFeedbackFile(agentsMdPath, block)
        };
    }
    _fs.default.writeFileSync(agentsMdPath, block + '\n', 'utf-8');
    return {
        agentsMd: 'created'
    };
}
function removeAgentFeedbackFiles(projectDir) {
    return {
        agentsMd: removeManagedBlockFromFile(_path.default.join(projectDir, 'AGENTS.md'), AGENT_FEEDBACK_START_MARKER, AGENT_FEEDBACK_END_MARKER)
    };
}
function removeAgentRulesFiles(projectDir) {
    return {
        agentsMd: removeManagedBlockFromFile(_path.default.join(projectDir, 'AGENTS.md'), AGENT_RULES_START_MARKER, AGENT_RULES_END_MARKER)
    };
}
// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function tryReadFile(filePath) {
    try {
        return _fs.default.readFileSync(filePath, 'utf-8');
    } catch  {
        return null;
    }
}
function upsertFile(filePath, block) {
    const existing = _fs.default.readFileSync(filePath, 'utf-8');
    const updated = upsertAgentRulesBlock(existing, block);
    if (updated === existing) return 'unchanged';
    _fs.default.writeFileSync(filePath, updated, 'utf-8');
    return 'updated';
}
function upsertFeedbackFile(filePath, block) {
    const existing = _fs.default.readFileSync(filePath, 'utf-8');
    const updated = upsertManagedBlock(existing, block, AGENT_FEEDBACK_START_MARKER, AGENT_FEEDBACK_END_MARKER);
    if (updated === existing) return 'unchanged';
    _fs.default.writeFileSync(filePath, updated, 'utf-8');
    return 'updated';
}
function removeManagedBlockFromFile(filePath, startMarker, endMarker) {
    const existing = tryReadFile(filePath);
    if (existing === null) return 'skipped';
    const updated = removeManagedBlock(existing, startMarker, endMarker);
    if (updated === existing) return 'unchanged';
    if (updated.trim() === '') {
        // Nothing but the managed block lived here, so Next.js effectively owned
        // the file. Leaving a zero-byte AGENTS.md behind is more confusing than
        // removing it.
        _fs.default.unlinkSync(filePath);
    } else {
        _fs.default.writeFileSync(filePath, updated, 'utf-8');
    }
    return 'removed';
}
/**
 * Detect the predominant line-ending style. Returns `'\r\n'` if any
 * CRLF is present, `'\n'` otherwise — avoids mixed EOLs on Windows.
 */ function detectEol(content) {
    return /\r\n/.test(content) ? '\r\n' : '\n';
}
function normalizeEol(s, eol) {
    return s.replace(/\r?\n/g, eol);
}
function upsertAgentRulesBlock(existing, block) {
    const eol = detectEol(existing);
    const normalizedBlock = normalizeEol(block, eol);
    existing = stripLegacyAgentRulesBlock(existing, eol);
    const startIdx = existing.indexOf(AGENT_RULES_START_MARKER);
    const endIdx = existing.indexOf(AGENT_RULES_END_MARKER);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const before = existing.slice(0, startIdx);
        const after = existing.slice(endIdx + AGENT_RULES_END_MARKER.length);
        const replaced = before + normalizedBlock + after;
        return replaced === existing ? existing : replaced;
    }
    const separator = existing.length === 0 || /\r?\n$/.test(existing) ? eol : eol + eol;
    return existing + separator + normalizedBlock + eol;
}
function upsertManagedBlock(existing, block, startMarker, endMarker) {
    const eol = detectEol(existing);
    const normalizedBlock = normalizeEol(block, eol);
    const startIdx = existing.indexOf(startMarker);
    const endIdx = existing.indexOf(endMarker, startIdx);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const before = existing.slice(0, startIdx);
        const after = existing.slice(endIdx + endMarker.length);
        return before + normalizedBlock + after;
    }
    const separator = existing.length === 0 || /\r?\n$/.test(existing) ? eol : eol + eol;
    return existing + separator + normalizedBlock + eol;
}
function removeManagedBlock(existing, startMarker, endMarker) {
    const startIdx = existing.indexOf(startMarker);
    if (startIdx === -1) return existing;
    const endIdx = existing.indexOf(endMarker, startIdx);
    if (endIdx === -1) return existing;
    let cutStart = startIdx;
    while(cutStart > 0 && /[\t ]/.test(existing[cutStart - 1]))cutStart--;
    if (cutStart > 0 && existing[cutStart - 1] === '\n') {
        cutStart--;
        if (cutStart > 0 && existing[cutStart - 1] === '\r') cutStart--;
    }
    let cutEnd = endIdx + endMarker.length;
    while(cutEnd < existing.length && /[\t ]/.test(existing[cutEnd]))cutEnd++;
    if (existing[cutEnd] === '\r') cutEnd++;
    if (existing[cutEnd] === '\n') cutEnd++;
    // A block at the very top has no preceding newline to absorb, so also drop
    // the blank line that separated it from the content below. Otherwise the
    // file would start with an empty line.
    if (cutStart === 0) {
        if (existing[cutEnd] === '\r') cutEnd++;
        if (existing[cutEnd] === '\n') cutEnd++;
    }
    const before = existing.slice(0, cutStart);
    const after = existing.slice(cutEnd);
    const separator = before.length > 0 && after.length > 0 && !before.endsWith('\n') && !after.startsWith('\r') && !after.startsWith('\n') ? detectEol(existing) : '';
    return before + separator + after;
}
function stripLegacyAgentRulesBlock(existing, eol = '\n') {
    while(true){
        const startIdx = existing.indexOf(LEGACY_AGENT_RULES_START_MARKER);
        if (startIdx === -1) return existing;
        const endIdx = existing.indexOf(LEGACY_AGENT_RULES_END_MARKER, startIdx);
        if (endIdx === -1) return existing;
        let cutStart = startIdx;
        while(cutStart > 0 && /\s/.test(existing[cutStart - 1])){
            cutStart--;
        }
        let cutEnd = endIdx + LEGACY_AGENT_RULES_END_MARKER.length;
        while(cutEnd < existing.length && /\s/.test(existing[cutEnd])){
            cutEnd++;
        }
        const before = existing.slice(0, cutStart);
        const after = existing.slice(cutEnd);
        existing = before.length > 0 && after.length > 0 ? before + eol + eol + after : before + after;
    }
}

//# sourceMappingURL=generate-agent-files.js.map