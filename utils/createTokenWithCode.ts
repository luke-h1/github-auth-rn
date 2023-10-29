interface CodeResponse {
  token_type: string;
  scope: string;
  access_token: string;
}

export const createTokenWithCode = async (code: string): Promise<CodeResponse> => {
  const url = `https://github.com/login/oauth/access_token?client_id=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.json() as Promise<CodeResponse>;
};
