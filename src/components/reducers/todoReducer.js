export default function reducer(state, action) {
  switch (action.type) {
    case "GET_TODOS":
      return {
        ...state,
        todos: action.payload,
      };

    case "TOGGLE_TODO":
      const toggledTodos = state.todos.map((t) =>
        t._id === action.payload._id ? action.payload : t
      );
      return {
        ...state,
        todos: toggledTodos,
      };
    case "REMOVE_TODO":
      const filteredTodos = state.todos.filter((t) => t._id !== action.payload);
      const isRemovedTodo =
        state.currentTodo._id === action.payload._id ? {} : state.currentTodo;
      return {
        ...state,
        currentTodo: isRemovedTodo,
        todos: filteredTodos,
      };
    case "ADD_TODO":
      const addedTodos = [...state.todos, action.payload];
      return {
        ...state,
        todos: addedTodos,
      };
    case "SET_CURRENT_TODO":
      return {
        ...state,
        currentTodo: action.payload,
      };
    case "UPDATE_TODO":
      // if (!action.payload) {
      //   return state;
      // }
      // if (state.todos.findIndex((t) => t.text === action.payload) > -1) {
      //   return state;
      // }
      const updatedTodo = { ...action.payload };
      const updatedTodoIndex = state.todos.findIndex(
        (t) => t._id === state.currentTodo._id
      );
      const updatedTodos = [
        ...state.todos.slice(0, updatedTodoIndex),
        updatedTodo,
        ...state.todos.slice(updatedTodoIndex + 1),
      ];
      return {
        ...state,
        currentTodo: {},
        todos: updatedTodos,
      };
    default:
      return state;
  }
}
