const express = require("express");
const app = express();
const mongoose = require("mongoose");

const TodoList = require("./model/todoList");

const dotenv = require("dotenv");
dotenv.config();

//app.use("/static/styles", express.static("style"));
app.use(express.urlencoded({ extended: true }));

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to DB ");
  const PORT = process.env.PORT || 80; 
  app.listen(PORT, () => console.log(`Server is running at port : ${PORT}`));
});

app.set("view engine", "ejs");

//---- search/retrieve all todos -----
app.get("/", (req, res) => {
  TodoList.find({}, null, { sort: {date: -1} }, (err, tasks) => {
    //console.log(`tasks: ${tasks}`);    
    res.render("todoView.ejs", { todoTasks: tasks});
  });
});


// ------ add todo ----
app.post("/", async (req, res) => {
  const todoTask = new TodoList({
    content: req.body.content
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    
    TodoList.find({}, null, { sort: {date: -1} }, (err, tasks) => {
      res.render("editTodo.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoList.findByIdAndUpdate(id, { content: req.body.content }, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });


 //----- remove todo ----- 
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoList.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});


// -----toggle status ----
app.route("/toggle-status/:id/:completed").get((req, res) => {
    const id = req.params.id;
    const completed = req.params.completed;

    //console.log(`req.params: ${JSON.stringify(req.params)}`);
    
    TodoList.findByIdAndUpdate(id, { completed: completed }, err => {
        if (err) 
            return res.send(500, err);

        res.redirect("/");
      });

  });
  