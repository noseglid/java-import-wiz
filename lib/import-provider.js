'use babel';

import { getPackage, getImports, getLastImportEndPoint, getPackageDefinitionEndPoint, packagify, denamespace } from './helpers';

/**
 * Checks if the fullyQualifiedClass exists in the array of imports.
 * Supports wildcard imports (such as `java.util.*;`).
 */
function importsIncludes(imports, fullyQualifiedClass) {
  for (const imp of imports) {
    if (imp === fullyQualifiedClass) {
      return true;
    }
    if (denamespace(imp) === '*') {
      // This is a wildcard import. Check if package is the same.
      if (packagify(fullyQualifiedClass) === packagify(imp)) {
        return true;
      }
    }
  }
  return false;
}

function getImportInsertPoint(editor) {
  let point = getLastImportEndPoint(editor);
  if (!point) {
    point = getPackageDefinitionEndPoint(editor);
  }
  if (!point) {
    point = [ 0, 0 ];
  }
  return point;
}

function addImport(editor, fullyQualifiedClass) {
  let rootClass = fullyQualifiedClass;
  const subClassIndex = fullyQualifiedClass.indexOf('$'); // A nested class, e.g. javax.ws.rs.core.Response$Status
  if (subClassIndex !== -1) {
    rootClass = fullyQualifiedClass.substr(0, subClassIndex);
  }

  if (importsIncludes(getImports(editor), rootClass)) {
    return;
  }

  const pkg = getPackage(editor);
  const importPkg = packagify(rootClass);
  if (importPkg === pkg || 'java.lang' === importPkg) {
    return;
  }

  const point = getImportInsertPoint(editor);
  editor.getBuffer().insert(point, `import ${rootClass};\n`);
}

export default addImport;
