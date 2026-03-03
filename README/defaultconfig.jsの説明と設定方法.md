# URL Command Center  defaultconfig.jsの編集方法

## defaultconfig.js とは何か？
このファイルは
 ボタン・タブ・Backlog連携の初期設定を管理する設定ファイルです。

## defaultconfig.jsの全体構造
window.DEFAULT_CONFIG = {
  sets: {...},              // 手動タブ・ボタン
  settings: {...},          // UI設定
  backlogTemplates: {...},  // Backlog案件URLテンプレ
  backlogApi: {...},         // Backlog APIキー
  autoMysetTemplate: {...}, // 案件自動ボタン
  markdownLinkRules: [...]  // Backlogリンク抽出ルール
};

-------------------------------
## 1. sets（タブ・ボタン定義）
何をする場所？　→ 最初から表示されるボタン集
### 構造
sets: {
  default: {
    title: "媒体URL",
    buttons: [
      { label: "ココアdev", url: "https://dev.cocoa-job.jp/", color: "#FF8DAB" }
    ]
  }
}

**項目**	**意味**
default	   デフォルトタブ
title	   ボタンの文字
url	       開くURL
color      ボタンの色

----------------------------------
## 2. activeSet（起動時のタブ）
"activeSet": "myset1"
⇒拡張機能を開いたときに
最初に表示されるタブID を指定します。

### 例：
"activeSet": "default"

-----------------------------
## 3. settings（UI設定）
"settings": {
  "buttonsOnTop": false,
  "darkBgColor": "#182D46",
  "darkMode": false,
  "darkRainbowBg": false,
  "darkTextColor": "#493a3a",
  "rainbowHover": false
}

**項目**	       **内容**
buttonsOnTop	  設定/閉じるボタンを上部に表示
darkMode	      ダークモードON/OFF
darkBgColor	      ダークモード背景色
darkTextColor	  ダークモード文字色
darkRainbowBg	  背景虹色モード
rainbowHover	  ボタンホバー虹色

----------------------------------
## 4. backlogTemplates（バックログ案件テンプレート）
何をする場所？ → 「例：CCA-1859」 と入力した時の Backlog URL自動生成ルール
### 構造
backlogTemplates: {
  normal: {
    labelPrefix: "CCA-",
    pattern: "https://cor.backlog.com/view/CCA-XXXX"
  }
}


**項目**	    **意味**
labelPrefix     バックログの種類（「CCA-○○」 「CCABUG-」 など）
pattern         生成されるURL(XXXXが入力される数字に変換されます)

### 追加例：
newProject: {
  labelPrefix: "ABC-",
  labelName: "新規PJ",
  pattern: "https://cor.backlog.com/view/ABC-XXXX",
  color: "#00AAFF"
}

----------------------------------
## 5. backlogApi（Backlog自動取得）
何をする場所？ → Backlogタイトル・description取得
### 構造
backlogApi: {
  space: "cor",
  apiKey: "YOUR_API_KEY"
}

**項目**	    **意味**
space           右記参照：https://gyazo.com/62f0eaa100ddb1b271ae1eca53515ae0
apiKey          ご自身のapiキー。  バックログ＞自身のアイコン＞個人設定＞APIから登録します

----------------------------------
## 6. autoMysetTemplate（案件自動ボタン）
何をする場所？→  マイセット名入力時（ 例：CCA-1859）に自動生成するボタン
### 構造
autoMysetTemplate: {
  baseButtons: [
    { label: "仕様書", color: "#fbd460" },
    { label: "XD", color: "#8142b1" }
  ]
}
※label名は markdownLinkRules と一致させる必要あり

----------------------------------
## 7. markdownLinkRules（Backlog URL自動抽出）
何をする場所？　→ Backlogタイトル・description取得するためのルールを設定する
### 構造
markdownLinkRules: [
  { label: "内部QA", matchTitle: /内部.*QA/i, priority: 100 },
  { label: "外部QA", matchTitle: /QA/i, exclude: /内部/i },
]

**項目**	    **意味**
label           autoMysetTemplate のボタン名
matchTitle      URL前の行に含まれる文字
exclude         除外条件
priority        優先順位（大きいほど優先）
pickUrl         URL選別（XD等）

### Backlog記述例と一致判定の流れの例
●【ココア：内部用】QAシート
https://xxx

⇒matchTitle /内部.*QA/ → 内部QAボタンに自動セット

----------------------------------
## 8. tabPrefixRegex（案件判定）
何をする場所？ →  入力が案件か通常タブか判定
### 構造
tabPrefixRegex: "([^/]+)-X"

### 例
**入力**	    **案件扱い**
CCA-1728         true
cca1728          true
あああ            false
CCA-1728 あああ   true

----------------------------------

------------------------------------
## ⚠ 注意事項

### URLは必ず https:// を含める
含まないとボタンが正常に動作しない場合があります。

### 間違って編集したのでもとに戻したい場合は
Googleドライブから再度ダウンロードしてください