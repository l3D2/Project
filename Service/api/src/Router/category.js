const express = require("express");
const api_category = express.Router();
const database = require("../Database/db_module");

api_category.post("/category", async (req, res) => {
  const body = req.body;
  let result;

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  } else if (!body.uid || !body.name) {
    return res.status(400).send("Body is missing parameter.");
  } else if (body.uid == "" || body.name == "") {
    return res.status(400).send("Body is missing parameter.");
  }

  try {
    result = await database.query_sql(
      `INSERT INTO Category (acc_id, name) VALUES ('${body.uid}', '${body.name}')`
    );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Category Created Successfully.", status: 200 });
    } else {
      res
        .status(200)
        .json({ message: "Category Created Failed.", status: 500 });
    }
  } catch (err) {
    console.error("Error Creating Category.\n", err.message);
    res.send("Error Creating Category.").status(500);
  }
});

api_category.get("/category/:userid", async (req, res) => {
  const userid = req.params.userid;
  let result;
  try {
    result = await database.query_sql(
      `SELECT id,name FROM Category WHERE acc_id = '${userid}'`
    );
    if (result.length > 0) res.json(result).status(200);
    else res.status(200).json({ message: "Category not found.", status: 404 });
  } catch (err) {
    console.error("Error Fetching Categories.\n", err.message);
    res.send("Error Fetching Categories.").status(500);
  }
});

api_category.put("/category", async (req, res) => {
  const body = req.body;
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }
  console.log(body);
  try {
    result = await database.query_sql(
      `UPDATE Category SET name = '${body.name}' WHERE id = '${body.id}'`
    );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Category Updated Successfully.", status: 200 });
    } else {
      res
        .status(200)
        .json({ message: "Category Updated Failed.", status: 500 });
    }
  } catch (err) {
    console.error("Error Updating Category.\n", err.message);
    res.send("Error Updating Category.").status(500);
  }
});

api_category.delete("/category", async (req, res) => {
  const body = req.body;
  let result;
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).send("Body is empty.");
  }

  try {
    result = await database.query_sql(
      `DELETE FROM Category WHERE id = ${body.catid}`
    );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Category Deleted Successfully.", status: 200 });
    } else {
      res
        .status(200)
        .json({ message: "Category Deleted Failed.", status: 500 });
    }
  } catch (err) {
    console.error("Error Deleting Category.\n", err.message);
    res.send("Error Deleting Category.").status(500);
  }
});

module.exports = api_category;
