sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ClearanceFormApprove/model/models",
	"ClearanceFormApprove/formatter/Formatter"
], function(UIComponent, Device, models,Formatter) {
	"use strict";

	return UIComponent.extend("ClearanceFormApprove.Component", {
		formatter: Formatter,

		metadata: {
			
				"version": "1.0.0",
				"rootView": {
					"viewName": "ClearanceFormApprove.view.SplitApp",
					"type": "XML",
					"id": "app"
				},
				"dependencies": {
					"libs": ["sap.ui.core", "sap.m", "sap.ushell"]
				},
				"config" : {
					"i18nBundle": "ClearanceFormApprove.i18n.i18n",
					"serviceUrl": "/sap/opu/odata/sap/ZHR_CLEARACE_REQUEST_SRV",
					"icon": "",
					"favIcon": "",
					"phone": "",
					"phone@2": "",
					"tablet": "",
					"tablet@2": ""
				},
				
		"routing": {
			"config": {
				"routerClass": "sap.m.routing.Router",
				"viewPath": "ClearanceFormApprove.view",
				"viewType": "XML"
			},
			"routes": [
				{
					"pattern": "",
					"name": "SplitApp",
					"view": "SplitApp",
					"controlAggregation": "pages",
					"subroutes": [
						{
							"pattern": "",
							"name": "Master",
							"view": "Master",
							"controlId": "SplitApp",
							"targetAggregation": "masterPages",
							"subroutes": [
								{
									"pattern": "Details/{ClNum}-{ItemCode}",
									"name": "Details",
									"view": "Details",
									"targetAggregation": "detailPages"
								}
						]}
				]}
			]}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			var mConfig = this.getMetadata().getConfig();
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			
			// create and set the ODataModel
			var oModel = models.createODataModel({
				urlParametersForEveryRequest: [
					"sap-server",
					"sap-client",
					"sap-language"
				],
				url : this.getMetadata().getConfig().serviceUrl,
				config: {
					metadataUrlParams: {
						"sap-documentation": "heading"
					}
				}
			});

			this.setModel(oModel,"ClearanceRequestModel");
			this._createMetadataPromise(oModel);

			// set the i18n model
			this.setModel(models.createResourceModel(mConfig.i18nBundle), "i18n");
			
			this.getRouter().initialize();
		},
		
		_createMetadataPromise : function(oModel) {
			this.oWhenMetadataIsLoaded = new Promise(function (fnResolve, fnReject) {
				oModel.attachEventOnce("metadataLoaded", fnResolve);
				oModel.attachEventOnce("metadataFailed", fnReject);
			});
		}
	});
});