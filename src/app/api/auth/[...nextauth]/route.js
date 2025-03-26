import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import bcrypt from "bcrypt";
import User from "@/models/User";
import { connect } from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        await connect();
        const { email, password } = credentials;
        const user = await User.findOne({ email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        const { password: _, ...userWithoutPass } = user._doc;
        const accessToken = signJwtToken(userWithoutPass, { expiresIn: "7d" });

        return { ...userWithoutPass, accessToken };
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,  // ✅ Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // ✅ Google Secret
    }),

  ],

  callbacks: {
    async signIn({ account, profile }) {
      await connect();
    
      if (account.provider === "github" || account.provider === "google") {
        let user = await User.findOne({ email: profile.email });
    
        if (!user) {
          user = await User.create({
            name: profile.name || `${account.provider} User`,
            email: profile.email,
            avatar: account.provider === "github" ? profile.avatar_url : profile.picture, // ✅ Avatar set correctly
          });
        }
      }
    
      return true;
    },
    

    

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.accessToken = user.accessToken || null;
      }
      return token;
    },



    async session({ session, user, token }) {
  if (token) {
    const dbUser = await User.findOne({ email: session.user.email });
    session.user._id = token._id;
    session.user.id = dbUser._id || "dfvvfvsf";
  } else {

    const dbUser = await User.findOne({ email: session.user.email });
    session.user._id = dbUser._id;
    session.user.avatar = dbUser.avatar;
  }
  return session;
}



  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
