"use strict";

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

let tasks = [
  {
    id: 1,
    title: "Webプログラミング レポート仕様書",
    course: "Webプログラミング",
    type: "レポート",
    dueDate: "2025-01-31",
    status: "未提出",
    memo: "京葉線以外に3つの一覧表示アプリを設計・実装する。"
  },
  {
    id: 2,
    title: "線形代数 小テスト",
    course: "線形代数",
    type: "テスト",
    dueDate: "2025-01-20",
    status: "勉強中",
    memo: "教科書第3章までを復習。"
  }
];

function findTaskById(id) {
  return tasks.find(t => t.id === id);
}

app.get("/", (req, res) => {
  res.render("list", { tasks: tasks });
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTaskById(id);
  if (!task) {
    res.status(404).send("指定されたIDの課題が見つかりません");
    return;
  }
  res.render("detail", { task: task });
});

app.get("/create", (req, res) => {
  res.render("form", {
    task: null,
    action: "/create"
  });
});

app.post("/create", (req, res) => {
  const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
  const task = {
    id: nextId,
    title: req.body.title || "",
    course: req.body.course || "",
    type: req.body.type || "",
    dueDate: req.body.dueDate || "",
    status: req.body.status || "未提出",
    memo: req.body.memo || ""
  };
  tasks.push(task);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTaskById(id);
  if (!task) {
    res.status(404).send("指定されたIDの課題が見つかりません");
    return;
  }
  res.render("form", {
    task: task,
    action: "/edit/" + id
  });
});

app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTaskById(id);
  if (!task) {
    res.status(404).send("指定されたIDの課題が見つかりません");
    return;
  }
  task.title = req.body.title || "";
  task.course = req.body.course || "";
  task.type = req.body.type || "";
  task.dueDate = req.body.dueDate || "";
  task.status = req.body.status || "未提出";
  task.memo = req.body.memo || "";
  res.redirect("/tasks/" + id);
});

app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.redirect("/");
});

app.use((req, res, next) => {
  res.status(404).send("ページが見つかりません");
});

app.listen(8080, () => {
  console.log("tasks_app: 8080番ポートで待ち受け中");
});