"use strict";

const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));

// サブスク（定額サービス）のデータ
let subscriptions = [
  {
    id: 1,
    name: "Netflix",
    category: "動画配信",
    fee: 1490,
    cycle: "毎月",
    memo: "スタンダードプラン。家族で共有。"
  },
  {
    id: 2,
    name: "Spotify",
    category: "音楽配信",
    fee: 980,
    cycle: "毎月",
    memo: "学生プラン適用中。"
  }
];

function findSubById(id) {
  return subscriptions.find(s => s.id === id);
}

// 一覧表示
app.get("/", (req, res) => {
  res.render("list", { subs: subscriptions });
});

// 詳細表示
app.get("/subs/:id", (req, res) => {
  const id = Number(req.params.id);
  const sub = findSubById(id);
  if (!sub) {
    res.status(404).send("指定されたIDのサブスクが見つかりません");
    return;
  }
  res.render("detail", { sub: sub });
});

// 新規作成フォーム
app.get("/create", (req, res) => {
  res.render("form", {
    sub: null,
    action: "/create"
  });
});

// 新規作成処理
app.post("/create", (req, res) => {
  const nextId = subscriptions.length > 0 ? subscriptions[subscriptions.length - 1].id + 1 : 1;
  const sub = {
    id: nextId,
    name: req.body.name || "",
    category: req.body.category || "",
    fee: Number(req.body.fee || 0),
    cycle: req.body.cycle || "",
    memo: req.body.memo || ""
  };
  subscriptions.push(sub);
  res.redirect("/");
});

// 編集フォーム
app.get("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const sub = findSubById(id);
  if (!sub) {
    res.status(404).send("指定されたIDのサブスクが見つかりません");
    return;
  }
  res.render("form", {
    sub: sub,
    action: "/edit/" + id
  });
});

// 編集処理
app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const sub = findSubById(id);
  if (!sub) {
    res.status(404).send("指定されたIDのサブスクが見つかりません");
    return;
  }
  sub.name = req.body.name || "";
  sub.category = req.body.category || "";
  sub.fee = Number(req.body.fee || 0);
  sub.cycle = req.body.cycle || "";
  sub.memo = req.body.memo || "";
  res.redirect("/subs/" + id);
});

// 削除処理
app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  subscriptions = subscriptions.filter(s => s.id != id);
  res.redirect("/");
});

// 404
app.use((req, res, next) => {
  res.status(404).send("ページが見つかりません");
});

// ポート8080で待ち受け
app.listen(8080, () => {
  console.log("subs_app: 8080番ポートで待ち受け中");
});
