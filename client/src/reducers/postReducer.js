import {
  ADD_POST,
  GET_POST,
  GET_POSTS,
  DELETE_POST,
  POST_LOADING
} from '../actions/types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
