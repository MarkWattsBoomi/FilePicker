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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowContextMenu = void 0;
var React = require("react");
require("./FlowContextMenu.css");
var FlowContextMenu = /** @class */ (function (_super) {
    __extends(FlowContextMenu, _super);
    function FlowContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.displayStyle = {};
        _this.menuItems = [];
        _this.showContextMenu = _this.showContextMenu.bind(_this);
        _this.hideContextMenu = _this.hideContextMenu.bind(_this);
        _this.positionContextMenu = _this.positionContextMenu.bind(_this);
        return _this;
    }
    FlowContextMenu.prototype.setMenu = function (menu) {
        this.menu = menu;
    };
    FlowContextMenu.prototype.positionContextMenu = function (mouseX, mouseY) {
        var menuPostion = {};
        if (mouseX < (window.innerWidth / 2)) {
            this.displayStyle.left = (mouseX - 10); // + "px"; 
            this.displayStyle.right = undefined;
        }
        else {
            this.displayStyle.left = undefined;
            this.displayStyle.right = (window.innerWidth - (mouseX + 10)); // + "px"; 
        }
        if (mouseY < (window.innerHeight / 2)) {
            this.displayStyle.top = (mouseY - 10); // + "px"; 
            this.displayStyle.bottom = undefined;
        }
        else {
            this.displayStyle.top = undefined;
            this.displayStyle.bottom = (window.innerHeight - (mouseY + 10)) + "px";
        }
        this.displayStyle.display = "block";
    };
    FlowContextMenu.prototype.showContextMenu = function (mouseX, mouseY, menuItems) {
        if (menuItems.size > 0) {
            var menuItemArray_1 = [];
            menuItems.forEach(function (item) {
                menuItemArray_1.push(item);
            });
            this.menuItems = menuItemArray_1;
            this.positionContextMenu(mouseX, mouseY);
            this.forceUpdate();
        }
    };
    FlowContextMenu.prototype.hideContextMenu = function () {
        this.displayStyle.display = "none";
        this.menuItems = [];
        this.forceUpdate();
    };
    FlowContextMenu.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "cm", onMouseLeave: this.hideContextMenu, style: {
                left: this.displayStyle.left,
                right: this.displayStyle.right,
                top: this.displayStyle.top,
                bottom: this.displayStyle.bottom,
                display: this.displayStyle.display
            }, ref: function (element) { return (_this.setMenu(element)); } },
            React.createElement("ul", { className: "cm-list" }, this.menuItems)));
    };
    return FlowContextMenu;
}(React.Component));
exports.FlowContextMenu = FlowContextMenu;
