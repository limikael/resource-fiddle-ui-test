var AppView = require("../src/view/AppView");
var xnodec = require("xnodecollection");

window.onload = function() {
	var appView = new AppView();
	document.body.appendChild(appView);

	var c = new xnodec.Collection();
	appView.getResourcePaneView().setTabsCollection(c);


	c.addItem({
		id: "hello",
		label: "hello"
	});

	c.addItem({
		id: "hello2",
		label: "hello2"
	});

	c.addItem({
		id: "hello3",
		label: "hello4"
	});
}