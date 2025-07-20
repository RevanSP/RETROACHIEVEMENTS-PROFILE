import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/avif" href="/logo.avif" />
      </Head>
    <body className="antialiased min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}