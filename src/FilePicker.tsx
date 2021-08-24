import * as React from 'react';
import './FilePicker.css';

import {eContentType, eLoadingState, FlowComponent, FlowMessageBox, FlowObjectData, FlowObjectDataProperty, modalDialogButton} from 'flow-component-model';
import { CSSProperties, HTMLProps } from 'react';

declare const manywho: any;

export default class FilePicker extends FlowComponent {
    selectedItem: string = null;
    imgDiv: any;
    img: any;
    text: string = '';
    fileInput: any;

    messageBox: FlowMessageBox;

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

    }

    async componentDidMount() {
        await super.componentDidMount();
        this.forceUpdate();
    }

    

    rescaleImage(e: any) {
        const width: number = this.img.width;
        const height: number = this.img.height;

        // need to check on IE compatibility here - i think aspect ration is wrong in IE
        if (width >= height) {
            // this.img.style.width = '100%';
            // this.img.style.height = 'auto';
            // this.imgDiv.style.flexDirection = 'column';
        } else {
            // this.img.style.width = 'auto';
            // this.img.style.height = '100%';
            // this.imgDiv.style.flexDirection = 'row';
        }
    }

    clearFile() {
        this.forceUpdate();
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
            const file: File = this.fileInput.files[0];
            let dataURL: string = await this.fileReadAsDataURL(file);
            const fname: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
            const ext: string = file.name.lastIndexOf('.') >= 0 ? file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() : '';
            const typ: string = file.type;
            const size: number = file.size;

            let maxSize: number = parseInt(this.getAttribute("maxSizeKB","0"));
            if(maxSize>0 && size>(maxSize * 1000)){
                this.messageBox.showMessageBox(
                    "File Too Large",
                    (<span>The file you have chosen is { size } bytes long and exceeds the maximum file size of { maxSize }</span>),
                    [new modalDialogButton("Ok",this.messageBox.hideMessageBox)]
                );
            }
            else {

                if (this.isImage(typ)) {
                    let imgSize: number = 0;
                    if (parseInt(this.getAttribute('imageSize', '0')) > 0) {
                        imgSize = parseInt(this.getAttribute('imageSize', '0'));
                    }
                    if(imgSize > 0) {
                        dataURL = await this.ResizeBase64Img(dataURL, imgSize);
                    }
                    
                }

                let objData: any;

                if (this.model.contentType === 'ContentString') {
                    objData = dataURL;
                } else {
                    // assume object

                    objData = FlowObjectData.newInstance(this.getAttribute("fileTypeName"));
                    if(this.attributes["fileNameField"]) {
                        objData.addProperty(FlowObjectDataProperty.newInstance(this.getAttribute("fileNameField"), eContentType.ContentString, fname));
                    }
                    if(this.attributes["extensionField"]) {
                        objData.addProperty(FlowObjectDataProperty.newInstance(this.getAttribute("extensionField"), eContentType.ContentString, ext));
                    }
                    if(this.attributes["mimeTypeField"]) {
                        objData.addProperty(FlowObjectDataProperty.newInstance(this.getAttribute("mimeTypeField"), eContentType.ContentString, typ));
                    }
                    if(this.attributes["sizeField"]) {
                        objData.addProperty(FlowObjectDataProperty.newInstance(this.getAttribute("sizeField"), eContentType.ContentNumber, size));
                    }
                    if(this.attributes["dataField"]) {
                        objData.addProperty(FlowObjectDataProperty.newInstance(this.getAttribute("dataField"), eContentType.ContentString, dataURL));
                    }
 
                }

                await this.setStateValue(objData);

                if (this.getAttribute('onSelected', '').length > 0) {
                    await this.triggerOutcome(this.getAttribute('onSelected', ''));
                }

                this.forceUpdate();
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

        //if(this.loadingState !== eLoadingState.ready) {
        //    return this.lastContent;
        //}

        let classes: string = "file-picker " + this.getAttribute("classes","");
        let style: CSSProperties = {};
        style.width="-webkit-fill-available";
        style.height="-webkit-fill-available";

        if(this.model.visible === false) {
            style.display = "none";
        }
        if(this.model.width) {
            style.width=this.model.width + "px"
        }
        if(this.model.height) {
            style.height=this.model.height + "px"
        }

        let filePick: any;
        const title: string = this.getAttribute('title') || 'Select File';
        
        let clearButton: any;
        filePick = this.pickFile;
        clearButton = (<span className="glyphicon glyphicon-remove file-picker-header-button" onClick={this.clearFile}/>);
        

        let file: any;
        let mimeType: string;
        let fileContent: string;
        let fileName: string;
        let extension: string;
        let content: any;
        if(this.loadingState === eLoadingState.ready) {
        
            file = this.getStateValue() as FlowObjectData;

            if (file) {
                if (this.model.contentType === 'ContentString') {
                    mimeType = file.substring(file.indexOf(':') + 1, file.indexOf(';'));
                    fileContent = file;
                } else {
                    // assume object
                    if(this.attributes["mimeTypeField"]) {
                        mimeType = file.properties[this.getAttribute("mimeTypeField")].value;
                    }
                    if(this.attributes["dataField"]) {
                        fileContent = file.properties[this.getAttribute("dataField")].value;
                    }
                    if(this.attributes["fileNameField"]) {
                        fileName = file.properties[this.getAttribute("fileNameField")].value;
                    }
                    if(this.attributes["extensionField"]) {
                        extension = file.properties[this.getAttribute("extensionField")].value;
                    }
                }
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
                            onLoad={this.rescaleImage}
                        />
                    );
                } else {
                    content = (
                        <span
                            className="file-picker-file-name"
                        >
                            {fileName + '.' + extension}
                        </span>
                    );
                }
            }
        }

        this.lastContent = (
                <div 
                    className={classes}
                    style={style}
                >
                    <FlowMessageBox
                        ref={(element: FlowMessageBox) => {this.messageBox = element}}
                    />
                    <div className="file-picker-header">
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
                        style={style}
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

