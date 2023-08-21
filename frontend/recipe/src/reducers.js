const initialState = {
  likedPosts: [], // Initialize likedPosts as an empty array
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_LIKE':
      const postId = action.payload;
      const newLikedPosts = state.likedPosts.includes(postId)
        ? state.likedPosts.filter(id => id !== postId)
        : [...state.likedPosts, postId];
      return {
        ...state,
        likedPosts: newLikedPosts,
      };
    default:
      return state;
  }
};

export default reducers;
