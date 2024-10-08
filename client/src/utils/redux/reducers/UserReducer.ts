import * as Types from '../constants/ActionTypes';

export const LoginReducer = (state = {}, action: any) => {
	switch (action.type) {
		case Types.USER_LOGIN_REQUEST:
			return { loading: true };
		case Types.USER_LOGIN_SUCCESS:
			return { loading: false, userInfo: action.payload };
		case Types.USER_LOGIN_FAIL:
			return { loading: false, error: action.payload };
		case Types.USER_LOGOUT || Types.USER_LOGIN_RESET:
			return {};
		default:
			return state;
	}
};

export const RegisterReducer = (state = {}, action: any) => {
	switch (action.type) {
		case Types.USER_REGISTER_REQUEST:
			return { loading: true };
		case Types.USER_REGISTER_SUCCESS:
			return { loading: false, userInfo: action.payload };
		case Types.USER_REGISTER_FAIL:
			return { loading: false, error: action.payload };
		default:
			return state;
	}
};
