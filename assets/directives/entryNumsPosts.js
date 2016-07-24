(function() {
'use strict';

var app = angular.module('app');

app.directive('entryNumsPosts', directive);

directive.$inject = [];

function directive() {
	return {
		restrict: 'E',
		templateUrl: '/templates/entryNumsPostsTmpl.html',
		scope: {
			entry: '=entry',
			race: '=race',
		},
		link: link
	};


	function link(scope, element, attrs) {
		scope.getAltRunnerStyle = getAltRunnerStyle;
		scope.getDetail = getDetail;

		function getAltRunnerStyle() {
			var race = scope.race;
			if(race.closed) return;

			return {left: '17px'};
		}

		function getDetail(runner) {
			var number = runner.number;
			var post = runner.post;

			if(post && number !== post) {
				return number + ' ' + post;
			}

			return number;
		}
	}

}

}());
