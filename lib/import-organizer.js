'use babel';

import { getImports, getNamespaceGroup, getPackageDefinitionEndPoint, getLastImportEndPoint } from './helpers';

function buildGroups(importGrouping, imports) {
  return imports.reduce((memo, imp) => {
    const namespaceGroup = getNamespaceGroup(imp);
    const grouping = importGrouping.find(group => group.includes(namespaceGroup));
    const topLevel = grouping ? grouping[0] : namespaceGroup;
    memo[topLevel] = memo[topLevel] || [];
    memo[topLevel].push(imp);
    return memo;
  }, {});
}

function sortGroups(groups) {
  for (const topLevel in groups) {
    if (groups.hasOwnProperty(topLevel)) {
      groups[topLevel] = groups[topLevel].sort();
    }
  }
}

function createImportString(groups) {
  const groupOrder = Object.keys(groups).sort();
  return groupOrder
    .map(group => groups[group].map(imp => `import ${imp};`).join('\n'))
    .join(atom.config.get('java-import-wiz.separateGroups') ? '\n\n' : '\n');
}

class ImportOrganizer {
  constructor() {
    atom.commands.add('atom-text-editor', 'java-import-wiz:organize-imports', ::this.organize);
  }

  getImportGrouping() {
    try {
      return JSON.parse(atom.config.get('java-import-wiz.importGrouping'));
    } catch (e) {
      return [];
    }
  }

  organize() {
    const editor = atom.workspace.getActiveTextEditor();

    const imports = getImports(editor);
    const groups = buildGroups(this.getImportGrouping(), imports);
    sortGroups(groups);

    this.replaceImports(editor, groups);
  }

  replaceImports(editor, groups) {
    const importString = createImportString(groups);
    const rangeBegin = getPackageDefinitionEndPoint(editor);
    const rangeEnd = getLastImportEndPoint(editor);
    const prefix = rangeBegin ? '\n' : ''; // If there is no package, do not start with a newline
    const postfix = '\n';
    editor.setTextInBufferRange([ rangeBegin, rangeEnd ], `${prefix}${importString}${postfix}`);
  }
}

export default ImportOrganizer;
