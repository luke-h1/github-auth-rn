import { useTheme } from "@react-navigation/native";
import { Text, View } from "../../components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { createTokenWithCode } from "../../utils/createTokenWithCode";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

const SignInScreen = () => {
  const theme = useTheme();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET,
      scopes: ['identity', 'user:email', 'user:follow'],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response?.type === "success") {
      const { code } = response.params;
      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );

      console.log("createTokenWithCode:", {
        token_type,
        scope,
        access_token,
      });

      if (!access_token) {
        return;
      }

      const credential = GithubAuthProvider.credential(access_token);
      const data = await signInWithCredential(auth, credential);

      console.log(data);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Sign In</Text>
      <Icon.Button
        name="github"
        backgroundColor={"transparent"}
        color={theme.dark ? "#fff" : "#000"}
        size={30}
        onPress={() => {
          promptAsync({
            windowName: "github auth",
          });
        }}
      >
        <Text>Sign In with GitHub</Text>
      </Icon.Button>
    </View>
  );
};
export default SignInScreen;
