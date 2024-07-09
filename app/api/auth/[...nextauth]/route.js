import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        console.log("callback => ", profile);
        const data = {
          email: profile.email,
        };
        //CheckUserRegistration
        const response = await fetch(
          "http://api.bd2-cloud.net/api/user/get-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        console.log("response => ", response);
        if (response.ok) {
          const responseData = await response.json();
          console.log("User is registered:", responseData);
          return true;
        } else if (response.status === 404) {
          return `/auth/register?email=${profile.email}&name=${profile.name}&imgurl=${profile.picture}`;
        } else {
          console.error("Error checking registration:");
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
