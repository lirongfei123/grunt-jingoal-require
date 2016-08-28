"use strict";define("directives/todoItem_13e72c1317b3931cc1017f2ec2f08ef0",["tpl/todoItem_a1bc63a51282e9c56b21202e096cb7cd"],function(){var moduleName="TodoItemDirective";return angular.module(moduleName,[]).directive("todoItem",function($timeout){return{restrict:"A",templateUrl:"todo-item",link:function($scope,$element,$attr){$scope.editTodo=function(todo){$scope.editedTodo=todo,$scope.originalTodo=angular.copy(todo)},$scope.doneEditing=function(todo){$scope.editedTodo=null,todo.title=todo.title.trim(),todo.title||$scope.removeTodo(todo)}}}}),moduleName}),define("tpl/todoItem_a1bc63a51282e9c56b21202e096cb7cd",function(){utils.loadTtpl(function(){eval("var a='a'"),/*loadText*<!--target:todo-item-->
<div class="view">
    <input class="toggle" type="checkbox" ng-model="todo.completed">
    <label ng-dblclick="editTodo(todo)">{{todo.title}}</label>
    <button class="destroy" ng-click="removeTodo(todo)"></button>
</div>
<form ng-submit="doneEditing(todo)">
    <input class="edit" ng-trim="false" ng-model="todo.title" ng-blur="doneEditing(todo)" todo-escape="revertEditing(todo)" todo-focus="todo == editedTodo">
</form>loadTextEnd*/
eval("var a='a'")})});