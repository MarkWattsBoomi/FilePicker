"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragEvent = exports.eDragEventType = exports.modalDialogButton = void 0;
var modalDialogButton = /** @class */ (function () {
    function modalDialogButton(label, handler) {
        this.label = label;
        this.handler = handler;
    }
    return modalDialogButton;
}());
exports.modalDialogButton = modalDialogButton;
var eDragEventType;
(function (eDragEventType) {
    eDragEventType[eDragEventType["unknown"] = 0] = "unknown";
    eDragEventType[eDragEventType["canvas"] = 1] = "canvas";
    eDragEventType[eDragEventType["table"] = 2] = "table";
    eDragEventType[eDragEventType["link"] = 3] = "link";
    eDragEventType[eDragEventType["dialog"] = 4] = "dialog";
})(eDragEventType = exports.eDragEventType || (exports.eDragEventType = {}));
var DragEvent = /** @class */ (function () {
    function DragEvent() {
        this.type = eDragEventType.unknown;
        this.sourceElement = null;
        this.targetElement = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
    }
    DragEvent.start = function (type, sourceElement, mouseX, mouseY) {
        var evt = new DragEvent();
        evt.type = type;
        evt.sourceElement = sourceElement;
        evt.targetElement = null;
        evt.mouseX = mouseX;
        evt.mouseY = mouseY;
        evt.mouseOffsetX = mouseX;
        evt.mouseOffsetY = mouseY;
        return evt;
    };
    DragEvent.prototype.drag = function (mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    };
    DragEvent.prototype.end = function (target, mouseX, mouseY) {
        this.targetElement = target;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.type = eDragEventType.unknown;
    };
    return DragEvent;
}());
exports.DragEvent = DragEvent;
