import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  uid: string;
  createdAt: string;
  displayName: string;
  lastLoginAt: string;
  photoURL: string;
  providerId: string;
  email: string;
}

interface AuthContextState {
  user: User | null;
  signIn: Dispatch<SetStateAction<User>>;
  signOut: () => void;
}

const initState = {
  uid: "",
  createdAt: "",
  displayName: "",
  lastLoginAt: "",
  photoURL: "",
  providerId: "",
  email: "",
};

const contextState: AuthContextState = {
  user: initState,
  signIn: () => {},
  signOut: () => {},
};

const AuthContext = createContext<AuthContextState | null>(contextState);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext needs to be within an AuthContext.Provider");
  }

  return context;
};

function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!navigationState.key || hasNavigated) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!user.uid && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      setHasNavigated(true);
    } else if (user.uid && inAuthGroup) {
      router.replace("/(tabs)");
      setHasNavigated(true);
    }
  }, [user.uid, segments, navigationState, hasNavigated]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initState);

  useProtectedRoute(user);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const u: User = {
          uid: user.providerData[0].uid,
          displayName: user.providerData[0].displayName ?? "",
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId,
          createdAt: user.metadata.creationTime ?? "",
          lastLoginAt: user.metadata.lastSignInTime ?? "",
          email: user.providerData[0].email ?? "",
        };
        setUser(u);
        router.replace("/(tabs)");
      } else {
        console.log("u is not auth");
        router.replace("/(auth)/sign-in");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: setUser,
        signOut: () => {
            setUser(initState);
            signOut(auth);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
