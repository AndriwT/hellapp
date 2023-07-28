import App from "@/components/App";
import { User } from "firebase/auth";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ user }: { user: User | null }) {
  return (
    <>
      <Head>
        <title>HellApp</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 w-62">
        {user ? (
          <Link href="/home">home</Link>
        ) : (
          <div>
            <Link
              className="mt-20 mr-10 bg-lime-500 text-white rounded-md shadow-md p-4"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="mt-20 mr-10 bg-lime-500 text-white rounded-md shadow-md p-4"
              href="/register"
            >
              Register
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
