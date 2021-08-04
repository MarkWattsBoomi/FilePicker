import * as React from 'react';
import { DragEvent, modalDialogButton } from './Common';
import './FlowDialogBox.css';
export declare class FlowDialogBox extends React.Component<any, any> {
    dragEvent: DragEvent;
    modal: any;
    dialog: any;
    dialogVisible: boolean;
    dialogTitle: string;
    dialogButtons: any;
    dialogContent: any;
    dialogOnClose: any;
    top: number;
    left: number;
    constructor(props: any);
    setDialog(dialog: HTMLDivElement): void;
    positionDialog(): void;
    stopEventBubble(e: any): boolean;
    componentDidMount(): void;
    showDialog(title: string, content: any, buttons: modalDialogButton[], onClose?: any): Promise<void>;
    hideDialog(e?: any): Promise<void>;
    handleKeyUp(e: any): void;
    handleOutsideClick(e: any): void;
    render(): any;
    moveMe(left: number, top: number): void;
    onMouseDown(e: any): void;
    onMouseMove(e: any): void;
    onMouseUp(e: any): void;
}
