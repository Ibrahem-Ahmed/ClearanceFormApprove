sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/resource/ResourceModel"
], function(JSONModel, Device, ODataModel, ResourceModel) {
	"use strict";

	function extendMetadataUrlParameters (aUrlParametersToAdd, oMetadataUrlParams, sServiceUrl) {
		var oExtensionObject = {},
			oServiceUri = new URI(sServiceUrl);

		aUrlParametersToAdd.forEach(function (sUrlParam) {
			var sLanguage,
				oUrlParameters,
				sParameterValue;

			// for sap-language we check if the launchpad can provide it.
			if (sUrlParam === "sap-language") {
				sLanguage = sap.ushell.Container.getUser().getLanguage();

				if (sLanguage) {
					oMetadataUrlParams["sap-language"] = sLanguage;
					return;
				}
				// Continue searching in the url
			}

			oUrlParameters = jQuery.sap.getUriParameters();
			sParameterValue = oUrlParameters.get(sUrlParam);
			if (sParameterValue) {
				oMetadataUrlParams[sUrlParam] = sParameterValue;
				oServiceUri.addSearch(sUrlParam, sParameterValue);
			}
		});

		jQuery.extend(oMetadataUrlParams, oExtensionObject);
		return oServiceUri.toString();
	}
	
	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createResourceModel : function (sBundleName) {
			var oResourceModel = new ResourceModel({
				"bundleName" : sBundleName
			});
			return oResourceModel;
		},
	
		createODataModel: function (oOptions) {
			var aUrlParametersForEveryRequest,
				oConfig,
				sUrl;

			oOptions = oOptions || {};

			if (!oOptions.url) {
				jQuery.sap.log.error("Please provide a url when you want to create an ODataModel", "ClearanceForm.model.models.createODataModel");
				return null;
			}

			// create a copied instance since we modify the config
			oConfig = jQuery.extend(true, {}, oOptions.config);

			aUrlParametersForEveryRequest = oOptions.urlParametersForEveryRequest || [];
			oConfig.metadataUrlParams = oConfig.metadataUrlParams || {};

			sUrl = extendMetadataUrlParameters(aUrlParametersForEveryRequest, oConfig.metadataUrlParams, oOptions.url);

			return this._createODataModel(sUrl, oConfig);
		},

		_createODataModel: function (sUrl, oConfig) {
			return new ODataModel(sUrl, oConfig);
		}
	};
});