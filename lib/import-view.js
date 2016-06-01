'use babel';

import { SelectListView } from 'atom-space-pen-views';

class ImportView extends SelectListView {

  initialize(items) {
    super.initialize();
    this.setItems(items);
    this.storeFocusedElement();

    this.panel = atom.workspace.addModalPanel({ item: this });
    this.panel.show();
    this.focusFilterEditor();
  }

  viewForItem(item) {
    return `<li>
      <span class="icon icon-repo-force-push"> </span>
      <span class="text-success">${item}</span>
    </li>`;
  }

  getSelection() {
    return new Promise((resolve, reject) => {
      this.resolvefn = resolve;
      this.rejectfn = reject;
    });
  }

  confirmed(item) {
    this.resolvefn && this.resolvefn(item);
    this.rejectfn = this.resolvefn = undefined;
    this.cancel();
  }

  cancelled() {
    this.rejectfn && this.rejectfn();
    this.panel.hide();
  }
}

export default ImportView;
