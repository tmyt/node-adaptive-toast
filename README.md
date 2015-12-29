# Adaptive Toast

windows 10 adaptive toast xml schema wrapper.

## usage

```javascript
var AdaptiveToast = require('adaptive-toast');
var builder = new AdaptiveToast();

builder
  .addText('foo')
  .addText('bar');

console.log(builder.build());
```

## apis

### addText(value)

add text element.

### addImage(src, placement, alt, addImageQuery, hintCrop)

add image element.

### addAudio(src, loop, silent)

add audio element.

### addButton(content, arguments, activationType, imageUri, hintInputId)

add action element.

### addInput(id, title, placeHolderContent, defaultInput)

add text input element.

### addSelection(id, selections, title, defaultInput)

add selection input element.

#### note

selection requires array of object. the object needs ``id`` and ``content`` property.

### appLogoOverride(src)

wrapper function of ``addImage(src, 'appLogoOverride')``.

### build()

build xml for current content.

## properties

### applies to toast element

- launch
- duration
- activationType
- scenario

### applies to visual element

- lang
- baseUri
- addImageQuery

## links

- http://blogs.msdn.com/b/tiles_and_toasts/archive/2015/07/02/adaptive-and-interactive-toast-notifications-for-windows-10.aspx
