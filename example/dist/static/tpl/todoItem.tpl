<!--target:todo-item-->
<div class="view">
    <input class="toggle" type="checkbox" ng-model="todo.completed">
    <label ng-dblclick="editTodo(todo)">{{todo.title}}</label>
    <button class="destroy" ng-click="removeTodo(todo)"></button>
</div>
<form ng-submit="doneEditing(todo)">
    <input class="edit" ng-trim="false" ng-model="todo.title" ng-blur="doneEditing(todo)" todo-escape="revertEditing(todo)" todo-focus="todo == editedTodo">
</form>