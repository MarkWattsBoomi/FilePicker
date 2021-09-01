import * as React from 'react';
import './FilePicker.css';

import './EventManager';
import { CSSProperties } from 'react';
import { DialogBox, modalDialogButton } from './DialogBox';

declare const manywho: any;

export default class FilePicker extends React.Component<any,any> {
    selectedItem: string = null;
    imgDiv: any;
    img: any;
    text: string = '';
    fileInput: any;

    messageBox: DialogBox;

    lastContent: any = (<div></div>);

    constructor(props: any) {
        super(props);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.ResizeBase64Img = this.ResizeBase64Img.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.isImage = this.isImage.bind(this);
        this.rescaleImage = this.rescaleImage.bind(this);
        this.flowMoved = this.flowMoved.bind(this);

        this.state={
            imgData: undefined,
            fileName: undefined
        }

    }

    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==='FORWARD') {
           //manywho.model.parseEngineResponse(xhr, this.props.flowKey);
           //await this.preserveState();
           //this.forceUpdate();
        }
        else if(xhr.invokeType==='SYNC') {
            //manywho.model.parseEngineSyncResponse(xhr, this.props.flowKey);
            //await this.preserveState();
            //this.forceUpdate();
         }
     }

    async componentDidMount() {
        //(manywho as any).eventManager.addDoneListener(this.flowMoved, this.props.id);
        await this.preserveState();
        this.forceUpdate();
    }

    async preserveState(){
        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        let newState : any = {};
        if (model.contentType === 'ContentString') {
            newState.contentValue = model.contentValue;
        }
        else {
            newState.objectData = model.objectData;
        }
        manywho.state.setComponent(this.props.id, newState, this.props.flowKey,true);
    }

    componentWillUnmount() {
        //(manywho as any).eventManager.removeDoneListener(this.props.id);
    }
    

    rescaleImage(e: any) {
        const width: number = this.img.width;
        const height: number = this.img.height;

        // need to check on IE compatibility here - i think aspect ration is wrong in IE
        if (width >= height) {
             this.img.style.width = '100%';
             this.img.style.height = 'auto';
            // this.imgDiv.style.flexDirection = 'column';
        } else {
             this.img.style.width = 'auto';
             this.img.style.height = '100%';
            // this.imgDiv.style.flexDirection = 'row';
        }
    }

    componentWillReceiveProps(nextProps: any) {
        console.log("ping");
    }

    async clearFile() {
        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        

        let newState : any = {};
        if (model.contentType === 'ContentString') {
            manywho.state.setComponent(this.props.id, {contentValue: ""}, this.props.flowKey,true);
        }
        else {
            let state = manywho.state.getComponent(this.props.id, this.props.flowKey);
            let objData: any;
            if(state.objectData && state.objectData instanceof Array) {
                objData = state.objectData[0];
            }
            else {
                objData = state.objectData;
            }
            if(!objData){
                if(model.objectData && model.objectData instanceof Array) {
                    objData = model.objectData[0];
                }
                else {
                    objData = model.objectData;
                } 
            }
            if(objData) {
                manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.fileNameField,"");
                manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.extensionField,"");
                manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.mimeTypeField,"");
                manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.sizeField,"");
                manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.dataField,"");

                objData.isSelected=false;
            }
            manywho.state.setComponent(this.props.id, {objectData: [objData]}, this.props.flowKey,true);
        }
        manywho.component.handleEvent(this, model, this.props.flowKey);
    }

    pickFile() {
        this.fileInput.value = '';
        this.fileInput.click();
    }

    isImage(mimeType: string): boolean {
        switch (mimeType) {
            case 'image/jpg':
            case 'image/jpeg':
            case 'image/bmp':
            case 'image/gif':
            case 'image/giff':
            case 'image/png':
                return true;

            default:
                return false;
        }
    }

    async fileSelected(e: any) {
        if (this.fileInput.files && this.fileInput.files.length > 0) {
            let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
            const file: File = this.fileInput.files[0];
            let dataURL: string = await this.fileReadAsDataURL(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            let maxSize: number = parseInt(model.attributes["maxSizeKB"] || 0);
            if(maxSize>0 && size>(maxSize * 1000)){
                this.messageBox.showDialog(
                    "File Too Large",
                    (<span>The file you have chosen is { size } bytes long and exceeds the maximum file size of { maxSize }</span>),
                    [new modalDialogButton("Ok",this.messageBox.hideDialog)]
                );
            }
            else {

                if (this.isImage(typ)) {
                    let imgSize: number = 0;
                    if (parseInt(model.attributes['imageSize'] || '0') > 0) {
                        imgSize = parseInt(model.attributes['imageSize']);
                    }
                    if(imgSize > 0) {
                        dataURL = await this.ResizeBase64Img(dataURL, imgSize);
                    }
                    
                }

                let newState : any = {};
                if (model.contentType === 'ContentString') {
                    manywho.state.setComponent(this.props.id, {contentValue: dataURL}, this.props.flowKey,true);
                }
                else {
                    let state = manywho.state.getComponent(this.props.id, this.props.flowKey);
                    let objData: any;
                    
                    if(state.objectData && state.objectData instanceof Array) {
                        objData = state.objectData[0];
                    }
                    else {
                        objData = state.objectData;
                    }
                    if(!objData){
                        if(model.objectData && model.objectData instanceof Array) {
                            objData = model.objectData[0];
                        }
                        else {
                            objData = model.objectData;
                        } 
                    }
                    if(objData) {
                        manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.fileNameField,fname);
                        manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.extensionField,ext);
                        manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.mimeTypeField,typ);
                        manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.sizeField,size);
                        manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.dataField,dataURL);
                    }
                    //objectData.isSelected=true;
                    manywho.state.setComponent(this.props.id, {objectData: [objData]}, this.props.flowKey,true);
                }
                
                
                
                if (model.attributes?.onSelected && model.attributes.onSelected.length > 0) {
                    let outcomes: any = manywho.model.getOutcomes(this.props.id,this.props.flowKey);
                    let closeOutcome: any = outcomes.find((outcome: any) => outcome.value === model.attributes.onSelected);
                    if(closeOutcome) {
                        await manywho.component.onOutcome(closeOutcome, null, this.props.flowKey);
                    }
                }
                else {
                    manywho.component.handleEvent(this, model, this.props.flowKey,);
                }
                

            }

        }
    }

    async fileReadAsDataURL(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }

    async ResizeBase64Img(base64: string, width: number): Promise<any> {

        const img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = () => {
                const aspectRatio = img.height / img.width;
                const canvas = document.createElement('canvas');

                canvas.width = width;
                canvas.height = width * aspectRatio;

                const context = canvas.getContext('2d');

                const reductionFactor = width / img.width;
                context.scale(canvas.width / img.width , canvas.height / img.height);

                context.drawImage(img, 0 , 0);
                const resized = canvas.toDataURL();
                resolve(resized);
            };
            img.onerror = () => {
                reject(new DOMException('Problem loading image file'));
            };
            img.src = base64;
        });
    }

    render() {
        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        let state = manywho.state.getComponent(this.props.id, this.props.flowKey);

        let componentClass: string = "";
        let headerClass: string = "";
        let title: string = model.attributes?.title || 'Select File';

        if(model.attributes?.transparent?.toLowerCase() === "true"){
            componentClass = "file-picker-transparent " + model.attributes?.classes;
            headerClass = "file-picker-header-transparent ";
            title="";
        }
        else {
            componentClass = "file-picker " + model.attributes?.classes;
            headerClass = "file-picker-header ";
        }
        
        let style: CSSProperties = {};
        style.width="-webkit-fill-available";
        style.height="-webkit-fill-available";

        if(model.isVisible === false) {
            style.display = "none";
        }
        if(model.width) {
            style.width=model.width + "px"
        }
        if(model.height) {
            style.height=model.height + "px"
        }

        let filePick: any;
        
        
        let clearButton: any;
        filePick = this.pickFile;
        clearButton = (
            <span 
                className="glyphicon glyphicon-remove file-picker-header-button" 
                onClick={this.clearFile}
                title="Clear selected file"
            />
        );
        

        let file: any;
        let mimeType: string;
        let fileContent: string;
        let fileName: string;
        let extension: string;
        let content: any;

        
        if(model.contentType === "ContentString") {
            content=state.contentValue;
        }
        else {
            let objData: any;
            if(state && state.objectData){
                if(state.objectData instanceof Array){
                    objData=state.objectData[0];
                }
                else {
                    objData=state.objectData;
                }
                
            }
            if(!objData){
        
                if(model.objectData && model.objectData instanceof Array){
                    objData=model.objectData[0];
                }
                else {
                    objData=model.objectData;
                }
                if(objData){
                    manywho.state.setComponent(this.props.id, {objectData: [objData]}, this.props.flowKey,true);
                }
            }

            if(objData) {
                fileName = manywho.utils.getObjectDataProperty(objData.properties,model.attributes["fileNameField"]).contentValue;
                fileContent = manywho.utils.getObjectDataProperty(objData.properties,model.attributes["dataField"]).contentValue;
            }
        }
        
        //file = this.getStateValue() as FlowObjectData;

        if (fileContent) {
            mimeType = fileContent.substring(fileContent.indexOf(':') + 1, fileContent.indexOf(';'));
                
            if (this.isImage(mimeType)) {
                content = (
                    <img
                        style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            width: 'auto',
                            OObjectFit: 'cover',
                        }}
                        ref={(element: HTMLImageElement) => {this.img = element; }}
                        className="file-picker-image"
                        src={fileContent}
                        onLoad={
                            this.rescaleImage
                        }
                    />
                );
            } else {
                content = (
                    <span
                        className="file-picker-file-name"
                    >
                        {fileName}
                    </span>
                );
            }
        }
        else {
            content = (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1
                    }}
                >
                    <div
                        style={{
                            margin: "auto",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <span
                            className="file-picker-file-name"
                            style={{margin: "auto"}}
                        >
                            {"No file selected"}
                        </span>
                        <span
                            className="file-picker-file-name"
                            style={{margin: "auto"}}
                        >
                            {"Click to select a file"}
                        </span>
                    </div>
                </div>
            );
        }

        

        this.lastContent = (
                <div 
                    className={componentClass}
                    style={style}
                >
                    <DialogBox
                        ref={(element: DialogBox) => {this.messageBox = element}}
                    />
                    <div className={headerClass}>
                        <div className="file-picker-header-left">
                            <span className="file-picker-header-title">{title}</span>
                        </div>
                        <div className="file-picker-header-right">
                            {clearButton}
                        </div>

                    </div>
                    <div
                        className="file-picker-body"
                        onClick={filePick}
                        ref={(element: any) => {this.imgDiv = element; }}
                    >
                        {content}
                        <input
                            ref={(ele: any) => {this.fileInput = ele; }}
                            type="file"
                            className="file-file"
                            onChange={this.fileSelected}
                        />
                    </div>
               </div>
        );
        return this.lastContent;
    }

}

manywho.component.register('FilePicker', FilePicker);

