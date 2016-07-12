(function () {
	// create app
	angular.module('subtlist', ['ngRoute', 'ngCookies'])

	// database service
	.service('dbService', ['$http', '$q', function ($http, $q) {
		// private variables

		var listDBUrl = 'list_crud.php',
			listItemDBUrl = 'list_item_crud.php';

		// public functions

		this.canEdit = function () {
			var defer = $q.defer();
			$http.post(listDBUrl, {can_edit: true}).then(function (response) {
				defer.resolve(response.data === 'success');
			}, function () {
				defer.resolve(false);
			});
			return defer.promise;
		};

		this.createList = function (title, subtitle) {
			return $http.post(listDBUrl, {
				create: true,
				title: title,
				subtitle: subtitle
			});
		};

		this.readList = function () {
			return $http.post(listDBUrl, {read: true});
		};

		this.updateList = function (title, subtitle) {
			return $http.post(listDBUrl, {
				update: true,
				title: title,
				subtitle: subtitle
			});
		};

		this.createListItem = function (item, orderIndex) {
			return $http.post(listItemDBUrl, {
				create: true,
				item: item,
				order_index: orderIndex
			});
		};

		this.readListItems = function () {
			return $http.post(
				listItemDBUrl,
				{read: true},
				{params: {timestamp: new Date().getTime()}}
			);
		};

		this.updateListItem = function (id, item) {
			return $http.post(listItemDBUrl, {
				update: true,
				id: id,
				item: item
			});
		};

		this.deleteListItem = function (id) {
			return $http.post(listItemDBUrl, {delete: true});
		};
	}])

	// list service
	.service('listService', ['dbService', '$cookies', function (dbService, $cookies) {
		// private members

		var _title = '',
			_subtitle = '',
			_items = [],
			_done = 0;

		function fetchItems() {
			dbService.readListItems().then(function (response) {
				var i;

				if (response.data !== 'failure') {
					_items = [];
					for (i = 0; i < response.data.length; i++) {
						_items[i] = {
							id: response.data[i].id,
							name: {
								database: response.data[i].item,
								input: response.data[i].item
							},
							order_index: response.data[i].order_index,
							done: ($cookies.get(response.data[i].item + response.data[i].id) === 'true')
						};
					}
				}
			});
		}

		// getters & setters

		this.setTitle = function (title) {
			dbService.updateList(title, _subtitle).then(function (response) {
				if (response.data === 'success') {
					_title = title;
				}
			});
		};

		this.getTitle = function () {
			return _title;
		};

		this.setSubtitle = function (subtitle) {
			_subtitle = subtitle;
		};

		this.getSubtitle = function () {
			return _subtitle;
		};

		this.getItems = function () {
			return _items;
		};

		// public functions

		this.addItem = function (item) {
			dbService.createListItem(
				item, _list[_list.length - 1].order_index + 1
			).then(function (response) {
				if (response.data === 'success') {
					_items.push(item);
				}
			});
		};

		this.removeItem = function (index) {
			dbService.deleteListItem(_list[index].id).then(function (response) {
				if (response.data === 'success') {
					_items.splice(index, 1);
				}
			});
		};
	}])

	// routing configuration
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/view', {
			templateUrl: 'views/viewList.html',
			controller: 'viewListController'
		})
		.when('/edit', {
			templateUrl: 'views/editList.html',
			controller: 'editListController'
		})
		.otherwise({
			redirectTo: '/view'
		});
	}])

	// main controller
	.controller('mainController', ['$scope', function ($scope) {
		// private methods

		// initializes the main controller
		function init() {
			$scope.list = {
				title: '',
				subtitle: '',
				items: []
			};
		}

		init();
	}])

	// view controller
	.controller('viewListController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// private members

		// initializes the view controller
		function init() {
			$scope.view = {
				numDone: 0
			};
		}

		// public methods

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			var expires = new Date();

			// toggle done status
			$scope.list.items[index].done = !$scope.list.items[index].done;

			// create cookie
			expires.setFullYear(expires.getFullYear() + 5);
			$cookies.put(
				$scope.list.items[index].name.database + $scope.list.items[index].id,
				$scope.list.items[index].done,
				{expires: expires}
			);
		};

		init();
	}])

	// edit controller
	.controller('editListController', ['$scope', '$location', 'dbService', function ($scope, $location, dbService) {
		// private methods

		// initializes the edit controller
		function init() {
			// check if editable
			if (!dbService.canEdit()) {
				$location.path('/view');
			}

			$scope.edit = {
				input: ''
			};
		}

		// public methods

		// create new list item
		$scope.create = function () {

		};

		// update list item
		$scope.update = function () {

		};

		// delete list item
		$scope.delete = function () {

		};

		init();
	}]);
})();
/*
(function () {
	// create app
	var theListApp = angular.module('subtlist', ['ngRoute', 'ngCookies']);

	// set controller
	theListApp.controller('main', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// private members

		// gets the number of done movies
		function getNumDone() {
			var i, num = 0;
			for (i = 0; i < $scope.list.items.length; i++) {
				if ($scope.list.items[i].done) {
					num++;
				}
			}
			return num;
		}

		// updates statistical variables
		function update() {
			$scope.list.numDone = getNumDone();
		}

		function canEdit(complete) {
			$http.post('list_crud.php', {can_edit: true}).then(function (response) {
				if (response.data === 'success') {
					$scope.list.edit = true;
					$scope.list.mode = 'edit';
				} else {
					$scope.list.edit = false;
				}

				if (complete) {
					complete(response);
				}
			});
		}

		function readListItem(complete) {
			$http.post('list_item_crud.php', {read: true}, {params: {timestamp: new Date().getTime()}}).then(function (response) {
				var i;

				if (response.data !== 'failure') {
					$scope.list.items = [];
					for (i = 0; i < response.data.length; i++) {
						$scope.list.items[i] = {
							id: response.data[i].id,
							name: {
								database: response.data[i].item,
								input: response.data[i].item
							},
							order_index: response.data[i].order_index,
							done: ($cookies.get(response.data[i].item + response.data[i].id) === 'true')
						};
					}
					update();
					$('html, body').scrollTop($(document).height());
				}

				if (complete) {
					complete(response);
				}
			});
		}

		function create(complete) {
			$http.post('list_crud.php', {
				create: true,
				title: $scope.list.title,
				subtitle: $scope.list.subtitle
			}).then(complete);
		}

		function readList(complete) {
			$http.post('list_crud.php', {read: true}).then(function (response) {
				if (response.data !== 'failure') {
					$scope.list.created = true;
					readListItem(complete);
					canEdit();
					$scope.list.title = response.data.title;
					$scope.list.subtitle = response.data.subtitle;
				} else {
					$scope.list.edit = true;
					if (complete) {
						complete(response);
					}
				}
			});
		}

		// initializes the controller
		function init() {
			$scope.list = {
				title: '',
				subtitle: '',
				items: [],
				numDone: 0,
				edit: false,
				mode: 'view',
				created: false,
				input: ''
			};
			readList();
		}

		// public methods

		// adds the specified item to the list
		$scope.addItem = function () {
			function add(response) {
				canEdit(function (response) {
					if (response.data === 'success') {
						$http.post('list_item_crud.php', {
							create: true,
							item: $scope.list.input,
							order_index: Number($scope.list.items[$scope.list.items.length - 1].order_index) + 1
						}).then(function (response) {
							if (response.data === 'success') {
								$scope.list.input = '';
								readListItem();
							}
						});
					}
				});
			}
			if (!$scope.list.created) {
				create(add);
			} else {
				add();
			}
		};

		// updates the changed item
		$scope.updateItem = function (id, item) {
			canEdit(function (response) {
				if (response.data === 'success') {
					$http.post('list_item_crud.php', {update: true, id: id, item: item}).then(function (response) {
						if (response.data === 'success') {
							readListItem();
						}
					});
				}
			});
		};

		// removes an item from the list
		$scope.delete = function (id) {
			canEdit(function (response) {
				if (response.data === 'success') {
					$http.post('list_item_crud.php', {delete: true, id: id}).then(function(response) {
						if (response.data === 'success') {
							readListItem();
						}
					});
				}
			});
		};

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			var expires = new Date();

			// toggle done status
			$scope.list.items[index].done = !$scope.list.items[index].done;

			// create cookie
			expires.setFullYear(expires.getFullYear() + 5);
			$cookies.put(
				$scope.list.items[index].name.database + $scope.list.items[index].id,
				$scope.list.items[index].done,
				{expires: expires}
			);

			// update progress
			update();
		};

		// initialization
		init();
	}]);
})();*/
