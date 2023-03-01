import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";

const blogger = localFont({
  src: "../public/fonts/blogger-sans.medium.otf",
  variable: "--font-blogger",
});

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${blogger.variable} font-blogger`}>
      <div className={inter.className}>
        <Component {...pageProps} />{" "}
      </div>
    </main>
  );
}

export default App;
