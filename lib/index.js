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

  /**
   * Checks if the fullyQualifiedClass exists in the array of imports.
   * Supports wildcard imports (such as `java.util.*;`).
   */
  importsIncludes(imports, fullyQualifiedClass) {
    for (const imp of imports) {
      if (imp === fullyQualifiedClass) {
        return true;
      }
      if (this.getClassFromFullyQualifiedClass(imp) === '*') {
        // This is a wildcard import. Check if package is the same.
        if (this.getPackageFromFullyQualifiedClass(fullyQualifiedClass) === this.getPackageFromFullyQualifiedClass(imp)) {
          return true;
        }
      }
    }
    return false;
  },

  getPackageFromEditor(editor) {
    let pkg;
    editor.scan(this.PACKAGE_REGEX, ({ match }) => (pkg = match[1]));
    return pkg;
  },

  getPackageFromFullyQualifiedClass(fullyQualifiedClass) {
    return fullyQualifiedClass.substr(0, fullyQualifiedClass.lastIndexOf('.'));
  },

  getClassFromFullyQualifiedClass(fullyQualifiedClass) {
    return fullyQualifiedClass.substr(fullyQualifiedClass.lastIndexOf('.') + 1);
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
    if (this.importsIncludes(this.getImports(editor), fullyQualifiedClass)) {
      return;
    }

    const pkg = this.getPackageFromEditor(editor);
    const importPkg = this.getPackageFromFullyQualifiedClass(fullyQualifiedClass);
    if (importPkg === pkg || 'java.lang' === importPkg) {
      return;
    }

    const point = this.getImportInsertPoint(editor);
    editor.getBuffer().insert(point, `import ${fullyQualifiedClass};\n`);
  }

};
