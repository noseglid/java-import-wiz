'use babel';

export default {

  activate() {
    const ImportOrganizer = require('./import-organizer');
    this.importOrganizer = new ImportOrganizer();
  },

  provideImport() {
    return require('./import-provider');
  },

  consumeJavaClasspathRegistry(registry) {
    this.classpathRegistry = registry;

    // Cannot do imports until we have a registry to work with
    atom.commands.add('atom-text-editor', 'java-import-wiz:do-import', ::this.doImport);
  },

  async doImport() {
    const textEditor = atom.workspace.getActiveTextEditor();
    const className = textEditor.getWordUnderCursor();
    const klasses = this.classpathRegistry.filter(fullyQualifiedClass =>
      fullyQualifiedClass.substr(fullyQualifiedClass.lastIndexOf('.') + 1) === className);

    if (klasses.length === 0) {
      return;
    }

    let item = klasses[0].name;
    if (klasses.length > 1) {
      try {
        const ImportView = require('./import-view');
        item = await new ImportView(klasses.map(k => k.name)).getSelection();
      } catch (err) {
        return;
      }
    }

    require('./import-provider')(textEditor, item);
  }

};
