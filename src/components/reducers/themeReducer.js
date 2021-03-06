export default function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return {
        value: action.payload ? "Dark" : "Light",
        currentChecked: action.payload,
      };
    case "GET_THEME":
      return {
        ...state,
      };
    default:
      return state;
  }
}
