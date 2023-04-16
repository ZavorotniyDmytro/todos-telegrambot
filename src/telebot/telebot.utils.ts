export const showTodos = (todos: Todo[]) => { return `Your to-do list:\n\n${
	todos.map(
		todo=>(!todo.isCompleted?'ACTIVE':'COMPLETED')+' '+todo.name
		).join('\n\n')}`}
