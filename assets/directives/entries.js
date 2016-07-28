(function() {
'use strict';

var app = angular.module('app');

app.directive('entries', directive);

directive.$inject = ['lodash'];

function directive(_) {
	return {
		restrict: 'E',
		templateUrl: '/templates/entriesTmpl.html',
		scope: {
			entry: '=entry',
		},
		link: link
	};


	function link(scope, element, attrs) {
		scope.getStyle = getStyle;
		scope.getClass = getClass;
		scope.getName = getName;
		scope.getJockey = getJockey;
		scope.getTrainer = getTrainer;

		function getStyle() {
			if(scope.entry.active) return;

			return {
				'text-decoration': 'line-through',
			};
		}

		function getClass() {
			if(scope.entry.active) {
				return {
					raceDetailsSmaller: true,
				};
			}

			return {
				raceDetailsShade: true,
			};
		}

		function getName(runner) {
			return runner.name;
		}

		function getJockey(runner) {
			return runner.jockey;
		}

		function getTrainer(runner) {
			return runner.trainer;
		}

	}

}

}());
