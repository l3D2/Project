const express = require("express");
const api_category = express.Router();
const database = require("../Database/db_module");

api_category.post("/category", async (req, res) => {
  let body = req.body;
  try {
    database.query_sql("INSERT INTO Category (acc_id, name) VALUES (?, ?)", [
      body.account_id,
      body.name,
    ]);
    res.send("Category Created Successfully.").status(200);
  } catch (err) {
    console.error("Error Creating Category.\n", err.message);
    res.send("Error Creating Category.").status(500);
  }
});
api_category.post("/category", async (req, res) => {
  let body = req.body;
  let result;
  try {
    result = database.query_sql("SELECT * FROM Category WHERE acc_id = ?", [
      body.account_id,
    ]);
    res.send(result).status(200);
  } catch (err) {
    console.error("Error Fetching Categories.\n", err.message);
    res.send("Error Fetching Categories.").status(500);
  }
});
api_category.put("/category", async (req, res) => {
  let body = req.body;
  try {
    database.query_sql("UPDATE Category SET name = ? WHERE id = ?", [
      body.name,
      body.id,
    ]);
    res.send("Category Updated Successfully.").status(200);
  } catch (err) {
    console.error("Error Updating Category.\n", err.message);
    res.send("Error Updating Category.").status(500);
  }
});
api_category.delete("/category", async (req, res) => {
  let body = req.body;
  try {
    database.query_sql("DELETE FROM Category WHERE id = ?", [body.id]);
    res.send("Category Deleted Successfully.").status(200);
  } catch (err) {
    console.error("Error Deleting Category.\n", err.message);
    res.send("Error Deleting Category.").status(500);
  }
});
