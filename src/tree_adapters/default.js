import { DOCUMENT_MODE } from '../common/html';

//Node construction
export function createDocument() {
    return {
        nodeName: '#document',
        mode: DOCUMENT_MODE.NO_QUIRKS,
        childNodes: []
    };
}

export function createDocumentFragment() {
    return {
        nodeName: '#document-fragment',
        childNodes: []
    };
}

export function createElement(tagName, namespaceURI, attrs) {
    return {
        nodeName: tagName,
        tagName,
        attrs,
        namespaceURI,
        childNodes: [],
        parentNode: null
    };
}

export function createCommentNode(data) {
    return {
        nodeName: '#comment',
        data,
        parentNode: null
    };
}

const createTextNode = value => ({
    nodeName: '#text',
    value,
    parentNode: null
});


//Tree mutation
export function appendChild(parentNode, newNode) {
    parentNode.childNodes.push(newNode);
    newNode.parentNode = parentNode;
}

export function insertBefore(parentNode, newNode, referenceNode) {
    const insertionIdx = parentNode.childNodes.indexOf(referenceNode);

    parentNode.childNodes.splice(insertionIdx, 0, newNode);
    newNode.parentNode = parentNode;
}

export function setTemplateContent(templateElement, contentElement) {
    templateElement.content = contentElement;
}

export function getTemplateContent(templateElement) {
    return templateElement.content;
}

export function setDocumentType(document, name, publicId, systemId) {
    let doctypeNode = null;

    for (const childNode of document.childNodes) {
        if (childNode.nodeName === '#documentType') {
            doctypeNode = childNode;
            break;
        }
    }

    if (doctypeNode) {
        doctypeNode.name = name;
        doctypeNode.publicId = publicId;
        doctypeNode.systemId = systemId;
    }

    else {
        appendChild(document, {
            nodeName: '#documentType',
            name,
            publicId,
            systemId
        });
    }
}

export function setDocumentMode(document, mode) {
    document.mode = mode;
}

export function getDocumentMode(document) {
    return document.mode;
}

export function detachNode(node) {
    if (node.parentNode) {
        const idx = node.parentNode.childNodes.indexOf(node);

        node.parentNode.childNodes.splice(idx, 1);
        node.parentNode = null;
    }
}

export function insertText(parentNode, text) {
    if (parentNode.childNodes.length) {
        const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];

        if (prevNode.nodeName === '#text') {
            prevNode.value += text;
            return;
        }
    }

    appendChild(parentNode, createTextNode(text));
}

export function insertTextBefore(parentNode, text, referenceNode) {
    const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

    if (prevNode && prevNode.nodeName === '#text')
        prevNode.value += text;
    else
        insertBefore(parentNode, createTextNode(text), referenceNode);
}

export function adoptAttributes(recipient, attrs) {
    const recipientAttrsMap = [];

    for (const attr of recipient.attrs)
        recipientAttrsMap.push(attr.name);

    for (const attr of attrs) {
        if (recipientAttrsMap.indexOf(attr.name) === -1)
            recipient.attrs.push(attr);
    }
}

//Tree traversing
export function getFirstChild(node) {
    return node.childNodes[0];
}

export function getChildNodes(node) {
    return node.childNodes;
}

export function getParentNode(node) {
    return node.parentNode;
}

export function getAttrList(element) {
    return element.attrs;
}

//Node data
export function getTagName(element) {
    return element.tagName;
}

export function getNamespaceURI(element) {
    return element.namespaceURI;
}

export function getTextNodeContent(textNode) {
    return textNode.value;
}

export function getCommentNodeContent(commentNode) {
    return commentNode.data;
}

export function getDocumentTypeNodeName(doctypeNode) {
    return doctypeNode.name;
}

export function getDocumentTypeNodePublicId(doctypeNode) {
    return doctypeNode.publicId;
}

export function getDocumentTypeNodeSystemId(doctypeNode) {
    return doctypeNode.systemId;
}

//Node types
export function isTextNode(node) {
    return node.nodeName === '#text';
}

export function isCommentNode(node) {
    return node.nodeName === '#comment';
}

export function isDocumentTypeNode(node) {
    return node.nodeName === '#documentType';
}

export function isElementNode(node) {
    return !!node.tagName;
}
