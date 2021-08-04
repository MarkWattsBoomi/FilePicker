import * as React from 'react';
import { DragEvent, modalDialogButton } from './Common';
import './FlowMessageBox.css';
export declare class FlowMessageBox extends React.Component<any, any> {
    dragEvent: DragEvent;
    modal: any;
    dialog: HTMLDivElement;
    top: number;
    left: number;
    msgboxVisible: boolean;
    msgboxTitle: string;
    msgboxButtons: any;
    msgboxContent: any;
    msgboxOnClose: any;
    setDialog(dialog: HTMLDivElement): void;
    constructor(props: any);
    positionDialog(): void;
    componentDidMount(): void;
    showMessageBox(title: string, content: any, buttons: modalDialogButton[], onClose?: any): Promise<void>;
    hideMessageBox(e?: any): Promise<void>;
    stopEventBubble(e: any): boolean;
    handleKeyUp(e: any): void;
    render(): any;
    moveMe(left: number, top: number): void;
    onMouseDown(e: any): void;
    onMouseMove(e: any): void;
    onMouseUp(e: any): void;
}
