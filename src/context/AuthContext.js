"use client";
import {
  getCurrentUserService,
  loginUserService,
  registerUserService,
} from "@/api/auth";
import { apiFetch } from "@/utils/utils";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = state.user?.role === "admin";

  useEffect(() => {
    async function loadUser() {
      const res = await getCurrentUserService();
      if (!res.error) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: res },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const data = await loginUserService(credentials);
    if (!data.error && data.token) {
      localStorage.setItem("token", data.token);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: data.user || null, token: data.token },
      });
    }
    return data;
  };

  const register = async (formData) => {
    return await registerUserService(formData);
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      return { error: error.message || "logout failed." };
    }
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, isLoading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
