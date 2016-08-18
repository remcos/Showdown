/*jslint white: true, nomen: true, plusplus: true */
/*global mx, mxui, mendix, dojo, require, console, define, module, document*/

define([
	"dojo/_base/declare",
	"mxui/widget/_WidgetBase",

	"mxui/dom",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"Showdown/lib/showdown"

], function(declare, _WidgetBase, dom, domStyle, domAttr, domConstruct, lang, showdown) {
	"use strict";
	
	return declare("Showdown.widget.Showdown", [_WidgetBase], {
        // Parameters configured in the Modeler.
		name: "",
		
		// internal variables
		contextGUID : null,
		element : null,
		attrHandle: null,
		
        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
		postCreate: function() {
			this.element = domConstruct.create("div");
			this.domNode.appendChild(this.element);
		},
		
		convertToHTML: function(stringValue){
			var converter = new showdown.Converter(),
			htmlToDisplay = converter.makeHtml(stringValue);
			domAttr.set(this.element, "innerHTML", htmlToDisplay);
		},
		
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
		update: function(obj, callback) {
			logger.debug(this.id + ".update");
			this.contextGUID = obj.getGuid();
			
			this._resetSubscriptions();
			this.convertToHTML(obj.get(this.name));
			
			callback();
		},
		
		_unsubscribe: function () {
			if (this.attrHandle) {
				mx.data.unsubscribe(this.attrHandle);
			}
		},

		_resetSubscriptions : function () {
			if (this.contextGUID) {
				this._unsubscribe();
				this.attrHandle = this.subscribe({
					guid : this.contextGUID,
					attr : this.name,
					callback : lang.hitch(this, function (guid, attr, attrValue) {
						this.convertToHTML(attrValue);
					})
				});
			}
		},

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.

        }

	});
});
