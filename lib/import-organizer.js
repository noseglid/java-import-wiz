'use babel';

import { getImports, getNamespaceGroup, getPackageDefinitionEndPoint, getLastImportEndPoint } from './helpers';

class ImportOrganizer {
  constructor() {
    atom.commands.add('atom-text-editor', 'java-import-wiz:organize-imports', ::this.organize);
  }

  organize() {
    const editor = atom.workspace.getActiveTextEditor();
    const ordered = getImports(editor).sort();
    this.replaceImports(editor, ordered);
  }

  replaceImports(editor, newImports) {
    let currentGroup = null;
    const importString = newImports.reduce((memo, imp) => {
      const nextGroup = getNamespaceGroup(imp);
      let divide = '\n';
      if (currentGroup !== null && currentGroup !== nextGroup && atom.config.get('java-import-wiz.separateGroups')) {
        divide = '\n\n';
      }

      currentGroup = nextGroup;
      return `${memo}${divide}import ${imp};`;
    }, '');

    const rangeBegin = getPackageDefinitionEndPoint(editor);
    const rangeEnd = getLastImportEndPoint(editor);
    editor.setTextInBufferRange([ rangeBegin, rangeEnd ], `${importString}\n`);
  }
}

export default ImportOrganizer;
