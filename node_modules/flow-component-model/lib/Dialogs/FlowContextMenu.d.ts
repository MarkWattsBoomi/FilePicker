import * as React from 'react';
import './FlowContextMenu.css';
export declare class FlowContextMenu extends React.Component<any, any> {
    context: any;
    displayStyle: React.CSSProperties;
    menuItems: any[];
    menu: HTMLDivElement;
    constructor(props: any);
    setMenu(menu: HTMLDivElement): void;
    positionContextMenu(mouseX: number, mouseY: number): void;
    showContextMenu(mouseX: number, mouseY: number, menuItems: Map<string, any>): void;
    hideContextMenu(): void;
    render(): JSX.Element;
}
