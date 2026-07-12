/**
 * VOICEVOXは英単語(アルファベット)をそのまま渡すと正しく読み上げられないことが多いため、
 * 音声合成に渡す直前にアルファベット部分をカタカナ読みへ変換するためのユーティリティ。
 *
 * 画面上のチャットログ表示には一切影響しない(音声合成用のテキストのみを変換する)。
 */

// HISAQUAの固有名詞・楽曲名など、変換結果を固定したい単語の辞書(小文字key)
const WORD_KATAKANA_DICTIONARY: Record<string, string> = {
  hisaqua: "ヒサクア",
  hisako: "ヒサコ",
  aqua: "アクア",
  vocaloid: "ボーカロイド",
  progressive: "プログレッシブ",
  house: "ハウス",
  trance: "トランス",
  rock: "ロック",
  pops: "ポップス",
  pop: "ポップ",
  alternative: "オルタナティブ",
  ep: "イーピー",
  eps: "イーピーズ",
  single: "シングル",
  album: "アルバム",
  kotonorium: "コトノリウム",
  islet: "アイレット",
  amulet: "アミュレット",
  troposphere: "トロポスフィア",
  remixes: "リミックス",
  remix: "リミックス",
  midnight: "ミッドナイト",
  sky: "スカイ",
  first: "ファースト",
  light: "ライト",
  blue: "ブルー",
  horizon: "ホライズン",
  extended: "エクステンデッド",
  mix: "ミックス",
  daybreak: "デイブレイク",
  hope: "ホープ",
  endeavors: "エンデバーズ",
  endeavor: "エンデバー",
  rampage: "ランページ",
  graffiti: "グラフィティ",
  nightscape: "ナイトスケープ",
  wonderful: "ワンダフル",
  reunion: "リユニオン",
  next: "ネクスト",
  line: "ライン",
  pleasure: "プレジャー",
  vrchat: "ブイアールチャット",
  vr: "ブイアール",
  twitch: "ツイッチ",
  attributes: "アトリビューツ",
  tribute: "トリビュート",
  chatvrm: "チャットブイアールエム",
  dj: "ディージェー",
  pc: "ピーシー",
  ai: "エーアイ",
  full: "フル",
};

// 読み間違えやすい固有の漢字表現を、読み上げ用のひらがな/カタカナへ置き換える辞書
const KANJI_READING_OVERRIDES: [string, string][] = [["燈火", "ともしび"]];

// 「1st」「2nd」のような英語式の序数表現をカタカナ読みへ変換するための対応表(1〜20)
const ORDINAL_KATAKANA: Record<number, string> = {
  1: "ファースト",
  2: "セカンド",
  3: "サード",
  4: "フォース",
  5: "フィフス",
  6: "シックス",
  7: "セブンス",
  8: "エイス",
  9: "ナインス",
  10: "テンス",
  11: "イレブンス",
  12: "トゥエルフス",
  13: "サーティーンス",
  14: "フォーティーンス",
  15: "フィフティーンス",
  16: "シックスティーンス",
  17: "セブンティーンス",
  18: "エイティーンス",
  19: "ナインティーンス",
  20: "トゥエンティエス",
};

// 辞書に無い1〜3文字の頭字語(略語)を1文字ずつ読み上げる際のアルファベット読み
const ALPHABET_KATAKANA: Record<string, string> = {
  a: "エー",
  b: "ビー",
  c: "シー",
  d: "ディー",
  e: "イー",
  f: "エフ",
  g: "ジー",
  h: "エイチ",
  i: "アイ",
  j: "ジェー",
  k: "ケー",
  l: "エル",
  m: "エム",
  n: "エヌ",
  o: "オー",
  p: "ピー",
  q: "キュー",
  r: "アール",
  s: "エス",
  t: "ティー",
  u: "ユー",
  v: "ブイ",
  w: "ダブリュー",
  x: "エックス",
  y: "ワイ",
  z: "ゼット",
};

// 母音+子音の簡易カタカナ対応表(五十音に近い読みへの概算変換)
const CV_TABLE: Record<string, string> = {
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  ga: "ガ", gi: "ギ", gu: "グ", ge: "ゲ", go: "ゴ",
  sa: "サ", si: "シ", su: "ス", se: "セ", so: "ソ",
  za: "ザ", zi: "ジ", zu: "ズ", ze: "ゼ", zo: "ゾ",
  ta: "タ", ti: "ティ", tu: "トゥ", te: "テ", to: "ト",
  da: "ダ", di: "ディ", du: "ドゥ", de: "デ", do: "ド",
  na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  ha: "ハ", hi: "ヒ", hu: "フ", he: "ヘ", ho: "ホ",
  fa: "ファ", fi: "フィ", fu: "フ", fe: "フェ", fo: "フォ",
  ba: "バ", bi: "ビ", bu: "ブ", be: "ベ", bo: "ボ",
  va: "ヴァ", vi: "ヴィ", vu: "ヴ", ve: "ヴェ", vo: "ヴォ",
  pa: "パ", pi: "ピ", pu: "プ", pe: "ペ", po: "ポ",
  ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ya: "ヤ", yu: "ユ", yo: "ヨ",
  ra: "ラ", ri: "リ", ru: "ル", re: "レ", ro: "ロ",
  la: "ラ", li: "リ", lu: "ル", le: "レ", lo: "ロ",
  ja: "ジャ", ji: "ジ", ju: "ジュ", je: "ジェ", jo: "ジョ",
  ca: "カ", ci: "シ", cu: "ク", ce: "セ", co: "コ",
  wa: "ワ", wi: "ウィ", wu: "ウ", we: "ウェ", wo: "ヲ",
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
};

// 2〜4文字のまとまりを優先してカタカナへ変換するためのルール(長い並びから順にマッチさせる)
const MULTI_CHAR_TABLE: [string, string][] = [
  ["tion", "ション"],
  ["sion", "ジョン"],
  ["dge", "ッジ"],
  ["tch", "ッチ"],
  ["ing", "イング"],
  ["ers", "アーズ"],
  ["ch", "チ"],
  ["sh", "シュ"],
  ["ph", "フ"],
  ["wh", "ホワ"],
  ["qu", "クワ"],
  ["ck", "ック"],
  ["th", "ス"],
  ["er", "アー"],
];

// 母音を伴わない子音単独を読む際のデフォルト(ウ段中心)のカタカナ
const DEFAULT_CONSONANT_KATAKANA: Record<string, string> = {
  b: "ブ", c: "ク", d: "ド", f: "フ", g: "グ", h: "フ",
  j: "ジュ", k: "ク", l: "ル", m: "ム", n: "ン", p: "プ",
  q: "ク", r: "ル", s: "ス", t: "ト", v: "ヴ", w: "ウ",
  x: "クス", y: "イ", z: "ズ",
};

/**
 * 辞書・変換ルールに存在しない単語を、文字単位の概算ヒューリスティックでカタカナへ変換する。
 * 完全な発音再現を目指すものではなく、VOICEVOXがそのまま英字を読むよりも自然に聞こえることを目的とする。
 */
function heuristicTransliterate(word: string): string {
  const lower = word.toLowerCase();
  let result = "";
  let i = 0;

  while (i < lower.length) {
    let matched = false;

    // 2〜4文字の特殊な並びを長い方から優先してマッチさせる
    for (let len = 4; len >= 2; len--) {
      const chunk = lower.slice(i, i + len);
      const rule = MULTI_CHAR_TABLE.find(([pattern]) => pattern === chunk);
      if (rule) {
        result += rule[1];
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const twoChar = lower.slice(i, i + 2);
    if (CV_TABLE[twoChar]) {
      result += CV_TABLE[twoChar];
      i += 2;
      continue;
    }

    const oneChar = lower[i];
    if (CV_TABLE[oneChar]) {
      result += CV_TABLE[oneChar];
      i += 1;
      continue;
    }

    // 母音を伴わない子音単独はウ段中心のデフォルト読みにフォールバック
    result += DEFAULT_CONSONANT_KATAKANA[oneChar] ?? "";
    i += 1;
  }

  return result;
}

/**
 * 1単語をカタカナ読みへ変換する。
 * - 辞書に登録済みの単語はそのまま採用
 * - 母音を含まない短い大文字略語(例: "PC", "DJ")は1文字ずつアルファベット読み
 * - それ以外はヒューリスティック変換
 */
function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  if (WORD_KATAKANA_DICTIONARY[lower]) {
    return WORD_KATAKANA_DICTIONARY[lower];
  }

  const isShortAcronym = word.length <= 5 && !/[aeiou]/i.test(word);
  if (isShortAcronym) {
    return word
      .toLowerCase()
      .split("")
      .map((char) => ALPHABET_KATAKANA[char] ?? "")
      .join("");
  }

  return heuristicTransliterate(word);
}

/**
 * VOICEVOXに渡す音声合成用テキストを生成する。
 * - URLやSNSアカウント名(@から始まる文字列)は読み上げに適さないため取り除く
 * - 残ったアルファベットの並びはカタカナ読みへ変換する
 * 画面表示用のテキストには影響しない。
 */
export function toSpeakableText(text: string): string {
  let result = text;

  // 読み間違えやすい固有の漢字表現を先に読み上げ用の表記へ置き換える
  for (const [kanji, reading] of KANJI_READING_OVERRIDES) {
    result = result.split(kanji).join(reading);
  }

  // URL(http/https/www)を除去
  result = result.replace(/https?:\/\/\S+/gi, "");
  result = result.replace(/www\.\S+/gi, "");

  // SNSアカウント名(@から始まる文字列)を除去
  result = result.replace(/@[A-Za-z0-9_]+/g, "");

  // 残った空白の連続を整理
  result = result.replace(/[ \t]{2,}/g, " ").trim();

  // 「1st」「2nd」等の英語式序数をカタカナ読みへ変換(アルファベット変換より先に行う)
  result = result.replace(/(\d{1,2})(st|nd|rd|th)\b/gi, (match, num) => {
    const kana = ORDINAL_KATAKANA[Number(num)];
    return kana ?? match;
  });

  // アルファベットの並びをカタカナ読みへ変換
  result = result.replace(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g, (match) =>
    transliterateWord(match)
  );

  return result;
}
