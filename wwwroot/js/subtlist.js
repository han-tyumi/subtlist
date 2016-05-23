(function () {
	// create app
	var theListApp = angular.module('subtlist', ['ngCookies']);

	// set controller
	theListApp.controller('main', ['$scope', '$cookies', function ($scope, $cookies) {
		// private members

		// constants

		// movie names
		var MOVIES = [
			'The Iron Giant',
			'The Brave Little Toaster',
			'In Bruges',
			'Prisoners',
			'Nightcrawler',
			'The Shawshank Redemption',
			'Catch Me If You Can',
			'Inception',
			'Looper',
			'Toy Story',
			'Toy Story 2',
			'Toy Story 3',
			'Lost in Translation',
			'Frank',
			'The Hunter',
			'Forest Gump',
			"Shindler's List",
			'Pulp Fiction',
			'Kill Bill: Vol. 1',
			'Kill Bill: Vol. 2',
			'The Silence of the Lambs',
			'The Usual Suspects',
			'Léon: The Professional',
			'The Departed',
			'Whiplash',
			'Apocalypse Now',
			'The Prestige',
			'Django Unchained',
			'The Shining',
			'WALL·E',
			'Eating Raoul',
			'Das Boot',
			'Resevoir Dogs',
			'A Clockwork Orange',
			'Amadeus',
			'Monty Python and the Holy Grail',
			'Indiana Jones and the Last Crusade',
			'Raiders of the Lost Ark',
			'Scarface',
			'Up',
			'The Wolf of Wall Street',
			'The Big Lebowski',
			'Fargo',
			'Finding Nemo',
			'Hotel Rwanda',
			'Being John Malkovich',
			'Mad Max: Fury Road',
			'Stand By Me',
			'Shutter Island',
			'The Grand Budapest Hotel',
			'Moonrise Kingdom',
			'Monsters, Inc.',
			'Groundhog Day',
			'Ghostbusters',
			'Jaws',
			'Ip Man',
			'The Matrix',
			'The Girl with the Dragon Tattoo',
			'Napoleon Dynamite',
			'Pineapple Express',
			'Harold & Kumar Go to White Castle',
			'Natural Born Killers',
			'Mission to Mars',
			'*batteries not included',
			'Short Circuit',
			'E.T. The Extra-Terrestrial',
			'The Goonies',
			'Flight of the Navigator',
			'Escape to Witch Mountain',
			"Harry Potter and the Sorcerer's Stone",
			'Close Encounters of the Third Kind',
			'Zodiac',
			'October Sky',
			'Big Fish',
			'American Pyscho',
			'Out of the Furnace',
			'The Machinist',
			'Equilibrium',
			'The Fighter',
			'From Dusk Till Dawn',
			'Jackie Brown',
			'Thelma & Louise',
			'Tuck Everlasting',
			'The Wizard of Oz',
			'Drive',
			'Time Bandits',
			'Little Nicky',
			'Happy Gilmore',
			'Big Daddy',
			"What's Eating Gilbert Grape",
			'Titanic',
			'Romeo + Juliet',
			"This Boy's Life",
			'The Man in the Iron Mask',
			'Gangs of New York',
			'The Aviator',
			'Blood Diamond',
			'Skyfall',
			'Dream House',
			'Casino Royale',
			'The Last Picture Show',
			'Mary Poppins',
			'Mud',
			'Chitty Chitty Bang Bang',
			'Who Framed Roger Rabbit',
			'Dead Poets Society',
			'Awakenings',
			'Hook',
			'Aladdin',
			'Toys',
			'Mrs. Doubtfire',
			'Jumanji',
			'Flubber',
			'Good Will Hunting',
			'Insomnia',
			'Robots',
			'I, Robot',
			'Independence Day',
			'Mars Attacks',
			'Wild Wild West',
			'I Am Legend',
			'The Incredibles',
			'Fantasia',
			'The Night Before Christmas',
			'Ratatouille',
			'Ice Age',
			"A Bug's Life",
			"The Emperor's New Groove",
			'The Little Mermaid',
			'Tarzan',
			'Winnie the Pooh',
			'Chicken Run',
			'The Secret of NIMH',
			'The Land Before Time',
			'Hercules',
			'101 Dalmatians',
			'Antz',
			'Mousehunt',
			'The Great Mouse Detective',
			'All Dogs Go to Heaven',
			'An American Tail',
			'An American Tail: Fievel Goes West',
			'Taken',
			'No Country for Old Men',
			'A Walk Among the Tombstones',
			'Ace Ventura: Pet Detective',
			'Taking Lives'
		];

		// gets the number of done movies
		function getNumDone() {
			var i, num = 0;
			for (i = 0; i < $scope.movies.length; i++) {
				if ($scope.movies[i].done) {
					num++;
				}
			}
			return num;
		}

		// updates statistical variables
		function update() {
			$scope.numDone = getNumDone();
			$scope.progress = ($scope.numDone / $scope.movies.length) * 100;
			$('#progress-bar').css('width', $scope.progress + '%');
		}

		// initializes the controller
		function init() {
			var i;

			// initialize movies list
			$scope.movies = [];
			for (i = 0; i < MOVIES.length; i++) {
				$scope.movies[i] = {
					name: MOVIES[i],
					done: ($cookies.get(MOVIES[i]) === 'true')
				};
			}

			update();
		}

		// public methods

		// toggles the passed index and updates progress
		$scope.toggle = function (index) {
			$scope.movies[index].done = !$scope.movies[index].done;
			$cookies.put($scope.movies[index].name, $scope.movies[index].done);
			update();
		};

		// initialization
		init();
	}]);
})();
