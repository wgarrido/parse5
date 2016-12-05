//Const
const NOAH_ARK_CAPACITY = 3;

//List of formatting elements
const FormattingElementList = module.exports = function (treeAdapter) {
    this.length = 0;
    this.entries = [];
    this.treeAdapter = treeAdapter;
    this.bookmark = null;
};

//Entry types
FormattingElementList.MARKER_ENTRY = 'MARKER_ENTRY';
FormattingElementList.ELEMENT_ENTRY = 'ELEMENT_ENTRY';

//Noah Ark's condition
//OPTIMIZATION: at first we try to find possible candidates for exclusion using
//lightweight heuristics without thorough attributes check.
FormattingElementList.prototype._getNoahArkConditionCandidates = function (newElement) {
    const candidates = [];

    if (this.length >= NOAH_ARK_CAPACITY) {
        const neAttrsLength = this.treeAdapter.getAttrList(newElement).length;
        const neTagName = this.treeAdapter.getTagName(newElement);
        const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);

        for (let i = this.length - 1; i >= 0; i--) {
            const entry = this.entries[i];

            if (entry.type === FormattingElementList.MARKER_ENTRY)
                break;

            const element = entry.element;
            const elementAttrs = this.treeAdapter.getAttrList(element);

            const isCandidate = this.treeAdapter.getTagName(element) === neTagName &&
                          this.treeAdapter.getNamespaceURI(element) === neNamespaceURI &&
                          elementAttrs.length === neAttrsLength;

            if (isCandidate)
                candidates.push({idx: i, attrs: elementAttrs});
        }
    }

    return candidates.length < NOAH_ARK_CAPACITY ? [] : candidates;
};

FormattingElementList.prototype._ensureNoahArkCondition = function (newElement) {
    const candidates = this._getNoahArkConditionCandidates(newElement);
    let cLength = candidates.length;

    if (cLength) {
        const neAttrs = this.treeAdapter.getAttrList(newElement);
        const neAttrsLength = neAttrs.length;
        const neAttrsMap = Object.create(null);

        //NOTE: build attrs map for the new element so we can perform fast lookups
        for (var i = 0; i < neAttrsLength; i++) {
            const neAttr = neAttrs[i];

            neAttrsMap[neAttr.name] = neAttr.value;
        }

        for (i = 0; i < neAttrsLength; i++) {
            for (let j = 0; j < cLength; j++) {
                const cAttr = candidates[j].attrs[i];

                if (neAttrsMap[cAttr.name] !== cAttr.value) {
                    candidates.splice(j, 1);
                    cLength--;
                }

                if (candidates.length < NOAH_ARK_CAPACITY)
                    return;
            }
        }

        //NOTE: remove bottommost candidates until Noah's Ark condition will not be met
        for (i = cLength - 1; i >= NOAH_ARK_CAPACITY - 1; i--) {
            this.entries.splice(candidates[i].idx, 1);
            this.length--;
        }
    }
};

//Mutations
FormattingElementList.prototype.insertMarker = function () {
    this.entries.push({type: FormattingElementList.MARKER_ENTRY});
    this.length++;
};

FormattingElementList.prototype.pushElement = function (element, token) {
    this._ensureNoahArkCondition(element);

    this.entries.push({
        type: FormattingElementList.ELEMENT_ENTRY,
        element,
        token
    });

    this.length++;
};

FormattingElementList.prototype.insertElementAfterBookmark = function (element, token) {
    let bookmarkIdx = this.length - 1;

    for (; bookmarkIdx >= 0; bookmarkIdx--) {
        if (this.entries[bookmarkIdx] === this.bookmark)
            break;
    }

    this.entries.splice(bookmarkIdx + 1, 0, {
        type: FormattingElementList.ELEMENT_ENTRY,
        element,
        token
    });

    this.length++;
};

FormattingElementList.prototype.removeEntry = function (entry) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (this.entries[i] === entry) {
            this.entries.splice(i, 1);
            this.length--;
            break;
        }
    }
};

FormattingElementList.prototype.clearToLastMarker = function () {
    while (this.length) {
        const entry = this.entries.pop();

        this.length--;

        if (entry.type === FormattingElementList.MARKER_ENTRY)
            break;
    }
};

//Search
FormattingElementList.prototype.getElementEntryInScopeWithTagName = function (tagName) {
    for (let i = this.length - 1; i >= 0; i--) {
        const entry = this.entries[i];

        if (entry.type === FormattingElementList.MARKER_ENTRY)
            return null;

        if (this.treeAdapter.getTagName(entry.element) === tagName)
            return entry;
    }

    return null;
};

FormattingElementList.prototype.getElementEntry = function (element) {
    for (let i = this.length - 1; i >= 0; i--) {
        const entry = this.entries[i];

        if (entry.type === FormattingElementList.ELEMENT_ENTRY && entry.element === element)
            return entry;
    }

    return null;
};
