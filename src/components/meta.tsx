import { buildUrl } from "@/utils/buildUrl";
import Head from "next/head";
export const Meta = () => {
  const title = "ひさこちゃんBOT";
  const description =
    "ひさこちゃんと話せるWebアプリケーション";
  const imageUrl = "https://github.com/aqua-ix/ChatVRM/blob/hisabot/public/ogp.png?raw=true";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
