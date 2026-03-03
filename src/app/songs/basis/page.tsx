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
    basis: "（2026年3月3日時点）\nいくつかの動画の概要欄に以下の記載があったため。\n他のカラオケ音源の動画についても同様に記載されている可能性が高いと判断。\nーーー\n🎤 この動画について\n本動画に収録されているカラオケ音源は、電楽都市が制作をし、原盤権を保有しております。\n企業・個人を問わずご自由にご利用いただけます。\n予告なく削除される場合もございますのであらかじめご了承ください。\n収益化は行っておりません。\n\n✅ 利用条件\n・YouTubeや各種配信プラットフォームでの配信、動画での利用可とします。\n・商用利用（収益化を含む）可とします。\n・利用にあたり、電楽都市への連絡・許諾は不要です。\n・使用の際、可能な範囲でクレジット記載をお願いします。"
  },
  {
    no: 2,
    name: "生音風カラオケ屋",
    url: "https://www.youtube.com/channel/UCZ3ryrdsdqezi2q-AfRw6Rw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nこのチャンネルでは歌い手さんや、本格的なサウンドで歌の練習をしたい方のために、\nDTMで編集した生音風のカラオケ・伴奏を提供しています！\n当チャンネルで作成した音源をご利用される場合は動画かチャンネルページへのリンクを貼っていただくようお願いいたします！🙏\n※IRIAM等リンクができないプラットフォームではURL貼り付けは結構です\n\n個人の方でしたら、権利者さまの認める範囲内で配信やオフラインのイベント等でお使いいただいて結構です。法人・団体所属の場合は、下記メールアドレスよりご所属先の担当者さまからご連絡いただけますと幸いです"
  },
  {
    no: 3,
    name: "Mick",
    url: "https://www.youtube.com/channel/UCep27mxUiDB2XBOYeUma8dA",
    basis: "（2026年3月3日時点）\nファンティア( https://fantia.jp/products/962692 )の説明欄に以下の記載があったため。\nーーー\n最新曲（J-pop、アニソン、ボカロ）などのカラオケ音源を自作し、YouTubeにて公開しています。 歌ってみたや各種SNSへの投稿、イベントやライブでもお使いいただけます。"
  },
  {
    no: 4,
    name: "カラオケ制作所「BOX」📦🎹",
    url: "https://www.youtube.com/channel/UCmfr4S8C_jFNDsTBqfKhcXA",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n・音源は「歌ってみた」などのBGM用途、歌枠配信などにお使いいただけます！\n・以下リンク「音源利用ガイドライン」に記載の範囲内では【無償でお使いいただけます】。また、収益化いただくことも可能ですが、投稿・配信先のプラットフォームが定めるガイドラインを遵守いただくようお願いいたします。\n・このチャンネルは趣味を通じた個人運営のものであり、収益性は重要視しておりません。そのため音源のご利用を有償化する検討はございません。\n詳細はリンク「音源利用ガイドライン」をご覧ください。\nーーー\n音源利用ガイドライン\nhttps://www.saund-box.com/karaoke_box/guideline.php"
  },
  {
    no: 5,
    name: "カラオケ再現所@KEISUKEO.",
    url: "https://www.youtube.com/channel/UCUo8aHsNE4__8ZUxAmdhqLA",
    basis: "（2026年3月3日時点）\n音源利用ガイドライン( https://www.saund-box.com/karaoke_box/guideline.php )に以下の記載があったため。\nーーー\n本ガイドラインの適用範囲\n◆「カラオケ再現所＠KEISUKEO.」（旧チャンネル）\n当チャンネルで配信している音源について\n当チャンネルにアップロードされている音源は、特別な表示がない限り打ち込みによる当チャンネル制作のオリジナル音源で、原曲音源ではありません。 \nご利用いただける用途\n当チャンネルの音源は、以下に定める範囲でご利用いただけます。\n〇 「歌枠配信」で歌のBGMとして利用すること（有料配信を含みます）"
  },
  {
    no: 6,
    name: "カラオケ@DIVA",
    url: "https://www.youtube.com/channel/UCOgOuWBAQ1GXj_gfYHOUOcA",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nカラオケ@DIVAでは、ヒット曲を中心に高音質・高画質にこだわったカラオケ練習用動画を配信中！\nQ.有料のライブ配信で音源を使用してもよいですか？\nA.スパチャ（投げ銭）、ツイキャスのプレミア配信など有料のライブ配信にも音源を使用できます。"
  },
  {
    no: 7,
    name: "entame rise",
    url: "https://www.youtube.com/channel/UC-TW5XiEDvlyPEyMZSz8Cxg",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n歌ってみた・演奏してみたの伴奏音源に使って頂きありがとうございます。\n配信・ライブでの音源のご利用ありがとうございます。\nライズDTM　音源は、MIDIで制作。ブログでは、歌詞も掲載しています。\n歌ってみた・演奏してみたを応援しています。\n音源の使用は、大歓迎です。"
  },
  {
    no: 8,
    name: "アルタエース-カラオケ制作・芸能マネジメントチャンネル",
    url: "https://www.youtube.com/channel/UC7fyuQSXC8wIqH-CwvRup-Q",
    basis: "（2026年3月3日時点）\n音源ダウンロードページ( https://altaaceentertainment.blogspot.com/ )にて以下の記載があったため\nーーー\n歌ってみた　ライブ配信など利用OK!! 原曲クオリティそのままのカラオケ音源、検索サイト。 （キー変更・オフボーカル）\nアルタエースが提供する原曲に近い高音質のカラオケ音源無料配布サイト。サンプルはYouTubeにてアルタエースと検索！"
  },
  {
    no: 9,
    name: "ユウ",
    url: "https://www.youtube.com/channel/UCL9lulyqd7z-St6uvEdmqpw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n自作のカラオケ音源，カラオケ動画を投稿しています（ピアノ伴奏が多め）. \n\n◻️音源のご利用について\n　収益化の有無，個人や法人（所属の個人）に関係なく，無料でご自由にご使用いただけます．\n　YouTube以外の配信アプリやライブ，コンサートでのご利用についても同様です．\n　（該当する場における著作権管理団体との許諾契約についてはご確認をお願いいたします．）"
  },
  {
    no: 10,
    name: "小さな音楽部屋",
    url: "https://www.youtube.com/channel/UCqDmeqMPiltISgFQDUI7NKw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n個人制作のインスト、カラオケ音源、オリジナル曲をアップしているチャンネルです。\n歌ってみたや歌枠、配信BGM等にご利用ください。\n\n音源をご利用いただいた方は、チャンネル登録、高評価をしていただけると励みになります！"
  },
  {
    no: 11,
    name: "カラオケ音源とかのやつ",
    url: "https://www.youtube.com/channel/UCxaw9r7yNwlSaH6f4LETeQw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nなお現時点では、IRIAMでの配信時に出典やクレジットを記入できる機能が無いため、表示することが出来ない。。。\nーーー\n■カラオケ音源をご使用の場合\n　　投稿する動画等に当チャンネルのURL記入をお願いしております。\n　　お手数ですがよろしければ何卒ご記入お願いいたします！\n　　　　　URL→youtube.com/@karaoke_toka\n　　たまにURLで検索して楽しく視聴させていただいております、\n　　いつもご利用ありがとうございます！\n　　　\n　　　※一部 ”歌ってみた” でのご使用ができない音源があります。\n　　　　該当動画の概要欄にその旨記載しておりますので、お手数ですが\n　　　　ご確認をお願いします！\n\n　　　※収益関連につきましての制限等は特にありません。\n　　　　どうぞお気軽ご利用いただけますと幸いです！(2025.8.11追記)"
  },
  {
    no: 12,
    name: "JPOP Karaoke カラオケ",
    url: "https://www.youtube.com/channel/UCTT44jmy7-pIGKpy-Ih8NyA",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nなお現時点では、IRIAMでの配信時に出典やクレジットを記入できる機能が無いため、表示することが出来ない。。。\nーーー\n★オリジナルのカラオケ練習用動画を配信しています！\n※二次使用もできますので原本のYouTube URLを残してください。"
  },
  {
    no: 13,
    name: "SuzuJun Ch. すずじゅん♪",
    url: "https://www.youtube.com/channel/UC8BrKZbNXiNVEBiiD-OzZ0Q",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n趣味でDTMで演奏などを行っており、普段はnana musicで投稿をしています。\n投稿した伴奏にカラオケ字幕などを素人レベルですが付けてYouTubeに\n投稿したりしてます。\n最近は僕のDTM伴奏を使って活動者様が歌ってみたや\n歌枠で使っていただくこともあり、ありがたいです。"
  },
  {
    no: 14,
    name: "スウェット",
    url: "https://www.youtube.com/channel/UCCrxMkIxHHA89SWH1Od6g8Q",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nなお現時点では、IRIAMでの配信時に出典やクレジットを記入できる機能が無いため、表示することが出来ない。。。\nーーー\nカラオケ（off vocal）を作っています。\n【動画（音源）の使用について】\n誰でもフリーでご利用いただけます。\n使用する際は、投稿した動画の概要欄やコメント欄などで \"当チャンネル名\" と \"引用元の動画URL\" を記載していただけると幸いです。"
  },
  {
    no: 15,
    name: "まがいもの商事株式会社",
    url: "https://www.youtube.com/channel/UCW-yyUvoFLBS28gR32a2Xmw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n■事業内容：高音質DTMカラオケ音源の作制。\n楽器の演奏やカラオケの練習などに使ってもらえると嬉しいです...^^\n■公開中のカラオケ音源を使用する場合の許可は一切不要です。クレジット表示が必用な場合は、https://www.youtube.com/c/まがいもの商事株式会社"
  },
  {
    no: 16,
    name: "オフボ屋🎸Dagger Hearts【ダガーハーツ】",
    url: "https://www.youtube.com/channel/UCimDQtrwmDKPzgi5rRaAfCg",
    basis: "（2026年3月3日時点）\nとある動画のコメント欄で以下の記載があったため。\nーーー\n「こちらの音源をIRIAMの歌枠にて活用させて頂いてもよろしいでしょうか？(>_<)」に「Yes」の回答\nーーー\n※ どの動画か忘れてしまった..."
  },
  {
    no: 17,
    name: "HiroK Inst Channel",
    url: "https://www.youtube.com/channel/UCojHiDbqtlYU089qIwKpJsw",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nなお現時点では、IRIAMでの配信時に出典やクレジットを記入できる機能が無いため、表示することが出来ない。。。\nーーー\n個人制作のオリジナルカラオケ音源紹介のチャンネルです。\n歌ってみた動画やカバー動画、楽器演奏動画等にご利用ください。\n\n音源ご使用いただいた方は、チャンネル登録をしていたいただけると幸いです。\n投稿動画のURLをコメントなどに記載いただけると嬉しいです！\nーーー\nまたコメント欄での「歌枠での利用報告」に対して「❤️」のリアクションを返している。"
  },
  {
    no: 18,
    name: "チャンネルぴー助",
    url: "https://www.youtube.com/channel/UCK0NOAXbYo5-h6Sdu3RLBGQ",
    basis: "（2026年3月3日時点）\nハートの主張カラオケ音源の動画( https://www.youtube.com/watch?v=rbohk_RA1tQ )のコメント欄にて以下のやり取りがあったため。\nーーー\n歌枠で使用させていただきました🌸\nこの曲とーっても好きだったので見つけた時嬉しかったです☺️💐\n素敵な伴奏をお借りしました💫ありがとうございました！\n↓\n見に行きました☺️\n使ってくださりありがとうございます。\n他にも色々と歌われてましたがどれもとっても素敵でした✨\nこれからも動画投稿頑張って下さい"
  },
  {
    no: 19,
    name: "SORA 初良 生演奏 カラオケ ちゃんねる Instrumental covers channel",
    url: "https://www.youtube.com/channel/UCMqgnW7zcdlZncFFoHowh2Q",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n全楽器…耳コピ…ﾒﾝﾄﾞｸｻｲ(　ﾟдﾟ)\n歌ってみたや、チャンネルのBGMに使いたい方は自由に使ってください。\n\n使う際にチャンネル登録、高評価、チャンネルの宣伝、URLで誘導などのはしなくて大丈夫です\n\nが\n\nもし著作権者に許可が必要な場合はそちらに許可をとってください"
  },
  {
    no: 20,
    name: "リミックス[音源配布中] Remix Audio Link in the Comments",
    url: "https://www.youtube.com/channel/UCvhmtvxxSP0F4iqWIfSnN6Q",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nコメント欄にてアップしている音源配布しています♪\nご自由にお使いください"
  },
  {
    no: 21,
    name: "isBlank",
    url: "https://www.youtube.com/channel/UCmK08xAeFLE3qgypIH4HHQw",
    basis: "（2026年3月3日時点）\n対象a (Inst)の動画( https://www.youtube.com/watch?v=_2xdL3j21FE )のコメント欄にて歌枠での利用に肯定的な返答があったため。\nーーー\n歌枠配信にて音源をお借りします。素敵な音源をありがとうございます！\n↓\n返信が遅くなり申し訳ありません。\n使っていただき、ありがとうございます(^^"
  },
  {
    no: 22,
    name: "Yossy",
    url: "https://www.youtube.com/channel/UCIuMN-FGE1B7OyKKxggJ2Dg",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nボカロ、アニソン、J-POPのピアノカラオケ集です\n歌ってみたや演奏してみた、BGM等ご自由にお使いください"
  },
  {
    no: 23,
    name: "Hiro’s Piano Arrangement",
    url: "https://www.youtube.com/channel/UCWX2b3xIeJHoiNOPd9nTuKA",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nJ-POPのピアノ伴奏を、オリジナルアレンジで公開しています。\n全曲、男声・女声用にキーを設定しています。\nカラオケ練習やカバー動画の投稿、生配信、ライブ等ご自由にお使いください！"
  },
  {
    no: 24,
    name: "ハイブリッジ",
    url: "https://www.youtube.com/channel/UCR4L9Gl7hkHw44gZR5vLn4Q",
    basis: "（2026年3月3日時点）\n各動画のコメント欄を見る限り歌枠で多く利用されておりコメントに対して「❤️」で返しているため"
  },
  {
    no: 25,
    name: "星海ハル",
    url: "https://www.youtube.com/channel/UCpHRdO77UDchUGe5XkDnyrA",
    basis: "（2026年3月1日時点）\nBALALAIKAの動画( https://www.youtube.com/watch?v=lcvtWw2lbl8 )にて「こちらの素敵な音源を歌枠配信にて使用させていただいてもよろしいでしょうか、？」のコメントに対して「良いですよ！気に入っていただけたのであれば幸いです✨️」のコメントがあったため。"
  },
  {
    no: 26,
    name: "HoneyWorks 2nd Channel",
    url: "https://www.youtube.com/channel/UCfuBLr03CN1OWKP0XS5GqFA",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n・歌ってみたなどの二次創作について。\nHoneyWorks公認というわけではございませんが、歌ってみたなどの動画公開に対しHoneyWorksとしては制限はしておりません。ご自由にinstを使用ください。"
  },
  {
    no: 27,
    name: "(^^)・・・つ",
    url: "https://www.youtube.com/channel/UCv6cA8lChl-z3OC_RcqsduQ",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\n元の著作権者様の許可の範囲内で、ご自由にお使いください！"
  },
  {
    no: 28,
    name: "negoto@ ฅ۶•ﻌ•♡ฅ",
    url: "https://www.youtube.com/channel/UC3EXlgN50es9dP_6GxC84aQ",
    basis: "（2026年3月3日時点）\nチャンネルの説明欄に以下の記載があったため。\nーーー\nカラオケ音源の使用は自由です。\nJASRAC申請などは各自。"
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
                  {row.basis.split(/(https?:\/\/[^\s\n)]+)/g).map((part, i) => {
                    if (part.match(/^https?:\/\//)) {
                      return (
                        <Link key={i} href={part} target="_blank" rel="noopener noreferrer">
                          {part}
                        </Link>
                      );
                    }
                    return part;
                  })}
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
