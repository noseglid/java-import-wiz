'use babel';

export default {
  PACKAGE_REGEX: /package\s+([^;]+);/,
  IMPORT_REGEX: /import\s+([^;]+);/g,

  provideImport() {
    return ::this.addImport;
  },

  consumeJavaClasspathRegistry(registry) {
    this.classpathRegistry = registry;
    atom.commands.add('atom-workspace', 'java-import-wiz:do-import', ::this.doImport);
  },

  async doImport() {
    const textEditor = atom.workspace.getActiveTextEditor();
    const className = textEditor.getWordUnderCursor();
    const klasses = this.classpathRegistry.find(fullyQualifiedClass =>
      fullyQualifiedClass.substr(fullyQualifiedClass.lastIndexOf('.') + 1) === className);

    if (klasses.length === 0) {
      return;
    }

    let item = klasses[0].name;
    if (klasses.length > 1) {
      const ImportView = require('./import-view');
      try {
        item = await new ImportView(klasses.map(k => k.name)).getSelection();
      } catch (err) {
        return;
      }
    }

    this.addImport(textEditor, item);
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
    editor.scan(this.PACKAGE_REGEX, ({ range }) => (point = range.end.traverse([1, 0])));
    return point;
  },

  getLastImportEndPoint(editor) {
    let point;
    editor.scan(this.IMPORT_REGEX, ({ range }) => (point = range.end.traverse([1, 0])));
    return point;
  },

  getImportInsertPoint(editor) {
    let point = this.getLastImportEndPoint(editor);
    if (!point) {
      point = this.getPackageDefinitionEndPoint(editor);
    }
    if (!point) {
      point = [ 0, 0 ];
    }
    return point;
  },

  addImport(editor, fullyQualifiedClass) {
    let rootClass = fullyQualifiedClass;
    const subClassIndex = fullyQualifiedClass.indexOf('$'); // A nested class, e.g. javax.ws.rs.core.Response$Status
    if (subClassIndex !== -1) {
      rootClass = fullyQualifiedClass.substr(0, subClassIndex);
    }

    if (this.importsIncludes(this.getImports(editor), rootClass)) {
      return;
    }

    const pkg = this.getPackageFromEditor(editor);
    const importPkg = this.getPackageFromFullyQualifiedClass(rootClass);
    if (importPkg === pkg || 'java.lang' === importPkg) {
      return;
    }

    const point = this.getImportInsertPoint(editor);
    editor.getBuffer().insert(point, `import ${rootClass};\n`);
  }

};
