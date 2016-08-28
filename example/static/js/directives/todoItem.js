/*global define*/
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
 */
 
define(['loader/ltpl!tpl/todoItem'],function () {
	var moduleName = 'TodoItemDirective';
	angular
		.module(moduleName, [])
		.directive('todoItem', function ($timeout) {
			return {
	            restrict: 'A',
	            templateUrl: "todo-item",
	            link: function ($scope, $element, $attr) {
	            	$scope.editTodo = function (todo) {
	            		$scope.editedTodo = todo;
	            		// Clone the original todo to restore it on demand.
	            		$scope.originalTodo = angular.copy(todo);
	            	};


	            	$scope.doneEditing = function (todo) {
	            		$scope.editedTodo = null;
	            		todo.title = todo.title.trim();

	            		if (!todo.title) {
	            			$scope.removeTodo(todo);
	            		}
	            	};
	            }
	        };
		});
	return moduleName;
});
