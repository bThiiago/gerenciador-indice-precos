import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import { api } from "../services/axios";
import { ResponseError } from "../errors/ResponseError";
import { IonToast } from "@ionic/react";

interface ICredentials {
  name: string;
  password: string;
}

interface Iname {
  name: string;
  level: number;
}

interface IAuthState {
  token: string;
  user: Iname;
  darkMode: boolean;
}

interface IAuthContext {
  signIn(credentials: ICredentials): Promise<void>;
  signOut(): void;
  toggleDarkMode(): void;
  user?: Iname;
  darkMode: boolean;
}

interface ApiSessionRequest {
  token: string;
  user: Iname;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem("@ipjr:token");
    const name = localStorage.getItem("@ipjr:name");
    const darkMode = localStorage.getItem("@ipjr:darkMode");

    if (token && name) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        token,
        user: JSON.parse(name),
        darkMode: darkMode === "true",
      };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(async (credentials: ICredentials) => {
    const res = await api.post<ApiSessionRequest>("/sessions", {
      name: credentials.name,
      password: credentials.password,
    });

    const { token, user } = res.data;

    localStorage.setItem("@ipjr:token", token);
    localStorage.setItem("@ipjr:name", JSON.stringify(user));
    localStorage.setItem("@ipjr:darkMode", "false");

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user, darkMode: false });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@ipjr:token");
    localStorage.removeItem("@ipjr:name");
    localStorage.removeItem("@ipjr:darkMode");
    window.location.reload();

    setData({} as IAuthState);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !data.darkMode;
    localStorage.setItem("@ipjr:darkMode", newDarkMode.toString());
    setData({ ...data, darkMode: newDarkMode });
  }, [data]);

  useEffect(() => {
    if (!data.token) {
      return;
    }

    api
      .get("/sessions/validate")
      .then(() => {
        console.log("[Auth Hook] Logado");
      })
      .catch((err: any) => {
        signOut();
        let message: string;
        if (err instanceof ResponseError) {
          message = "Sessão expirada, entre novamente.";
        } else {
          message = "O servidor não teve resposta. Entre novamente mais tarde.";
        }
        <IonToast isOpen={true} message={message} duration={2500} />;
      });
  }, [data.token, signOut]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        toggleDarkMode,
        user: data.user,
        darkMode: data.darkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
