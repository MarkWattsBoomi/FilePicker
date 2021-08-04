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
exports.FlowChart = exports.FlowChartColumnDefinition = exports.eFlowChartType = void 0;
var React = require("react");
var FlowBaseComponent_1 = require("./FlowBaseComponent");
var FlowField_1 = require("./FlowField");
var eFlowChartType;
(function (eFlowChartType) {
    eFlowChartType[eFlowChartType["BarChart"] = 0] = "BarChart";
    eFlowChartType[eFlowChartType["ColumnChart"] = 1] = "ColumnChart";
    eFlowChartType[eFlowChartType["GeoChart"] = 2] = "GeoChart";
    eFlowChartType[eFlowChartType["PieChart"] = 3] = "PieChart";
    eFlowChartType[eFlowChartType["DonutChart"] = 4] = "DonutChart";
})(eFlowChartType = exports.eFlowChartType || (exports.eFlowChartType = {}));
var FlowChartColumnDefinition = /** @class */ (function () {
    function FlowChartColumnDefinition(developerName, type) {
        this.developerName = developerName;
        this.type = type;
    }
    return FlowChartColumnDefinition;
}());
exports.FlowChartColumnDefinition = FlowChartColumnDefinition;
var FlowChart = /** @class */ (function (_super) {
    __extends(FlowChart, _super);
    function FlowChart(props) {
        var _this = _super.call(this, props) || this;
        _this.apiKey = "";
        _this.beginChartsApi = _this.beginChartsApi.bind(_this);
        _this.apiLoaded = _this.apiLoaded.bind(_this);
        _this.drawChart = _this.drawChart.bind(_this);
        _this.flowMoved = _this.flowMoved.bind(_this);
        _this.apiKey = _this.getAttribute("APIKey", "");
        return _this;
    }
    FlowChart.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.componentDidMount.call(this)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dontLoadAllValues()];
                    case 2:
                        _a.sent();
                        manywho.eventManager.addDoneListener(this.flowMoved, this.componentId);
                        this.beginChartsApi();
                        return [2 /*return*/];
                }
            });
        });
    };
    FlowChart.prototype.componentWillUnmount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.componentWillUnmount.call(this)];
                    case 1:
                        _a.sent();
                        manywho.eventManager.removeDoneListener(this.componentId);
                        return [2 /*return*/];
                }
            });
        });
    };
    FlowChart.prototype.flowMoved = function (xhr, request) {
        return __awaiter(this, void 0, void 0, function () {
            var me;
            return __generator(this, function (_a) {
                me = this;
                if (xhr.invokeType === "FORWARD") {
                    if (this.loadingState !== FlowBaseComponent_1.eLoadingState.ready) {
                        window.setTimeout(function () { me.flowMoved(xhr, request); }, 500);
                    }
                    else {
                        manywho.model.parseEngineResponse(xhr, this.props.flowKey);
                        this.beginChartsApi();
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    FlowChart.prototype.beginChartsApi = function () {
        if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
            if (typeof window.G13ChartLoading === 'undefined') {
                var script = document.createElement('script');
                script.src = "https://www.gstatic.com/charts/loader.js";
                script.addEventListener('load', this.apiLoaded);
                window.document.body.appendChild(script);
                window.G13ChartLoading = true;
            }
            else {
                // already loading
                window.setTimeout(this.beginChartsApi, 300);
            }
        }
        else {
            this.apiLoaded();
        }
    };
    FlowChart.prototype.apiLoaded = function () {
        var _a;
        if (!(google === null || google === void 0 ? void 0 : google.charts) || !((_a = google === null || google === void 0 ? void 0 : google.visualization) === null || _a === void 0 ? void 0 : _a.GeoChart)) {
            google.charts.load('current', { packages: ['corechart', 'geochart'], mapsApiKey: this.apiKey });
            google.charts.setOnLoadCallback(this.drawChart);
        }
        else {
            this.drawChart();
        }
    };
    // you can override this to build your own data - populate dataTable
    FlowChart.prototype.buildData = function (dataTable) {
        var _this = this;
        if (this.model.dataSource) {
            this.model.dataSource.items.forEach(function (item) {
                var values = [];
                _this.propertyNames.forEach(function (property) {
                    var prop = item.properties[property.developerName];
                    if (property.type === FlowField_1.eContentType.ContentNumber) {
                        values.push(parseInt(prop.value));
                    }
                    else {
                        values.push(prop.value);
                    }
                });
                dataTable.push(values);
            });
        }
    };
    FlowChart.prototype.drawChart = function () {
        var dataTable = [];
        dataTable.push(this.columnNames);
        this.buildData(dataTable);
        this.chartData = google.visualization.arrayToDataTable(dataTable);
        if (!this.chart) {
            switch (this.chartType) {
                case eFlowChartType.BarChart:
                    this.chart = new google.visualization.BarChart(document.getElementById(this.componentId));
                    break;
                case eFlowChartType.ColumnChart:
                    this.chart = new google.visualization.ColumnChart(document.getElementById(this.componentId));
                    break;
                case eFlowChartType.GeoChart:
                    this.chart = new google.visualization.GeoChart(document.getElementById(this.componentId));
                    break;
                case eFlowChartType.PieChart:
                case eFlowChartType.DonutChart:
                    this.chart = new google.visualization.PieChart(document.getElementById(this.componentId));
                    break;
            }
        }
        this.chart.draw(this.chartData, this.options);
    };
    FlowChart.prototype.render = function () {
        return (React.createElement("div", { id: this.componentId }));
    };
    return FlowChart;
}(FlowBaseComponent_1.FlowBaseComponent));
exports.FlowChart = FlowChart;
