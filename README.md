

# FilePicker

![alt text](https://github.com/MarkWattsBoomi/FilePicker/blob/master/standard.png)
Standard

![alt text](https://github.com/MarkWattsBoomi/FilePicker/blob/master/transparent.png)
Transparent (transparent attribute set)

## Functionality

Allows the user to select a local file of any type and sets that file's details and content into the component's state value.

Provides configuration via attributes to attach the various selected file attributes to attributes of the underlying state object.


## Component Settings

### Width & Height

Width and height if specified control the component's dimensions - in pixels.


### Label

This will be used as the title bar of the Modal Dialog if the "title" attribute is not defined.



### State

Either a simple string value to receive the selected file's dataURI or a complex object where the file's attributes are mapped to object
properies via attribute.  See the Attributes section below.



## Component Attributes


### classes
Optional.

String.

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value


### imageSize

Optional.

Number.

If specified, any selected file of an image type will be scaled up or down to the specified width.

Defaults to no modification.


### maxSizeKB

Optional.

Number.

Limits the size of the file allowed to be selected in KB.

If the file is bigger then a modal popup warning is shown and the selection is prevented.


### title

Optional.

String.

The text to display in the dialog's title bar.


### dataField

Optional.

String.

If the state is an object then this attribute should contain the state object's attribute name to receive the File's dataUri value.

### sizeField

Optional.

String.

If the state is an object then this attribute should contain the state object's attribute name to receive the File's size.

### fileNameField

Optional.

String.

If the state is an object then this attribute should contain the state object's attribute name to receive the File's name.

### mimeTypeField

Optional.

String.

If the state is an object then this attribute should contain the state object's attribute name to receive the File's mime type.

### extensionField

Optional.

String.

If the state is an object then this attribute should contain the state object's attribute name to receive the File's extension.

### transparent

Optional.

Boolean.

If specified then the component will be drawn with no title bar or border as shown in the examples above.

Useful if being used with a ModalContainer.

### onSelected

Optional.

String.

The name of an outcome to trigger after successful selection of a file.

### mode

Set to "default", "basic" or "icon" to control the display style.

### icon

The name of a glyphicn to display for the button.