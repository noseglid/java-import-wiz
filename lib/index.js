'use babel';

import { Point } from 'atom';

export default {
  PACKAGE_REGEX: /package\s+([^;]+);/,
  IMPORT_REGEX: /import\s+([^;]+);/g,

  provideImport() {
    return ::this.addImport;
  },

  getImports(editor) {
    const imports = [];
    editor.scan(this.IMPORT_REGEX, ({ match }) => imports.push(match[1]));
    return imports;
  },

  getPackageFromEditor(editor) {
    let pkg;
    editor.scan(this.PACKAGE_REGEX, ({ match }) => (pkg = match[1]));
    return pkg;
  },

  getPackageFromClass(klass) {
    return klass.substr(0, klass.lastIndexOf('.'));
  },

  getPackageDefinitionEndPoint(editor) {
    let point;
    editor.scan(this.PACKAGE_REGEX, ({ range }) => (point = range.end.traverse(new Point(1, 0))));
    return point;
  },

  getLastImportEndPoint(editor) {
    let point;
    editor.scan(this.IMPORT_REGEX, ({ range }) => (point = range.end.traverse(new Point(1, 0))));
    return point;
  },

  getImportInsertPoint(editor) {
    let point = this.getLastImportEndPoint(editor);
    if (!point) {
      point = this.getPackageDefinitionEndPoint(editor);
    }
    if (!point) {
      point = new Point(0, 0);
    }
    return point;
  },

  addImport(editor, fullyQualifiedClass) {
    const imports = this.getImports(editor);
    if (imports.includes(fullyQualifiedClass)) {
      return;
    }

    const pkg = this.getPackageFromEditor(editor);
    const importPkg = this.getPackageFromClass(fullyQualifiedClass);
    if ( importPkg === pkg || 'java.lang' === importPkg) {
      return;
    }

    const point = this.getImportInsertPoint(editor);
    editor.getBuffer().insert(point, `import ${fullyQualifiedClass};\n`);
  }

};
