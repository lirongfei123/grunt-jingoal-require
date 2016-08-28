/*global require*/
'use strict';

require([
	'public/common/language-tools',
	'angular/angular.min',
	'loader/lcss!public/todomvc/index'
], function () {
	require([
		'angular/angular-route.min'
	], function () {
		require([
			'controllers/todo', 
			'directives/todoItem', 
			'directives/todoFocus', 
			'directives/todoEscape',
			'services/todoStorage'
		], function (todoCtrl, todoItem, todoFocusDir, todoEscapeDir, todoStorageSrv) {
			angular
				.module('todomvc', [todoFocusDir, todoItem, todoEscapeDir, todoStorageSrv])
				.controller('TodoController', todoCtrl);
			angular.bootstrap(document, ['todomvc']);			
		});			
	});	
	
});
