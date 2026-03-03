"use client";

/**
 * @file basis/page.tsx
 * @description Page showing the basis for channel authorization for the Song Searcher tool.
 * Provides transparency to users and management regarding usage rights.
 */

import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Breadcrumbs,
  Box,
} from "@mui/material";
import NextLink from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

interface BasisEntry {
  no: number;
  name: string;
  url: string;
  basis: string;
}

const BASIS_DATA: BasisEntry[] = [
  {
    no: 1,
    name: "電楽都市 official",
    url: "https://www.youtube.com/channel/UCYbAf9SQD_vSqO-x2_94wGQ",
    basis: "（2026年3月3日時点）\nいくつかの動画の概要欄に、電楽都市制作の音源であり企業・個人を問わず自由に使用可能、商用利用・収益化も可、連絡・許諾不要との記載があるため。"
  },
  {
    no: 2,
    name: "生音風カラオケ屋",
    url: "https://www.youtube.com/channel/UCZ3ryrdsdqezi2q-AfRw6Rw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、個人利用であれば権利者の認める範囲内で配信等に使用して良いとの記載があるため。リンク不可のプラットフォーム（IRIAM等）での配慮も明記されている。"
  },
  {
    no: 3,
    name: "Mick",
    url: "https://www.youtube.com/channel/UCep27mxUiDB2XBOYeUma8dA",
    basis: "（2026年3月3日時点）\nファンティアの説明欄に、自作音源をYouTubeで公開しており、歌ってみたや各種SNSへの投稿、イベントやライブでも使用可能である旨が記されているため。"
  },
  {
    no: 4,
    name: "カラオケ制作所「BOX」📦🎹",
    url: "https://www.youtube.com/channel/UCmfr4S8C_jFNDsTBqfKhcXA",
    basis: "（2026年3月3日時点）\nチャンネル説明欄および音源利用ガイドラインに、歌枠配信やBGM用途で無償、収益化可能として利用できる旨が記載されているため。"
  },
  {
    no: 5,
    name: "カラオケ再現所@KEISUKEO.",
    url: "https://www.youtube.com/channel/UCUo8aHsNE4__8ZUxAmdhqLA",
    basis: "（2026年3月3日時点）\n音源利用ガイドラインにおいて、「歌枠配信」での利用（有料配信含む）が明示的に許可されているため。"
  },
  {
    no: 6,
    name: "カラオケ@DIVA",
    url: "https://www.youtube.com/channel/UCOgOuWBAQ1GXj_gfYHOUOcA",
    basis: "（2026年3月3日時点）\nチャンネル説明欄のFAQにて、スパチャやプレミア配信など有料ライブ配信での利用が許可されているため。"
  },
  {
    no: 7,
    name: "entame rise",
    url: "https://www.youtube.com/channel/UC-TW5XiEDvlyPEyMZSz8Cxg",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、配信・ライブでの音源利用を歓迎する旨の記載があるため。"
  },
  {
    no: 8,
    name: "アルタエース-カラオケ制作・芸能マネジメントチャンネル",
    url: "https://www.youtube.com/channel/UC7fyuQSXC8wIqH-CwvRup-Q",
    basis: "（2026年3月3日時点）\n音源ダウンロードページにて、歌ってみたやライブ配信での利用がOKである旨が記されているため。"
  },
  {
    no: 9,
    name: "ユウ",
    url: "https://www.youtube.com/channel/UCL9lulyqd7z-St6uvEdmqpw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、収益化の有無や個人・法人に関わらず、YouTube以外の配信アプリでも無料で自由に使用可能である旨が明記されているため。"
  },
  {
    no: 10,
    name: "小さな音楽部屋",
    url: "https://www.youtube.com/channel/UCqDmeqMPiltISgFQDUI7NKw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、歌ってみたや歌枠、配信BGM等にご利用くださいとの記載があるため。"
  },
  {
    no: 11,
    name: "カラオケ音源とかのやつ",
    url: "https://www.youtube.com/channel/UCxaw9r7yNwlSaH6f4LETeQw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、収益関連の制限はなくお気軽にご利用くださいとの旨が記載されているため。"
  },
  {
    no: 12,
    name: "JPOP Karaoke カラオケ",
    url: "https://www.youtube.com/channel/UCTT44jmy7-pIGKpy-Ih8NyA",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、URLを残すことで二次使用が可能である旨が記されているため。"
  },
  {
    no: 13,
    name: "SuzuJun Ch. すずじゅん♪",
    url: "https://www.youtube.com/channel/UC8BrKZbNXiNVEBiiD-OzZ0Q",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、活動者が歌ってみたや歌枠で使用することを歓迎する旨の記載があるため。"
  },
  {
    no: 14,
    name: "スウェット",
    url: "https://www.youtube.com/channel/UCCrxMkIxHHA89SWH1Od6g8Q",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、誰でもフリーで利用可能である旨が記されているため。"
  },
  {
    no: 15,
    name: "まがいもの商事株式会社",
    url: "https://www.youtube.com/channel/UCW-yyUvoFLBS28gR32a2Xmw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、音源の使用許可は一切不要である旨が明記されているため。"
  },
  {
    no: 16,
    name: "オフボ屋🎸Dagger Hearts【ダガーハーツ】",
    url: "https://www.youtube.com/channel/UCimDQtrwmDKPzgi5rRaAfCg",
    basis: "（2026年3月3日時点）\n動画コメント欄でのIRIAM歌枠利用に関する問い合わせに対し、肯定的な回答があったため。"
  },
  {
    no: 17,
    name: "HiroK Inst Channel",
    url: "https://www.youtube.com/channel/UCojHiDbqtlYU089qIwKpJsw",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に利用歓迎の旨があり、歌枠での利用報告に対しても肯定的なリアクションが返されているため。"
  },
  {
    no: 18,
    name: "チャンネルぴー助",
    url: "https://www.youtube.com/channel/UCK0NOAXbYo5-h6Sdu3RLBGQ",
    basis: "（2026年3月3日時点）\n動画コメント欄における歌枠利用の報告に対し、感謝と共感の肯定的な返信があったため。"
  },
  {
    no: 19,
    name: "SORA 初良 生演奏 カラオケ ちゃんねる",
    url: "https://www.youtube.com/channel/UCMqgnW7zcdlZncFFoHowh2Q",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、歌ってみたやBGMに使いたい方は自由に使ってくださいとの記載があるため。"
  },
  {
    no: 20,
    name: "リミックス[音源配布中]",
    url: "https://www.youtube.com/channel/UCvhmtvxxSP0F4iqWIfSnN6Q",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、配布している音源をご自由にお使いくださいとの記載があるため。"
  },
  {
    no: 21,
    name: "isBlank",
    url: "https://www.youtube.com/channel/UCmK08xAeFLE3qgypIH4HHQw",
    basis: "（2026年3月3日時点）\n動画コメント欄での歌枠利用報告に対し、感謝の返信があり肯定されているため。"
  },
  {
    no: 22,
    name: "Yossy",
    url: "https://www.youtube.com/channel/UCIuMN-FGE1B7OyKKxggJ2Dg",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、歌ってみたや演奏してみた、BGM等ご自由にお使いくださいとの記載があるため。"
  },
  {
    no: 23,
    name: "Hiro’s Piano Arrangement",
    url: "https://www.youtube.com/channel/UCWX2b3xIeJHoiNOPd9nTuKA",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、カバー動画、生配信、ライブ等ご自由にお使いくださいとの記載があるため。"
  },
  {
    no: 24,
    name: "ハイブリッジ",
    url: "https://www.youtube.com/channel/UCR4L9Gl7hkHw44gZR5vLn4Q",
    basis: "（2026年3月3日時点）\n多くの歌枠利用報告コメントに対し、肯定的なリアクション（ハート）が返されているため。"
  },
  {
    no: 25,
    name: "星海ハル",
    url: "https://www.youtube.com/channel/UCpHRdO77UDchUGe5XkDnyrA",
    basis: "（2026年3月1日時点）\n動画コメント欄での歌枠利用可否の問い合わせに対し、許可する旨の回答があったため。"
  },
  {
    no: 26,
    name: "HoneyWorks 2nd Channel",
    url: "https://www.youtube.com/channel/UCfuBLr03CN1OWKP0XS5GqFA",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、歌ってみたなどの動画公開に対し制限しておらず、自由に使用して良い旨が記されているため。"
  },
  {
    no: 27,
    name: "(^^)・・・つ",
    url: "https://www.youtube.com/channel/UCv6cA8lChl-z3OC_RcqsduQ",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、元の著作権者の許可の範囲内で自由に使用して良い旨の記載があるため。"
  },
  {
    no: 28,
    name: "negoto@ ฅ۶•ﻌ•♡ฅ",
    url: "https://www.youtube.com/channel/UC3EXlgN50es9dP_6GxC84aQ",
    basis: "（2026年3月3日時点）\nチャンネル説明欄に、カラオケ音源の使用は自由である旨が明記されているため。"
  }
];

export default function BasisPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={NextLink} href="/" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          PAF-Portal
        </Link>
        <Link component={NextLink} href="/songs" color="inherit" sx={{ display: "flex", alignItems: "center" }}>
          <LibraryMusicIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Songs
        </Link>
        <Typography color="text.primary">利用許諾の根拠</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
        YouTubeチャンネル利用許諾の根拠
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        本ツールで検索対象としているチャンネルは、IRIAM等の配信プラットフォームにおける利用規約および各チャンネルの提示するガイドラインに基づき、
        「歌枠配信」での利用が可能と判断したものです。以下にその根拠を示します。
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="basis table">
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "60px" }}>No.</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", width: "200px" }}>チャンネル名</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>利用可否の根拠</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {BASIS_DATA.map((row) => (
              <TableRow key={row.no} sx={{ '&:nth-of-type(odd)': { backgroundColor: "action.hover" } }}>
                <TableCell>{row.no}</TableCell>
                <TableCell>
                  <Link href={row.url} target="_blank" rel="noopener noreferrer" sx={{ fontWeight: "medium" }}>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ whiteSpace: "pre-wrap", fontSize: "0.875rem" }}>
                  {row.basis}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
        <Typography variant="body2" color="info.contrastText">
          ※ 各チャンネルの方針変更等により利用条件が変更される可能性があります。
          実際の利用にあたっては各チャンネルの最新の概要欄やガイドラインを必ずご確認ください。
        </Typography>
      </Box>
    </Container>
  );
}
