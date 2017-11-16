sap.ui.define(function() {
	"use strict";
 
	var Formatter = {
 
		status :  function (sStatus) {
				if (sStatus === "APPROVED") {
					return "Success";
				} else if (sStatus === "WITHDRAWN") {
					return "Warning";
				} else if (sStatus === "REJECTED"){
					return "Error";
				} else {
					return "None";
				}
		}
	};
 
	return Formatter;
 
}, /* bExport= */ true);