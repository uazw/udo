function UEvent() {
	this.handlers = {};
}
UEvent.prototype = {
	trigger: function (name) {
		this.handlers[name]();
	},
	on: function (name, callback) {
		this.handlers[name] = callback;
	}
};

var Tab = (function () {
	function Tab(tabNode) {
		var self = this;
		init();
		
		self.on('beforeHidden', function () {
			console.log('i will going..');
		});
		self.on('afterHidden', function () {
			console.log('gone');
		});
	
		self.active = function() {
			self.tabNode.setAttribute('class', 'active');
			self.tabContentDiv.style['display'] = 'block';
		};
		
		self.disActive = function() {
			self.tabNode.removeAttribute('class');
			self.tabContentDiv.style['display'] = 'none';		
		};
		
		function getTabContentId() {
			return self.tabNode.firstChild.getAttribute('for');
		}
		
		function init() {
			UEvent.call(self);
			self.tabNode = tabNode;
			self.tabContentDiv = document.getElementById(getTabContentId());
		}
	}
	Tab.prototype = Object.create(UEvent.prototype);
	return Tab;
})();

var TabSet = (function () {
	var self = this;
	function TabSet(id) {
		var tabsNodes = document.getElementById(id).getElementsByTagName('li');
		self.tabs = [];
		
		eachHTMLCollection(tabsNodes, function (tabNode) {
			var tab = new Tab(tabNode);
			self.tabs.push(tab);
			
			tabNode.addEventListener('click', function () {
				_tabChange(tab);
			});
		});
		self.currentTab = self.tabs[0];
		
		function _tabChange(tab) {
			self.currentTab.trigger('beforeHidden');
			self.currentTab.disActive();
			self.currentTab.trigger('afterHidden');
			tab.active();
			self.currentTab = tab;
		}
	}
	
	TabSet.prototype = Object.create(UEvent.prototype);	
	return TabSet;
})();

function eachHTMLCollection(tags, func) {
	for (var i = 0; i < tags.length; i++) {
		func(tags.item(i));
	}
}

new TabSet('tabs');