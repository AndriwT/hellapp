import App from "@/components/App";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>HellApp</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <App />
      </main>
    </>
  );
}
