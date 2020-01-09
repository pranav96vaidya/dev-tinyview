import * as PostActions from '../redux/action';
import { Post } from '../redux/model';

export type Action = PostActions.All;

const defaultState: Post = {
  text: 'Tinyview'
};

const newState = (state, newData) => {
  return Object.assign({}, state, newData);
};


export function Reducer(state: Post = defaultState, action: Action) {
  switch (action.type) {
    case PostActions.EDIT_TITLE: return newState(state, { text: action.payload });
    default: return state;
  }
}
