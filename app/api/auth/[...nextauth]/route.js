import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const data = {
          email: credentials.email,
        };

        const response = await fetch(
          "https://api.bd2-cloud.net/api/user/get-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          const userData = await response.json();
          const user = userData[0];
          //console.log(user.password);
          if (!user.password) {
            console.error("User has no password field.");
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            console.error("Password does not match.");
            return null;
          } else {
            const res = await fetch(
              "https://api.bd2-cloud.net/api/user/updateStatus",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: credentials.email, status: 1 }),
              }
            );
            if (!res.ok) {
              console.error("Failed to update user status.");
              return null;
            } else return user;
          }
        } else {
          console.error("Failed to fetch user data.");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  jwt: {
    maxAge: 3600,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        //console.log("callback => ", profile);
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
        if (response.ok) {
          const responseData = await response.json();
          //console.log("User is registered:", responseData);
          user.response = responseData[0];
          return true;
        } else if (response.status === 404) {
          return `/auth/register?email=${profile.email}&name=${profile.name}&imgurl=${profile.picture}`;
        } else {
          console.error("Error checking registration:");
        }
      } else if (account.provider === "credentials") {
        console.log("callback => ", user);
        return true;
      }
      return true;
    },
    async session({ session, token, user }) {
      if (token.provider === "google") {
        session.user.provider = "google";
      } else if (token.provider === "credentials") {
        session.user.provider = "credentials";
      }
      session.user.id = token.id || token.user.account_id;
      session.user.role = token.role || token.user.role;
      session.user.image = token.image || token.user.imgurl;
      return session;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider; // Store the provider in the token
      }

      if (user) {
        token.user = user.response;
        token.id = user.account_id;
        token.role = user.role;
        token.image = user.imgurl; // Assuming your user object has a role property
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
