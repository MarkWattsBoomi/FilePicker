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
    fileInput: HTMLInputElement;
    mode: string;
    fileTypes: string[];

    messageBox: DialogBox;

    lastContent: any = (<div></div>);

    constructor(props: any) {
        super(props);
        this.fileSelected = this.fileSelected.bind(this);
        this.fileReadAsDataURL = this.fileReadAsDataURL.bind(this);
        this.ResizeBase64Img = this.ResizeBase64Img.bind(this);
        this.clearFile = this.clearFile.bind(this);
        this.pickFile = this.pickFile.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.isImage = this.isImage.bind(this);
        this.rescaleImage = this.rescaleImage.bind(this);
        this.flowMoved = this.flowMoved.bind(this);
        this.chooseFile = this.chooseFile.bind(this);

        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        this.mode = model.attributes?.mode || "default";
        this.fileTypes = model.attributes?.allowed?.split(",") || ["*"];

        this.state={
            imgData: undefined,
            file: undefined,
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
        await this.clearFile(true);
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

    
    async clearFile(notify: boolean = true) {
        console.log("clear file");
        this.setState({
            imgData: undefined,
            file: undefined,
        });

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
        if (model.attributes?.onCleared && model.attributes.onCleared.length > 0) {
            let outcomes: any = manywho.model.getOutcomes(this.props.id,this.props.flowKey);
            let closeOutcome: any = outcomes.find((outcome: any) => outcome.developerName === model.attributes.onCleared);
            if(closeOutcome) {
                await manywho.component.onOutcome(closeOutcome, null, this.props.flowKey);
            }
            else {
                if(notify === true) {
                    manywho.component.handleEvent(this, model, this.props.flowKey);
                }
            }
        }
        else {
            if(notify === true) {
                manywho.component.handleEvent(this, model, this.props.flowKey);
            }
        }
        
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
            case 'image/webp':
                return true;

            default:
                return false;
        }
    }

 
    async chooseFile(e: any) {

        let pickerOpts: any = {
            types: [],
            excludeAcceptAllOption: true,
            multiple: false,
          };

        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        let attr: string = model.attributes?.extensions || "*";
        let types: string[] = attr.split(",");
        types.forEach((type: string) => {
            type=type.trim().toLowerCase();
            switch(type){
                case "*":
                    pickerOpts.excludeAcceptAllOption = false;
                    break;
                case "csv":
                    pickerOpts.types.push(
                    {
                        description: 'CSV Files',
                        accept: {
                            'text/csv': ['.csv'],
                        },
                        },
                    );
                    break;
                case "xlsx":
                    pickerOpts.types.push(
                    {
                        description: 'Excel Files',
                        accept: {
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsz'],
                        },
                        },
                    );
                    break;
                case "xml":
                    pickerOpts.types.push(
                    {
                        description: 'XML Files',
                        accept: {
                            'application/xhtml+xml': ['.xml'],
                        },
                        },
                    );
                    break;
            }
        });
        
        try{
            let handle: any[] = await (window as any).showOpenFilePicker(pickerOpts);
            if(handle[0].kind === 'file') {
                let file = await handle[0].getFile();
                let data = await this.fileReadAsDataURL(file);
                this.setState({file: file, imageData: data});
            }
        }
        catch(e) {
            console.log(e);
        }
        finally{
            console.log("done");
            await this.fileChosen();
        }
    }

    async fileChosen() {
        if (this.state.file?.name?.length > 0) {
            let model = manywho.model.getComponent(this.props.id, this.props.flowKey);           
            const fname: string = this.state.file.name.lastIndexOf('.') >= 0 ? this.state.file.name.substring(0, this.state.file.name.lastIndexOf('.')) : this.state.file.name;
            const ext: string = this.state.file.name.lastIndexOf('.') >= 0 ? this.state.file.name.substring(this.state.file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = this.state.file.type;
            const size: number = this.state.file.size;
            let dataURL: string = this.state.imageData;

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
                        if(objData.properties,model.attributes?.fileNameField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.fileNameField,fname);
                        }
                        if(objData.properties,model.attributes?.extensionField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.extensionField,ext);
                        }
                        if(objData.properties,model.attributes?.mimeTypeField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.mimeTypeField,typ);
                        }
                        if(objData.properties,model.attributes?.sizeField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.sizeField,size);
                        }
                        if(objData.properties,model.attributes?.dataField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.dataField,dataURL);
                        }
                        
                    }
                    //objectData.isSelected=true;
                    manywho.state.setComponent(this.props.id, {objectData: [objData]}, this.props.flowKey,true);
                }
                
                
                
                if (model.attributes?.onSelected && model.attributes.onSelected.length > 0) {
                    let selectedValue: string = model.attributes.onSelected;
                    let outcomes: any = manywho.model.getOutcomes(this.props.id,this.props.flowKey);
                    let closeOutcome: any = outcomes.find((outcome: any) => {
                        return outcome.developerName === selectedValue
                    });
                    if(closeOutcome) {
                        await manywho.component.onOutcome(closeOutcome, null, this.props.flowKey);
                    }
                    else {
                        manywho.component.handleEvent(this, model, this.props.flowKey);
                    }
                }
                else {
                    manywho.component.handleEvent(this, model, this.props.flowKey);
                }
            }
        }
    }

    async fileSelected(e: any) {

        if (this.fileInput.value.length > 0) {
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
                        if(objData.properties,model.attributes?.fileNameField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.fileNameField,fname);
                        }
                        if(objData.properties,model.attributes?.extensionField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.extensionField,ext);
                        }
                        if(objData.properties,model.attributes?.mimeTypeField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.mimeTypeField,typ);
                        }
                        if(objData.properties,model.attributes?.sizeField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.sizeField,size);
                        }
                        if(objData.properties,model.attributes?.dataField){
                            manywho.utils.setObjectDataProperty(objData.properties,model.attributes?.dataField,dataURL);
                        }
                        
                    }
                    //objectData.isSelected=true;
                    manywho.state.setComponent(this.props.id, {objectData: [objData]}, this.props.flowKey,true);
                }
                
                
                
                if (model.attributes?.onSelected && model.attributes.onSelected.length > 0) {
                    let selectedValue: string = model.attributes.onSelected;
                    let outcomes: any = manywho.model.getOutcomes(this.props.id,this.props.flowKey);
                    let closeOutcome: any = outcomes.find((outcome: any) => {
                        return outcome.developerName === selectedValue
                    });
                    if(closeOutcome) {
                        await manywho.component.onOutcome(closeOutcome, null, this.props.flowKey);
                    }
                    else {
                        manywho.component.handleEvent(this, model, this.props.flowKey);
                    }
                }
                else {
                    manywho.component.handleEvent(this, model, this.props.flowKey,);
                }
            }
        }
        else {
            this.clearFile(true);
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

    async fileReadAsArrayBuffer(file: any): Promise<any> {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onerror = () => {
                reader.abort();
                reject(new DOMException('Problem reading file'));
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsArrayBuffer(file);
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

        switch(this.mode) {
            case "default":
                return this.defaultRender();
            case "basic":
                return this.basicRender();
            case "icon":
                return this.iconRender();
        }
    }

    iconRender() {
        let style: CSSProperties = {};
        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        if(model.isVisible === false) {
            style.display = "none";
        }

        let classes: string = model.attributes?.classes || "";
        
        let icon = model.attributes?.icon || "open";
        let iconClass: string = "file-picker-icon glyphicon glyphicon-" + icon;
        
        let iconStyle: CSSProperties = {};
        iconStyle.fontSize = (model.width / 20) + "rem"

        return (
            <div
                style={style}
                className={classes}
                id={this.props.id}
            >
                <span
                    onClick={this.chooseFile}
                    className={iconClass}
                    style={iconStyle}
                    title="Select a file"
                />
            </div>
        );
    }

    basicRender() {
        let allowed: string = "";
        this.fileTypes.forEach((type: string) => {
            if(allowed.length>0){
                allowed += ","
            }
            if(!type.startsWith(".")) {
                allowed+=".";
            }
            allowed+=type;
        });

        let style: CSSProperties = {};
        let model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        if(model.isVisible === false) {
            style.display = "none";
        }
        if(model.width) {
            style.width=model.width + "px"
        }
        if(model.height) {
            style.height=model.height + "px"
        }

        let clearButton: any;
        if(this.state.file) {
            clearButton = (
                <span
                    className="glyphicon glyphicon-remove-circle file-picker-clear"
                    onClick={(e: any) => {this.clearFile(true)}}
                    title="Clear file selection"
                />
            );
        }

        return (
            <div
                style={style}
                id={this.props.id}
            >
                <span
                    onClick={this.chooseFile}
                    className="file-picker-button"
                >
                    Choose file
                </span>
                <span
                    className="file-picker-filename"
                >
                    {this.state.file?.name}
                </span>
                {clearButton}
            </div>
        );
    }

    defaultRender() {
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
                onClick={(e: any) => {this.clearFile(true)}}
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
            fileContent=state.contentValue;
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
                fileName = manywho.utils.getObjectDataProperty(objData.properties,model.attributes["fileNameField"])?.contentValue;
                fileContent = manywho.utils.getObjectDataProperty(objData.properties,model.attributes["dataField"])?.contentValue;
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

