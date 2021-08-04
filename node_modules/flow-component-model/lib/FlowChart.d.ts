/// <reference types="react" />
import { FlowBaseComponent } from "./FlowBaseComponent";
import { eContentType } from "./FlowField";
export declare enum eFlowChartType {
    BarChart = 0,
    ColumnChart = 1,
    GeoChart = 2,
    PieChart = 3,
    DonutChart = 4
}
export declare class FlowChartColumnDefinition {
    developerName: string;
    type: eContentType;
    constructor(developerName: string, type: eContentType);
}
export declare class FlowChart extends FlowBaseComponent {
    chartData: any;
    chart: any;
    columnNames: any[];
    propertyNames: FlowChartColumnDefinition[];
    options: any;
    chartType: eFlowChartType;
    apiKey: string;
    constructor(props: any);
    componentDidMount(): Promise<void>;
    componentWillUnmount(): Promise<void>;
    flowMoved(xhr: any, request: any): Promise<void>;
    beginChartsApi(): void;
    apiLoaded(): void;
    buildData(dataTable: any[]): void;
    drawChart(): void;
    render(): JSX.Element;
}
