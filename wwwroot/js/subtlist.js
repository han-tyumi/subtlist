(function () {
	// create app
	angular.module('subtlist', ['ngRoute', 'ngCookies'])

	// database service
	.service('dbService', ['$http', '$q', function ($http, $q) {
		// private variables

		// database crud URLs
		var dbUrl = 'subtlist_crud.php';

		// public functions

		// returns whether the user has permission to edit the list
		this.canEdit = function () {
			var defer = $q.defer();
			$http.post(dbUrl, {canEdit: true}).then(function (response) {
				defer.resolve(response.data === 'success');
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// creates a new list in the list database
		this.createList = function (title, subtitle) {
			var defer = $q.defer();
			$http.post(dbUrl, {
				createList: true,
				title: title,
				subtitle: subtitle
			}).then(function (response) {
				if (response.data === 'success') {
					defer.resolve();
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// reads in the list associated with the url id from the database
		this.readList = function () {
			var defer = $q.defer();
			$http.post(dbUrl, {readList: true}).then(function (response) {
				if (response.data !== 'failure') {
					defer.resolve(response.data);
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// updates the associated list in the database
		this.updateList = function (title, subtitle) {
			var defer = $q.defer();
			$http.post(dbUrl, {
				updateList: true,
				title: title,
				subtitle: subtitle
			}).then(function (response) {
				if (response.data === 'success') {
					defer.resolve();
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// adds a new list item to the list item database
		this.createListItem = function (item, orderIndex) {
			var defer = $q.defer();
			$http.post(dbUrl, {
				createItem: true,
				item: item,
				order_index: orderIndex
			}).then(function (response) {
				if (response.data !== 'failure') {
					defer.resolve(response.data);
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// rreads all the list itmes associated with the current list
		this.readListItems = function () {
			var defer = $q.defer();
			$http.post(
				dbUrl,
				{readItem: true},
				{params: {timestamp: new Date().getTime()}}
			).then(function (response) {
				if (response.data !== 'failure') {
					defer.resolve(response.data);
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// updates a single list item in the database
		this.updateListItem = function (id, item) {
			var defer = $q.defer();
			$http.post(dbUrl, {
				updateItem: true,
				id: id,
				item: item
			}).then(function (response) {
				if (response.data === 'success') {
					defer.resolve();
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};

		// deletes a single list item from the database
		this.deleteListItem = function (id) {
			var defer = $q.defer();
			$http.post(dbUrl, {deleteItem: true}).then(function (response) {
				if (response.data === 'success') {
					defer.resolve();
				} else {
					defer.reject(response);
				}
			}, function (response) {
				defer.reject(response);
			});
			return defer.promise;
		};
	}])

	// list service
	.service('listService', ['dbService', '$q', '$cookies', function (dbService, $q, $cookies) {
		// private members

		// list variables
		var _title = {
				database: '',
				input: ''
			},
			_subtitle = {
				database: '',
				input: ''
			},
			_items = [],
			_canEdit = false,
			_done = 0;

		// sets whether the user can edit the list
		function fetchPermission() {
			var defer = $q.defer();
			dbService.canEdit().then(function (data) {
				_canEdit = data;
				defer.resolve();
			});
			return defer.promise;
		}

		// fetches the associated list items from the database
		function fetchItems() {
			var defer = $q.defer();
			dbService.readListItems().then(function (data) {
				var i;

				_items = [];
				for (i = 0; i < data.length; i++) {
					_items[i] = {
						id: data[i].id,
						name: {
							database: data[i].item,
							input: data[i].item
						},
						order_index: data[i].order_index,
						done: ($cookies.get(data[i].item + data[i].id) === 'true')
					};
				}
				defer.resolve();
			});
			return defer.promise;
		}

		// fetches both the list information from the database
		function fetchSubtlist() {
			var defer = $q.defer();
			dbService.readList().then(function (data) {
				_title = {
					database: data.title,
					input: data.title
				};
				_subtitle = {
					database: data.subtitle,
					input: data.subtitle
				};
				defer.resolve();
			});
			return defer.promise;
		}

		// getters & setters

		this.setTitle = function (title) {
			dbService.updateList(title, _subtitle.databse).then(function () {
				_title.database = title;
			});
		};

		this.getTitle = function () {
			return _title;
		};

		this.setSubtitle = function (subtitle) {
			dbService.updateList(_title.database, subtitle).then(function () {
				_subtitle.database = subtitle;
			});
		};

		this.getSubtitle = function () {
			return _subtitle;
		};

		this.getItems = function () {
			return _items;
		};

		// public functions

		// initializes the subtlist
		this.init = function () {
			var defer = $q.defer(),
				listReady = false,
				itemsReady = false,
				editReady = false;

			// checks if subtlist is initialized
			function resolve() {
				if (editReady && listReady && itemsReady) {
					defer.resolve();
				}
			}

			fetchPermission().then(function () {
				editReady = true;
				resolve();
			});
			fetchSubtlist().then(function () {
				listReady = true;
				resolve();
			});
			fetchItems().then(function () {
				itemsReady = true;
				resolve();
			});

			return defer.promise;
		};

		// returns whether or not the list can be edited
		this.canEdit = function () {
			return _canEdit;
		};

		// adds a new item to the list
		this.addItem = function (item) {
			var defer = $q.defer();
			var order_index = +_items[_items.length - 1].order_index + 1;
			dbService.createListItem(
				item, order_index
			).then(function (data) {
				_items.push({
					id: data.id,
					name: {
						database: item,
						input: item
					},
					order_index: order_index,
					done: false
				});
				defer.resolve();
			});
			return defer.promise;
		};

		// updates an item in the list
		this.updateItem = function (index, item) {
			dbService.updateListItem(_items[index].id, item).then(function () {
				_items[index].name.database = item;
			});
		};

		// removes an item from the list
		this.deleteItem = function (index) {
			dbService.deleteListItem(_items[index].id).then(function () {
				_items.splice(index, 1);
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
	.controller('mainController', ['$scope', 'listService', function ($scope, listService) {
		// private methods

		// initializes the main controller
		(function init() {
			// initialize list service
			listService.init().then(function () {
				// initialize common variables
				$scope.list = {
					title: listService.getTitle(),
					subtitle: listService.getSubtitle(),
					items: listService.getItems()
				};
			});
		})();
	}])

	// view controller
	.controller('viewListController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// private members

		// initializes the view controller
		(function init() {
			$scope.view = {
				numDone: 0
			};
		})();

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
	}])

	// edit controller
	.controller('editListController', ['$scope', '$location', 'listService', function ($scope, $location, listService) {
		// private methods

		// initializes the edit controller
		(function init() {
			// check if editable
			if (!listService.canEdit()) {
				$location.path('/view');
			}

			$scope.edit = {
				input: ''
			};
		})();

		// public methods

		// update list title
		$scope.updateTitle = function (title) {
			listService.setTitle(title);
		};

		// update list subtitle
		$scope.updateSubtitle = function (subtitle) {
			listService.setSubtitle(subtitle);
		};

		// create new list item
		$scope.addItem = function (item) {
			listService.addItem(item).then(function () {
				$scope.edit.input = '';
			});
		};

		// update list item
		$scope.updateItem = function (index, item) {
			listService.updateItem(index, item);
		};

		// delete list item
		$scope.deleteItem = function (index) {
			listService.deleteItem(index);
		};
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
