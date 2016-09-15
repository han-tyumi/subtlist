(function () {
	// create app
	angular.module('subtlist', ['ngRoute', 'ngCookies', 'dndLists'])

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

		// returns whether the list is new
		this.isNew = function () {
			var defer = $q.defer();
			$http.post(dbUrl, {isNew: true}).then(function (response) {
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

		// reads all the list itmes associated with the current list
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

		// updates the order_index of a list item
		this.updateListItemOrder = function (id, order_index) {
			var defer = $q.defer();
			$http.post(dbUrl, {
				updateItemOrder: true,
				id: id,
				order_index: order_index
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
			_isNew = {value: false},
			_canEdit = {value: false};

		// sets whether the user can edit the list
		function fetchPermissions() {
			var defer = $q.defer(),
				canEditDone = false,
				isNewDone = false;

			function resolve() {
				if (canEditDone && isNewDone) {
					defer.resolve();
				}
			}

			dbService.canEdit().then(function (data) {
				_canEdit.value = data;
				canEditDone = true;
				resolve();
			});

			dbService.isNew().then(function (data) {
				_isNew.value = data;
				isNewDone = true;
				resolve();
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
			if (_isNew.value) {
				return;
			}
			dbService.updateList(title, _subtitle.database).then(function () {
				_title.database = title;
			});
		};

		this.getTitle = function () {
			return _title;
		};

		this.setSubtitle = function (subtitle) {
			if (_isNew.value) {
				return;
			}
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
				listDone = false,
				itemsDone = false;

			// checks if subtlist is initialized
			function resolve() {
				if (listDone && itemsDone) {
					defer.resolve();
				}
			}

			fetchPermissions().then(function () {
				if (_isNew.value) {
					_title = {
						database: '',
						input: ''
					};
					_subtitle = {
						database: '',
						input: ''
					};
					_items = [];
					defer.resolve();
				} else {
					fetchSubtlist().then(function () {
						listDone = true;
						resolve();
					});
					fetchItems().then(function () {
						itemsDone = true;
						resolve();
					});
				}
			});

			return defer.promise;
		};

		// returns whether or not the list can be edited
		this.canEdit = function () {
			return _canEdit;
		};

		// returns whether the list is new
		this.isNew = function () {
			return _isNew;
		};

		// adds a new item to the list
		this.addItem = function (item) {
			var defer = $q.defer();

			function addItem() {
				var order_index = 1;
				if (_items.length > 0) {
					order_index = +_items[_items.length - 1].order_index + 1;
				}
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
			}

			if (_isNew.value) {
				dbService.createList(
					_title.input, _subtitle.input
				).then(function () {
					_title.database = _title.input;
					_subtitle.database = _subtitle.input;
					_isNew.value = false;
					addItem();
				});
			} else {
				addItem();
			}

			return defer.promise;
		};

		// updates an item in the list
		this.updateItem = function (index, item) {
			dbService.updateListItem(_items[index].id, item).then(function () {
				_items[index].name.database = item;
			});
		};

		// updates an item's order in the list
		this.updateItemOrder = function (indexFrom, indexTo) {
			var i, indexEnd;

			if (indexFrom > indexTo) {
				i = indexTo;
				indexEnd = indexFrom;
			} else {
				i = indexFrom;
				indexEnd = indexTo;
			}

			for (i; i <= indexEnd; i++) {
				_items[i].order_index = i;
				dbService.updateListItemOrder(_items[i].id, i);
			}
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
	.controller('mainController', ['$scope', '$location', 'listService', function ($scope, $location, listService) {
		// private methods

		// initializes the main controller
		(function init() {
			// initialize list service
			listService.init().then(function () {
				// initialize common variables
				$scope.list = {
					title: listService.getTitle(),
					subtitle: listService.getSubtitle(),
					items: listService.getItems(),
					canEdit: listService.canEdit(),
					isNew: listService.isNew(),
					numDone: 0
				};

				var i;
				for (i = 0; i < $scope.list.items.length; i++) {
					if ($scope.list.items[i].done) {
						$scope.list.numDone++;
					}
				}

				if ($scope.list.isNew.value) {
					$location.path('/edit');
				}
			});
		})();
	}])

	// view controller
	.controller('viewListController', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// public methods

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			var expires = new Date();

			// toggle done status
			$scope.list.items[index].done = !$scope.list.items[index].done;
			if ($scope.list.items[index].done) {
				$scope.list.numDone++;
			} else {
				$scope.list.numDone--;
			}

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
	.controller('editListController', ['$scope', 'listService', function ($scope, listService) {
		// private methods

		// initializes the edit controller
		(function init() {
			$scope.edit = {
				input: '',
				indexTo: 0
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

		$scope.dropCallback = function (index, item) {
			$scope.edit.indexTo = index;
			return item;
		};

		// update list item order index
		$scope.updateItemOrder = function (indexFrom, indexTo) {
			if (indexFrom > indexTo) {
				indexFrom--;
			} else {
				indexTo--;
			}
			listService.updateItemOrder(indexFrom, indexTo);
		};

		// delete list item
		$scope.deleteItem = function (index) {
			listService.deleteItem(index);
		};
	}]);
})();
