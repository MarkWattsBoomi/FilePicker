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
var CaseInsensitiveMap = /** @class */ (function (_super) {
    __extends(CaseInsensitiveMap, _super);
    function CaseInsensitiveMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CaseInsensitiveMap.prototype.set = function (key, value) {
        if (typeof key === "string") {
            key = key.toLowerCase();
        }
        return _super.prototype.set.call(this, key, value);
    };
    return CaseInsensitiveMap;
}(Map));
exports.default = CaseInsensitiveMap;
