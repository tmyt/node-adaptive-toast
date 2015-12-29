var XML_CHAR_MAP = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;'
};

function escapeXml(s){
  s = s.replace(/[<>&"']/g, function (ch) {
    return XML_CHAR_MAP[ch];
  });
  if(s[s.length-1] === ' '){s=s.slice(0,-1);s+='&#x00A0;';}
  return s;
}

function xmlAttr(key, value){
  return key + '="' + escapeXml(value) + '" ';
}

function AdaptiveToast(){
  // props
  this.launch = undefined;
  this.duration = undefined; // default: short
  this.activationType = undefined; // default: foreground
  this.scenario = undefined; // default: default
  this.lang = undefined; // default: none
  this.baseUri = undefined; // default: none
  this.addImageQuery = undefined; // default: none
  // elements
  this.bindings = [];
  this.actions = [];
  this.audio = undefined;
}

AdaptiveToast.prototype.addBinding = function(type, args){
  this.bindings.push({type: type, args: args});
}

AdaptiveToast.prototype.addAction = function(type, args){
  this.actions.push({type: type, args: args});
}

AdaptiveToast.prototype.addText = function(content){
  this.addBinding('text', {value: content});
  return this;
}

AdaptiveToast.prototype.addImage = function(src, placement, alt, addImageQuery, hintCrop){
  this.addBinding('image', {src: src, placement: placement, alt: alt, addImageQuery: addImageQuery, 'hint-crop': hintCrop});
  return this;
}

AdaptiveToast.prototype.addAudio = function(src, loop, silent){
  this.audio = {src: src, loop: loop, silent: silent};
  return this;
}

AdaptiveToast.prototype.addButton = function(content, arguments, activationType, imageUri, hintInputId){
  this.addAction('action', {content: content, arguments: arguments, activationType: activationType, imageUri: imageUri, 'hint-inputId': hintInputId});
  return this;
}

AdaptiveToast.prototype.addInput = function(id, title, placeHolderContent, defaultInput){
  this.addAction('input', {id: id, type: 'text', title: title, placeHolderContent: placeHolderContent, defaultInput: defaultInput});
  return this;
}

AdaptiveToast.prototype.addSelection = function(id, selections, title, defaultInput){
  this.addActioin('input', {id: id, type: 'selections', selections: selections, title: title, defaultInput: defaultInput});
  return this;
}

AdaptiveToast.prototype.appLogoOverride = function(src){
  return this.addImage(src, 'appLogoOverride');
}

AdaptiveToast.prototype.buildChildren = function(node){
  var xml = '';
  for(var i = 0; i < this[node].length; ++i){
    var content = this[node][i].args.value;
    var selections = this[node][i].args.selections;
    var keys = Object.keys(this[node][i].args);
    xml += '<' + this[node][i].type + ' ';
    for(var j = 0; j < keys.length; ++j){
      if(keys[j] === 'value') continue;
      if(keys[j] === 'selections') continue;
      if(this[node][i].args[keys[j]]) xml += xmlAttr(keys[j], this[node][i].args[keys[j]]);
    }
    if(!content && !selections) { xml += '/>'; continue; }
    xml += '>';
    if(content) xml += escapeXml(content);
    if(selections){
      for(var i = 0; i < selections.length; ++i){
        xml += '<selection ';
        xml += xmlAttr('id', selections[i].id);
        xml += xmlAttr('content', selections[i].content);
        xml += '/>';
      }
    }
    xml += '</' + this[node][i].type + '>';
  }
  return xml;
}

AdaptiveToast.prototype.build = function(){
  var xml = '';
  // toast element
  xml += '<toast ';
  if(this.launch) xml += xmlAttr('launch', this.launch);
  if(this.duration) xml += xmlAttr('duration', this.duration);
  if(this.activationType) xml += xmlAttr('activationType', this.activationType);
  if(this.scenario) xml += xmlAttr('scenario', this.scenario);
  xml += '>';
  // visual element
  xml += '<visual ';
  if(this.lang) xml += xmlAttr('lang', this.lang);
  if(this.baseUri) xml += xmlAttr('baseUri', this.baseUri);
  if(this.addImageQuery) xml += xmlAttr('addImageQuery', this.addImageQuery);
  xml += '>';
  // bindings element
  xml += '<binding ';
  xml += 'template="ToastGeneric" ';
  if(this.lang) xml += xmlAttr('lang', this.lang);
  if(this.baseUri) xml += xmlAttr('baseUri', this.baseUri);
  if(this.addImageQuery) xml += xmlAttr('addImageQuery', this.addImageQuery);
  xml += '>';
  // bindings children
  xml += this.buildChildren('bindings');
  // close bindings
  xml += '</binding>';
  // close visual
  xml += '</visual>';
  // audio element
  if(this.audio){
    xml += '<audio ';
    if(this.audio.src) xml += xmlAttr('src', this.audio.src);
    if(this.audio.loop) xml += xmlAttr('loop', this.audio.loop);
    if(this.audio.silent) xml += xmlAttr('silent', this.audio.silent);
    xml += '/>';
  }
  // actions element
  xml += '<actions>';
  // actions children
  xml += this.buildChildren('actions');
  // close action
  xml += '</actions>';
  // close toast
  xml += '</toast>';
  return xml;
}

module.exports = AdaptiveToast;
