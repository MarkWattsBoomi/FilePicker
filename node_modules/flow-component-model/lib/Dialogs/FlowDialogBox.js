"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowDialogBox = void 0;
var React = require("react");
var Common_1 = require("./Common");
require("./FlowDialogBox.css");
// Declaration of the component as React Class Component
var FlowDialogBox = /** @class */ (function (_super) {
    __extends(FlowDialogBox, _super);
    // Init of the component before it is mounted.
    function FlowDialogBox(props) {
        var _this = _super.call(this, props) || this;
        _this.dragEvent = new Common_1.DragEvent();
        _this.dialogVisible = false;
        _this.dialogTitle = '';
        _this.dialogButtons = [];
        _this.dialogOnClose = _this.hideDialog;
        _this.top = 0;
        _this.left = 0;
        _this.handleKeyUp = _this.handleKeyUp.bind(_this);
        _this.handleOutsideClick = _this.handleOutsideClick.bind(_this);
        _this.showDialog = _this.showDialog.bind(_this);
        _this.hideDialog = _this.hideDialog.bind(_this);
        return _this;
    }
    FlowDialogBox.prototype.setDialog = function (dialog) {
        this.dialog = dialog;
        if (this.dialog) {
            var parentXCenter = this.dialog.offsetParent.clientWidth / 2;
            var parentYCenter = this.dialog.offsetParent.clientHeight / 2;
            var dialogXOffset = this.dialog.clientWidth / 2;
            var dialogYOffset = this.dialog.clientHeight / 2;
            this.left = parentXCenter - dialogXOffset;
            this.top = parentYCenter - dialogYOffset;
            this.dialog.classList.add('shown');
            this.positionDialog();
        }
    };
    FlowDialogBox.prototype.positionDialog = function () {
        if (this.dialog) {
            this.dialog.style.left = this.left + "px";
            this.dialog.style.top = this.top + "px";
        }
    };
    FlowDialogBox.prototype.stopEventBubble = function (e) {
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    };
    // Add listeners immediately after the component is mounted.
    FlowDialogBox.prototype.componentDidMount = function () {
        this.forceUpdate();
    };
    FlowDialogBox.prototype.showDialog = function (title, content, buttons, onClose) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dialogVisible = true;
                this.dialogTitle = title;
                this.dialogContent = content;
                this.dialogOnClose = onClose || this.hideDialog;
                this.dialogButtons = buttons;
                this.forceUpdate();
                return [2 /*return*/];
            });
        });
    };
    FlowDialogBox.prototype.hideDialog = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dialogVisible = false;
                this.dialogTitle = '';
                this.dialogContent = undefined;
                this.dialogOnClose = undefined;
                this.dialogButtons = [];
                this.forceUpdate();
                return [2 /*return*/];
            });
        });
    };
    // Handle the key press event.
    FlowDialogBox.prototype.handleKeyUp = function (e) {
        var _this = this;
        var keys = {
            27: function () {
                e.preventDefault();
                _this.hideDialog();
            },
        };
        if (keys[e.keyCode]) {
            keys[e.keyCode]();
        }
    };
    // Handle the mouse click on browser window.
    FlowDialogBox.prototype.handleOutsideClick = function (e) {
        if (!this.dialog) {
            if (!this.dialog.contains(e.target)) {
                this.hideDialog();
            }
        }
    };
    // Render the component passing onCloseRequest and children as props.
    FlowDialogBox.prototype.render = function () {
        var _this = this;
        var content;
        if (this.dialogVisible === false) {
            content = (React.createElement("div", null));
        }
        else {
            var buttons = [];
            var _loop_1 = function (button) {
                buttons.push(React.createElement("button", { className: "modal-dialog-button-bar-button", title: "Cancel", onMouseDown: function (e) { e.stopPropagation(); button.handler(); } }, button.label));
            };
            for (var _i = 0, _a = this.dialogButtons; _i < _a.length; _i++) {
                var button = _a[_i];
                _loop_1(button);
            }
            content = (React.createElement("div", { className: "modal-redaction", onMouseMove: function (e) { _this.onMouseMove(e); }, onMouseUp: function (e) { _this.onMouseUp(e); }, onMouseDown: function (e) { _this.handleOutsideClick(e); }, onContextMenu: function (e) { e.preventDefault(); e.stopPropagation(); if (_this.props.onContextMenu) {
                    _this.props.onContextMenu();
                } } },
                React.createElement("div", { className: "modal-content", ref: function (node) { return (_this.dialog = node); } },
                    React.createElement("div", { className: "modal-dialog" },
                        React.createElement("div", { className: "modal-dialog-header", onMouseDown: function (e) { _this.onMouseDown(e); } },
                            React.createElement("div", { style: { display: 'flex', flexDirection: "row", flexGrow: 1 } },
                                React.createElement("span", { className: "modal-dialog-header-title" }, this.props.title)),
                            React.createElement("div", { style: { display: 'flex', flexDirection: "row", marginLeft: 'auto', flexGrow: 0 } },
                                React.createElement("span", { className: "glyphicon glyphicon-remove modal-dialog-header-button", style: { cursor: 'pointer', color: '#fefefe', marginRight: '5px', fontSize: '14pt' }, title: "Close", onMouseDown: function (e) { e.stopPropagation(); _this.props.onClose('cancel'); } }))),
                        React.createElement("div", { className: "modal-dialog-body" },
                            React.createElement("div", { className: "modal-dialog-body-client" }, this.props.children)),
                        React.createElement("div", { className: "modal-dialog-button-bar" }, buttons)))));
        }
        return content;
    };
    FlowDialogBox.prototype.moveMe = function (left, top) {
        this.left = left;
        this.top = top; // - this.box.getBoundingClientRect().top;
        this.positionDialog();
    };
    FlowDialogBox.prototype.onMouseDown = function (e) {
        //this.stopEventBubble(e);
        //include component bounding rect to allow for mouse offset into component
        var clientRect = e.target.getBoundingClientRect();
        var mouseOffsetY = e.clientY - clientRect.top;
        this.dragEvent = Common_1.DragEvent.start(Common_1.eDragEventType.dialog, this, e.clientX - clientRect.left, mouseOffsetY);
    };
    FlowDialogBox.prototype.onMouseMove = function (e) {
        //this.stopEventBubble(e);
        if (this.dragEvent.type === Common_1.eDragEventType.dialog) {
            this.moveMe(e.clientX - this.dragEvent.mouseOffsetX, e.clientY - this.dragEvent.mouseOffsetY);
        }
    };
    FlowDialogBox.prototype.onMouseUp = function (e) {
        //this.stopEventBubble(e);
        if (this.dragEvent.type === Common_1.eDragEventType.dialog) {
            this.dragEvent.end(null, e.clientX, e.clientY);
        }
    };
    return FlowDialogBox;
}(React.Component));
exports.FlowDialogBox = FlowDialogBox;
