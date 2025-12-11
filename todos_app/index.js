"use strict";

const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));

// ToDoのデータ
let todos = [
  {
    id: 1,
    title: "レポートの要件整理",
    priority: "高",
    done: false,
    memo: "授業スライドを読み直して仕様を確認する。"
  },
  {
    id: 2,
    title: "部屋の片付け",
    priority: "中",
    done: true,
    memo: "午前中に完了。"
  }
];

function findTodoById(id) {
  return todos.find(t => t.id === id);
}

// 一覧表示
app.get("/", (req, res) => {
  res.render("list", { todos: todos });
});

// 詳細表示
app.get("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = findTodoById(id);
  if (!todo) {
    res.status(404).send("指定されたIDのToDoが見つかりません");
    return;
  }
  res.render("detail", { todo: todo });
});

// 新規作成フォーム
app.get("/create", (req, res) => {
  res.render("form", {
    todo: null,
    action: "/create"
  });
});

// 新規作成処理
app.post("/create", (req, res) => {
  const nextId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
  const todo = {
    id: nextId,
    title: req.body.title || "",
    priority: req.body.priority || "中",
    done: req.body.done === "on",
    memo: req.body.memo || ""
  };
  todos.push(todo);
  res.redirect("/");
});

// 編集フォーム
app.get("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = findTodoById(id);
  if (!todo) {
    res.status(404).send("指定されたIDのToDoが見つかりません");
    return;
  }
  res.render("form", {
    todo: todo,
    action: "/edit/" + id
  });
});

// 編集処理
app.post("/edit/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = findTodoById(id);
  if (!todo) {
    res.status(404).send("指定されたIDのToDoが見つかりません");
    return;
  }
  todo.title = req.body.title || "";
  todo.priority = req.body.priority || "中";
  todo.done = req.body.done === "on";
  todo.memo = req.body.memo || "";
  res.redirect("/todos/" + id);
});

// 削除処理
app.post("/delete/:id", (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.redirect("/");
});

// 404
app.use((req, res, next) => {
  res.status(404).send("ページが見つかりません");
});

// ポート8080で待ち受け
app.listen(8080, () => {
  console.log("todos_app: 8080番ポートで待ち受け中");
});
