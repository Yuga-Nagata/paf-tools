import { Channel } from "@/lib/types";

/**
 * @file channels.ts
 * @description Master configuration of authorized YouTube channels for IRIAM karaoke streams.
 * Includes fixed ranks for tie-breaking in search results.
 */

/**
 * The full collection of 29 authorized YouTube channels.
 * Sorted by priority rank (rank=1 is most preferred).
 * 
 * @type {ReadonlyArray<Channel>}
 */
export const CHANNELS: ReadonlyArray<Channel> = [
  { rank: 1, label: "電楽都市 official", channelId: "UCYbAf9SQD_vSqO-x2_94wGQ" },
  { rank: 2, label: "生音風カラオケ屋", channelId: "UCZ3ryrdsdqezi2q-AfRw6Rw" },
  { rank: 3, label: "Mick", channelId: "UCep27mxUiDB2XBOYeUma8dA" },
  { rank: 4, label: "カラオケ制作所「BOX」📦🎹", channelId: "UCmfr4S8C_jFNDsTBqfKhcXA" },
  { rank: 5, label: "カラオケ再現所@KEISUKEO.", channelId: "UCUo8aHsNE4__8ZUxAmdhqLA" },
  { rank: 6, label: "カラオケ@DIVA", channelId: "UCOgOuWBAQ1GXj_gfYHOUOcA" },
  { rank: 7, label: "entame rise", channelId: "UC-TW5XiEDvlyPEyMZSz8Cxg" },
  { rank: 8, label: "アルタエース-カラオケ制作・芸能マネジメントチャンネル", channelId: "UC7fyuQSXC8wIqH-CwvRup-Q" },
  { rank: 9, label: "ユウ", channelId: "UCL9lulyqd7z-St6uvEdmqpw" },
  { rank: 10, label: "小さな音楽部屋", channelId: "UCqDmeqMPiltISgFQDUI7NKw" },
  { rank: 11, label: "カラオケ音源とかのやつ", channelId: "UCxaw9r7yNwlSaH6f4LETeQw" },
  { rank: 12, label: "JPOP Karaoke カラオケ", channelId: "UCTT44jmy7-pIGKpy-Ih8NyA" },
  { rank: 13, label: "SuzuJun Ch. すずじゅん♪", channelId: "UC8BrKZbNXiNVEBiiD-OzZ0Q" },
  { rank: 14, label: "萩宮ルナ hagi piano VTuber準備中", channelId: "UC3g6Vrieg1Wqoxn5wHm0iNg" },
  { rank: 15, label: "スウェット", channelId: "UCCrxMkIxHHA89SWH1Od6g8Q" },
  { rank: 16, label: "まがいもの商事株式会社", channelId: "UCW-yyUvoFLBS28gR32a2Xmw" },
  { rank: 17, label: "オフボ屋🎸Dagger Hearts【ダガーハーツ】", channelId: "UCimDQtrwmDKPzgi5rRaAfCg" },
  { rank: 18, label: "HiroK Inst Channel", channelId: "UCojHiDbqtlYU089qIwKpJsw" },
  { rank: 19, label: "チャンネルぴー助", channelId: "UCK0NOAXbYo5-h6Sdu3RLBGQ" },
  { rank: 20, label: "SORA 初良 生演奏 カラオケ ちゃんねる", channelId: "UCMqgnW7zcdlZncFFoHowh2Q" },
  { rank: 21, label: "リミックス[音源配布中]", channelId: "UCvhmtvxxSP0F4iqWIfSnN6Q" },
  { rank: 22, label: "isBlank", channelId: "UCmK08xAeFLE3qgypIH4HHQw" },
  { rank: 23, label: "Yossy", channelId: "UCIuMN-FGE1B7OyKKxggJ2Dg" },
  { rank: 24, label: "Hiro’s Piano Arrangement", channelId: "UCWX2b3xIeJHoiNOPd9nTuKA" },
  { rank: 25, label: "ハイブリッジ", channelId: "UCR4L9Gl7hkHw44gZR5vLn4Q" },
  { rank: 26, label: "星海ハル", channelId: "UCpHRdO77UDchUGe5XkDnyrA" },
  { rank: 27, label: "HoneyWorks 2nd Channel", channelId: "UCfuBLr03CN1OWKP0XS5GqFA" },
  { rank: 28, label: "(^^)・・・つ", channelId: "UCv6cA8lChl-z3OC_RcqsduQ" },
  { rank: 29, label: "negoto@ ฅ۶•ﻌ•♡ฅ", channelId: "UC3EXlgN50es9dP_6GxC84aQ" },
];
