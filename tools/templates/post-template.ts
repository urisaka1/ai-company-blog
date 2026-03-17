// 記事生成用テンプレート定義
// キーワードに応じた記事のスケルトンを構築する

// 見出しテンプレート：キーワードの分野に応じた汎用的なh2構成
export const SECTION_TEMPLATES = [
  {
    id: "intro",
    headingTemplate: "{{keyword}}とは？基本を理解しよう",
    description: "キーワードの概要・定義・背景を説明するセクション",
    guideText:
      "【ここに本文を記述】このセクションでは「{{keyword}}」の基本概念、背景、なぜ今注目されているかを300〜500字で解説してください。具体的な数字やデータを含めると説得力が増します。",
  },
  {
    id: "merit",
    headingTemplate: "{{keyword}}のメリットと活用シーン",
    description: "メリットや具体的な活用場面を紹介するセクション",
    guideText:
      "【ここに本文を記述】「{{keyword}}」を活用するメリットを3〜5個、具体的な活用シーンとともに300〜500字で解説してください。実際のツール名や事例を含めてください。",
  },
  {
    id: "howto",
    headingTemplate: "{{keyword}}の始め方・具体的な手順",
    description: "ステップバイステップの手順を示すセクション",
    guideText:
      "【ここに本文を記述】「{{keyword}}」を始めるための具体的な手順をステップ形式で300〜500字で解説してください。必要なツール、設定方法、コマンドなどを含めてください。",
  },
  {
    id: "tips",
    headingTemplate: "{{keyword}}を使いこなすコツと注意点",
    description: "実践的なTipsや注意点を紹介するセクション",
    guideText:
      "【ここに本文を記述】「{{keyword}}」を使う上でのコツ、ベストプラクティス、よくある失敗と対策を300〜500字で解説してください。",
  },
  {
    id: "tools",
    headingTemplate: "{{keyword}}に役立つおすすめツール・サービス",
    description: "関連ツールやサービスを紹介するセクション",
    guideText:
      "【ここに本文を記述】「{{keyword}}」に関連するおすすめツール・サービスを3〜5個、料金や特徴とともに300〜500字で紹介してください。",
  },
  {
    id: "summary",
    headingTemplate: "まとめ",
    description: "記事全体のまとめと次のアクション",
    guideText:
      "【ここに本文を記述】記事の要点を3〜5行で振り返り、読者が次に取るべきアクションを提示してください。200〜300字程度。",
  },
];

// フロントマターテンプレート
export function buildFrontmatter(params: {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}): string {
  return [
    "---",
    `title: "${params.title}"`,
    `description: "${params.description}"`,
    `date: "${params.date}"`,
    `tags: [${params.tags.map((t) => `"${t}"`).join(", ")}]`,
    `thumbnail: ""`,
    "---",
  ].join("\n");
}

// 見出しテンプレートにキーワードを適用
export function applyKeyword(template: string, keyword: string): string {
  return template.replace(/\{\{keyword\}\}/g, keyword);
}
