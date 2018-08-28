import Store from '../store/recipes';

export const initialState = Store;

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'FAVOURITES_REPLACE': {
      return {
        ...state,
        favourites: action.data || [],
      };
    }
    case 'CURRENT_RECIPE': {
      return {
        ...state,
        error: null,
        loading: false,
        recipe: action.data,
      };
    }
    case 'RECIPES_ERROR': {
      return {
        ...state,
        error: action.data,
      };
    }
    case 'RECIPES_REPLACE': {
      let recipes = [];
      let temp = []
      // Pick out the props I need
      if (action.data && !Array.isArray(action.data)) {
        Object.entries(action.data).map(([key, value]) => {
          temp.push(value);
        });
        action.data = temp;
      }

      if (action.data && typeof action.data === 'object' && Array.isArray(action.data)) {
        recipes = action.data.map(item => {
          if (item) {
            return {
            appointmentName: item.appointmentName,
            dates: item.dates,
            description: item.description,
            location: item.location,
            masterEmail: item.masterEmail,
            masterName: item.masterName,
            id: item.id,
            invitedUsers: item.invitedUsers,
            masteruid: item.masteruid,
            meetupTime: item.meetupTime,
            meetupDate: item.meetupDate,
          }
      }});
      }
      return {
        ...state,
        error: null,
        loading: false,
        recipes,
      };
    }
    default:
      return state;
  }
}
