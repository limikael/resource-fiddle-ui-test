var AppView = require("../src/view/AppView");

window.onload = function() {
	var appView = new AppView();
	document.body.appendChild(appView);

/*	appView.getResourcePaneView().createTab("Hello1");
	appView.getResourcePaneView().createTab("Hello2");*/
}