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

function Tab() {
	var self = this;
	UEvent.call(this);
	
	self.init = function(tabNode) {
		self.tabNode = tabNode;
		self.tabContentDiv = document.getElementById(getTabContentId());
		
		function getTabContentId() {
			return self.tabNode.firstChild.getAttribute('for');
		}
		
		self.on('beforeHidden', function () {
			console.log('i will going..');
		});
		self.on('afterHidden', function () {
			console.log('gone');
		});
	};
	
	self.active = function() {
		self.tabNode.setAttribute('class', 'active');
		self.tabContentDiv.style['display'] = 'block';
	};
	
	self.disActive = function() {
		self.tabNode.removeAttribute('class');
		self.tabContentDiv.style['display'] = 'none';		
	};
	
}
Tab.prototype = Object.create(UEvent.prototype);

function TabSet() {
	var self = this;
	UEvent.call(self);

	self.init = function (id) {
		var tabsNodes = document.getElementById(id).getElementsByTagName('li');
		self.tabs = [];
		
		eachHTMLCollection(tabsNodes, function (tabNode) {
			var tab = new Tab();
			tab.init(tabNode);
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
	};
}
TabSet.prototype = Object.create(UEvent.prototype);

function eachHTMLCollection(tags, func) {
	for (var i = 0; i < tags.length; i++) {
		func(tags.item(i));
	}
}

(new TabSet()).init('tabs');