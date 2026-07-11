import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2&family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/*
        背景画像はページ側(index.tsx)で描画する。
        overlay.tsx(iframe埋め込み用)では背景を持たせず透過表示するため。
      */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
