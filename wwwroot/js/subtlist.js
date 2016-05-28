(function () {
	// create app
	var theListApp = angular.module('subtlist', ['ngCookies']);

	// set controller
	theListApp.controller('main', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// private members

		var id,
			created = false,
			$progressBar = $('#progress-bar'),
			$html = $('html, body'),
			$doc = $(document);

		// gets the number of done movies
		function getNumDone() {
			var i, num = 0;
			for (i = 0; i < $scope.list.length; i++) {
				if ($scope.list[i].done) {
					num++;
				}
			}
			return num;
		}

		// updates statistical variables
		function update() {
			$scope.numDone = getNumDone();
			$scope.progress = (($scope.numDone / $scope.list.length) * 100) || 0;
			$progressBar.css('width', $scope.progress + '%');
		}

		function canEdit(complete) {
			$http.post('list_crud.php', {can_edit: true}).then(function (response) {
				if (response.data === 'success') {
					$scope.edit = true;
				} else {
					$scope.edit = false;
				}

				if (complete) {
					complete(response);
				}
			});
		}

		function readListItem(complete) {
			$http.post('list_item_crud.php', {read: true}).then(function (response) {
				var i;

				if (response.data !== 'failure') {
					$scope.list = [];
					for (i = 0; i < response.data.length; i++) {
						$scope.list[i] = {
							id: response.data.id,
							item: response.data.item,
							done: ($cookies.get(response.data.item + response.data.id) === 'true')
						};
					}
					update();
					$html.scrollTop($doc.height());
				}

				if (complete) {
					complete(response);
				}
			});
		}

		function create(complete) {
			$http.post('list_crud.php', {
				create: true,
				title: $scope.title,
				subtitle: $scope.subtitle
			}).then(complete);
		}

		function readList(complete) {
			$http.post('list_crud.php', {read: true}).then(function (response) {
				if (response.data !== 'failure') {
					created = true;
					readListItem(complete);
					canEdit();
					$scope.title = response.data.title;
					$scope.subtitle = response.data.subtitle;
				} else {
					$scope.edit = true;
					if (complete) {
						complete(response);
					}
				}
			});
		}

		// initializes the controller
		function init() {
			$scope.list = [];
			$scope.edit = false;
			readList();
		}

		// public methods

		// adds the specified item to the list
		$scope.addItem = function () {
			function add() {
				canEdit(function (response) {
					if (response.data !== "failure") {
						alert();
						$http.post('list_item_crud.php', {create: true, item: $scope.input}).then(function (response) {
							if (response.data !== "failure") {
								alert();
								$scope.input = '';
								readListItem();
							}
						});
					}
				});
			}
			if (!created) {
				alert();
				create(add);
			} else {
				add();
			}
		};

		// removes an item from the list
		$scope.remove = function (id) {
			canEdit(function (response) {
				if (response.data !== "failure") {
					$http.post('list_item_crud.php', {remove: true, id: id}).then(function(response) {
						if (response.data !== failure) {
							readListItem();
						}
					});
				}
			});
		};

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			// toggle done status
			$scope.list[index].done = !$scope.list[index].done;

			// create cookie
			$cookies.put($scope.list[index].name + $scope.list[index].id, $scope.list[index].done);

			// update progress
			update();
		};

		// initialization
		init();
	}]);
})();
