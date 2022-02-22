import { get, post } from "./ApiService";
import { setToken } from "./AuthService";

const USER_LOCAL = "user";

export const getUser = () => {
  //check if token exists in local storage
  if (localStorage.getItem(USER_LOCAL)) {
    const userJson = localStorage.getItem(USER_LOCAL);
    const userObj = userJson !== null ? JSON.parse(userJson) : {};
    return userObj;
  }

  return null;
};

export const setUser = (user: any) => {
  localStorage.setItem(USER_LOCAL, JSON.stringify(user));
};

export const deleteUserInLocalStorage = () => {
  localStorage.removeItem(USER_LOCAL);
  return true;
};

export const register = async (params: Object, login: boolean = true) => {
  try {
    const response = await post(`api/register`, params);
    if (response.status === 200) {
      // Login automatically
      if (login) {
        setToken(response.data.access_token);
        setUser(response.data.user);
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (params: Object, login: boolean = true) => {
  try {
    const response = await post(`api/user/me/edit`, params);
    if ((response.status === 200) && login) setUser(response.data.user);
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (params: Object) => {
  try {
    const response = await post(`api/user/me/changePassword`, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserFromApi = async () => {
  try {
    const response = await get(`api/user/me`);
    if (response.status === 200) {
      setUser(response.data.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const withdrawUserByToken = async (params: Object) => {
  try {
    const payload = {
      ...params,
    };

    const response = await post(`api/user/unsubscribe`, payload);

    if (response.status === 200) {
      setUser(response.data.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelUnsubscribe = async () => {
  try {
    const response = await post("api/user/cancel_unsubscribe", {});

    if (response.status === 200) {
      setUser(response.data.user);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserAttendingCourses = async (params?: Object) => {
  try {
    return await get("api/user/attending_course", params);
  } catch (error) {
    throw error;
  }
};
