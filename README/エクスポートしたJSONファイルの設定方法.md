# URL Command Center エクスポートしたJSONファイルの編集方法

## 0. 概要
URL Command Center 拡張機能では、
設定内容（タブ・ボタン・UI設定）を JSONファイルとしてエクスポート / インポート できます。

このドキュメントでは、
エクスポートされたJSONの構造と編集方法 を説明します。 

## JSONファイルの全体構造
window.DEFAULT_CONFIG = {
  sets: {...},              // 手動タブ・ボタン
  activeSet					//起動時のタブを指定
  settings: {...},          // UI設定

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

※特になければdefaultのままで大丈夫です。
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

----------------------------------
##   JSONのカスタマイズ方法

### タブを追加する
"myset4": {
  "title": "新規案件",
  "buttons": []
}

### ボタンを追加する
{
  "label": "管理画面",
  "url": "https://example.com/admin",
  "color": "#ff0000"
}

### ダークモードをデフォルトONにする
"darkMode": true

-----------------------------------
## JSONの適用方法（インポート）

設定画面を開く
↓
「設定をインポート」をクリック
↓
編集したJSONファイルを選択 ※JSONがエクスポートされていること
↓
即時反映されます

------------------------------------
## ⚠ 注意事項
### JSON形式が壊れると読み込み不可
カンマ抜け
ダブルクォート不足
コメント不可

### URLは必ず https:// を含める
含まないとボタンが正常に動作しない場合があります。