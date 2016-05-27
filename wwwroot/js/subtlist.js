(function () {
	// create app
	var theListApp = angular.module('subtlist', ['ngCookies']);

	// set controller
	theListApp.controller('main', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
		// private members

		var $progressBar = $('#progress-bar'),
			$html = $('html, body');

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

		function canEdit() {
			$http.post('list_crud.php', {can_edit: true}).then(function (response) {
				if (response.data === 'success') {
					$scope.edit = true;
				} else {
					$scope.edit = false;
				}
			});
		}

		function read(complete) {
			$http.post('list_crud.php', {read: true}).then(function (response) {
				if (response.data !== 'failure') {
					$scope.title = response.data.title;
					$scope.subtitle = response.data.subtitle;
				}
				complete(response);
			});
		}

		// initializes the controller
		function init() {
			var i;

			// determine if editing
			$scope.edit = false;
			//canEdit();
			read(function (response) {
				if (response.data === 'failure') {
					$scope.edit = true;
				}
			});

			$scope.list = [];
			/*for (i = 0; i < MOVIES.length; i++) {
				$scope.movies[i] = {
					name: MOVIES[i],
					done: ($cookies.get(MOVIES[i]) === 'true')
				};
			}*/

			update();
		}

		// public methods

		// adds the specified item to the list
		$scope.addItem = function () {
			// add the item to the list
			$scope.list.push({
				name: $scope.input,
				done: false
			});

			// clear item input
			$scope.input = '';

			// scroll to bottom
			$html.scrollTop($(document).height());

			// update progress
			update();
		};

		// removes an item from the list
		$scope.remove = function (index) {
			$scope.list.pop(index);
			update();
		};

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			// toggle done status
			$scope.list[index].done = !$scope.list[index].done;

			// create cookie
			$cookies.put($scope.list[index].name, $scope.list[index].done);

			// update progress
			update();
		};

		// initialization
		init();
	}]);
})();
