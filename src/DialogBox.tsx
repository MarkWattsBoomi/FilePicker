import * as React from 'react';

import './DialogBox.css';



// Declaration of the component as React Class Component
export class DialogBox extends React.Component<any, any> {
    dragEvent: DragEvent = new DragEvent();
    modal: any;
    dialog: any;

    dialogVisible: boolean = false;
    dialogTitle: string = '';
    dialogButtons: any = [];
    dialogContent: any;
    dialogOnClose: any = this.hideDialog;

    top: number = 0;
    left: number = 0;
  // Init of the component before it is mounted.
    constructor(props: any) {
        super(props);

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.hideDialog = this.hideDialog.bind(this);
    }

    setDialog(dialog: HTMLDivElement) {
      this.dialog = dialog;
      if(this.dialog) {

          const parentXCenter = this.dialog.offsetParent.clientWidth / 2;
          const parentYCenter = this.dialog.offsetParent.clientHeight / 2;
          const dialogXOffset = this.dialog.clientWidth / 2;
          const dialogYOffset = this.dialog.clientHeight / 2;

          this.left = parentXCenter - dialogXOffset;
          this.top = parentYCenter - dialogYOffset;
          this.dialog.classList.add('shown');
          this.positionDialog();
      }
    }

    positionDialog() {
      if(this.dialog) {
          this.dialog.style.left = this.left + "px";
          this.dialog.style.top = this.top + "px";
      }
    }

    stopEventBubble(e:  any) {
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        e.cancelBubble=true;
        e.returnValue=false;
        return false;
    }

    // Add listeners immediately after the component is mounted.
    componentDidMount(){
      this.forceUpdate();
    }

    async showDialog(title: string, content: any, buttons: modalDialogButton[], onClose?: any) {
      this.dialogVisible = true;
      this.dialogTitle = title;
      this.dialogContent = content;
      this.dialogOnClose = onClose || this.hideDialog;
      this.dialogButtons = buttons;
      this.forceUpdate();
      //return this.props.parent.forceUpdate();
    }

    async hideDialog(e? : any) {
        this.dialogVisible = false;
        this.dialogTitle = '';
        this.dialogContent = undefined;
        this.dialogOnClose = undefined;
        this.dialogButtons = [];
        this.forceUpdate();
        //return this.props.parent.forceUpdate();
    }
  
  
    // Handle the key press event.
    handleKeyUp(e: any) {
      const keys: any = {
        27: () => {
          e.preventDefault();
          this.hideDialog();
        },
      };

      if (keys[e.keyCode]) { 
        keys[e.keyCode](); 
      }
    }

  

    // Handle the mouse click on browser window.
    handleOutsideClick(e: any) {
      
      if (!this.dialog) {
          if (!this.dialog.contains(e.target)) {
            this.hideDialog();
          }
      }
    }
  

  // Render the component passing onCloseRequest and children as props.
  render() {
    let content: any;
    if(this.dialogVisible === false) {
      content = (
          <div/>
      );
    }
    else {
      const buttons: Array<JSX.Element> = [];
      for(const button of this.dialogButtons) {
          buttons.push(
              <button 
                  className="modal-dialog-button-bar-button" 
                  title="Cancel" 
                  onMouseDown={(e) => {e.stopPropagation();button.handler()}}
              >
                  {button.label}
              </button>
          );
      }
      content = (
        <div 
          className="modal-redaction"
          onMouseMove={(e) => {this.onMouseMove(e)}}
          onMouseUp={(e) => {this.onMouseUp(e)}}
          onMouseDown={(e) => {this.handleOutsideClick(e)}}
          onContextMenu={e => {e.preventDefault(); e.stopPropagation();if(this.props.onContextMenu){this.props.onContextMenu()}}}
        >
          <div 
            className="modal-content"
            ref={(node) => {this.setDialog(node)}}
            >
              <div className="modal-dialog">
                <div 
                  className="modal-dialog-header"
                  onMouseDown={(e) => {this.onMouseDown(e)}}
                >
                  <div style={{display: 'flex', flexDirection: "row", flexGrow: 1}}>
                    <span className="modal-dialog-header-title">{this.dialogTitle}</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: "row", marginLeft: 'auto', flexGrow: 0}}>
                    <span
                      className="glyphicon glyphicon-remove modal-dialog-header-button"
                      title="Close"
                      onMouseDown={(e) => {e.stopPropagation(); this.dialogOnClose()}}
                    />
                  </div>
                </div>
                <div className="modal-dialog-body">
                    <div className="modal-dialog-body-client">
                    {this.dialogContent}                               
                    </div>
                </div >
                  <div className="modal-dialog-button-bar">
                      {buttons}   
                  </div>
              </div >
          </div>
        </div>
      );
    }
    return content;
  }

  moveMe(left: number, top: number) {
      this.left = left;
      this.top = top; // - this.box.getBoundingClientRect().top;
      this.positionDialog();
  }

  onMouseDown(e: any) {
    //this.stopEventBubble(e);
    //include component bounding rect to allow for mouse offset into component
    let clientRect = e.target.getBoundingClientRect();
    let mouseOffsetY: number = e.clientY - clientRect.top;
    this.dragEvent = DragEvent.start(eDragEventType.dialog, this, e.clientX - clientRect.left, mouseOffsetY);
  }

  onMouseMove(e: any) {
    //this.stopEventBubble(e);
    if(this.dragEvent.type === eDragEventType.dialog)
    {
      this.moveMe(e.clientX - this.dragEvent.mouseOffsetX, e.clientY - this.dragEvent.mouseOffsetY);
    }
  }

  onMouseUp(e: any) {
    //this.stopEventBubble(e);
    if(this.dragEvent.type === eDragEventType.dialog)
    {
      this.dragEvent.end(null,e.clientX, e.clientY);
    }
  }
}

export class modalDialogButton {
    label: string;
    handler: any;
  
    constructor(label: string, handler: any) {
      this.label = label;
      this.handler = handler;
    }
  }
  
  export enum eDragEventType
  {
      unknown,
      canvas,
      table,
      link,
      dialog
  }
  
  export class DragEvent
  {
      type: eDragEventType;
      sourceElement: any;
      targetElement: any;
      mouseX: number;
      mouseY: number;
      mouseOffsetX: number;
      mouseOffsetY: number;
  
      constructor()
      {
          this.type = eDragEventType.unknown;
          this.sourceElement = null;
          this.targetElement = null;
          this.mouseX = 0;
          this.mouseY = 0;
          this.mouseOffsetX = 0;
          this.mouseOffsetY = 0;
      }
  
      public static start(type: eDragEventType, sourceElement: any, mouseX: number, mouseY: number): DragEvent
      {
          const evt: DragEvent = new DragEvent();
          evt.type = type;
          evt.sourceElement = sourceElement;
          evt.targetElement = null;
          evt.mouseX = mouseX;
          evt.mouseY = mouseY;
          evt.mouseOffsetX = mouseX;
          evt.mouseOffsetY = mouseY;
          return evt;
      }
  
      drag(mouseX: number, mouseY: number)
      {
          this.mouseX = mouseX;
          this.mouseY = mouseY;
      }
  
      end(target: any, mouseX: number, mouseY: number) : any
      {
  
          this.targetElement = target;
          this.mouseX = mouseX;
          this.mouseY = mouseY;
  
          this.type=eDragEventType.unknown;      
      }
  }

