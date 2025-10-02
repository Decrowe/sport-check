/**
 * domain-boundaries/enforce
 *
 * Enforce that code inside one domain (src/app/domains/<domain>/...)
 * may only import symbols from another domain via the public API path:
 *   @domains/<otherDomain>/API
 * Any other cross-domain import (alias or relative) is disallowed.
 * Same-domain imports are always allowed.
 */
const path = require('path');

function toPosix(p) {
  return p.replace(/\\/g, '/');
}
function extractDomain(filePath) {
  const m = toPosix(filePath).match(/src\/app\/domains\/([^\/]+)/);
  return m ? m[1] : null;
}
function resolveRelative(fromFile, source) {
  if (!source.startsWith('.')) return null;
  const abs = path.resolve(path.dirname(fromFile), source);
  return toPosix(abs);
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce domain import boundaries', recommended: false },
    schema: [],
    messages: {
      crossDomainAlias:
        'Cross-domain import "{{importSource}}" is not allowed. Use @domains/{{otherDomain}}/API.',
      crossDomainRelative:
        'Relative path reaches into domain "{{otherDomain}}". Use @domains/{{otherDomain}}/API.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    if (filename === '<text>' || filename.includes('node_modules')) return {};
    const currentDomain = extractDomain(filename);
    if (!currentDomain) return {};

    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value;
        if (typeof source !== 'string') return;

        // Alias form @domains/<domain>/...
        if (source.startsWith('@domains/')) {
          const parts = source.split('/');
          if (parts.length >= 2) {
            const otherDomain = parts[1];
            if (otherDomain !== currentDomain) {
              const isPublicApi = parts.length === 3 && parts[2] === 'API';
              if (!isPublicApi) {
                context.report({
                  node,
                  messageId: 'crossDomainAlias',
                  data: { importSource: source, otherDomain },
                });
              }
            }
          }
          return;
        }

        // Relative path potentially crossing domain boundaries.
        if (source.startsWith('.')) {
          const abs = resolveRelative(filename, source);
          if (!abs) return;
          const otherDomain = extractDomain(abs);
          if (otherDomain && otherDomain !== currentDomain) {
            context.report({ node, messageId: 'crossDomainRelative', data: { otherDomain } });
          }
        }
      },
    };
  },
};
