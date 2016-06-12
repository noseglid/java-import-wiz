# java-import-wiz

Manage your java imports. `java-import-wiz` works together with [`java-classpath-registry`](https://atom.io/packages/java-classpath-registry) to find the namespaces to import. While not strictly required (e.g. organizing imports will still work) it's strongly recommended.

## Manual importing

Place the cursor on the class and press <kbd>ctrl</kbd><kbd>alt</kbd><kbd>i</kbd>. If the class is unambiguous it will automatically
be added to the import statements. If multiple possibilities exists, `java-import-wiz` will let you choose from a list.

![Demonstrative manual import](https://github.com/noseglid/java-import-wiz/raw/master/manual-import.gif?raw=true "Manual imports")

## Organizing imports

You can organize imports by pressing <kbd>ctrl</kbd><kbd>alt</kbd><kbd>o</kbd>.

![Demonstrative import organization](https://github.com/noseglid/java-import-wiz/raw/master/ordering-imports.gif?raw=true "Organize Imports")

There are two settings available to control the behavior of the import organizer.

  * _Separate Groups_: If namespace groups (e.g. `com.` and `java.`) should be separated
    with an extra newline.
  * _Import Grouping_: Which namespaces should be considered "the same group" in terms
    of sorting, and separation. The default setting (`[ [ "java", "javax" ], [ "com", "org" ] ]`)
    will set `java` and `javax` in the same group. `com` and `org` will similarly be in its own group.
    The gif explains it well.

Sorting in one group will be alphabetical.

Groups themselves will be sorted by the first entry. E.g. `[ 'com', 'org' ]` will be before
`[ 'java', 'javax' ]` because `com` is before `java`.

## Autocompletion

Works together with [`autocomplete-java-minus`](https://github.com/noseglid/autocomplete-java-minus)
to insert imports after autocompleting. When autocompleting classes they will automatically be
added to the import list.

![Demonstrative autocomplete import](https://github.com/noseglid/java-import-wiz/raw/master/autocomplete-import.gif?raw=true "Organize Imports")
