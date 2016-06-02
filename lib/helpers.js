'use babel';

const PACKAGE_REGEX = /package\s+([^;]+);/;
const IMPORT_REGEX = /import\s+([^;]+);/g;

function getImports(editor) {
  const imports = [];
  editor.scan(IMPORT_REGEX, ({ match }) => imports.push(match[1]));
  return imports;
}

function getPackage(editor) {
  let pkg;
  editor.scan(PACKAGE_REGEX, ({ match }) => (pkg = match[1]));
  return pkg;
}

function getNamespaceGroup(namespace) {
  return namespace.substr(0, namespace.indexOf('.'));
}

function getPackageDefinitionEndPoint(editor) {
  let point;
  editor.scan(PACKAGE_REGEX, ({ range }) => (point = range.end.traverse([ 1, 0 ])));
  return point;
}

function getLastImportEndPoint(editor) {
  let point;
  editor.scan(IMPORT_REGEX, ({ range }) => (point = range.end.traverse([ 1, 0 ])));
  return point;
}

function denamespace(klass) {
  return klass.substr(klass.lastIndexOf('.') + 1);
}

function packagify(klass) {
  return klass.substr(0, klass.lastIndexOf('.'));
}

export {
  getImports,
  getPackage,
  getNamespaceGroup,
  getPackageDefinitionEndPoint,
  getLastImportEndPoint,
  denamespace,
  packagify
};
