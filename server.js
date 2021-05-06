const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(process.env.DB_STRING, { useUnifiedTopology: true }).then(
  client => {
    console.log("Connected to DB");
    const db = client.db("star-wars");
    const quotesCollection = db.collection("quotes");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));

    app.set("view engine", "ejs");

    app.get("/", (req, res) => {
      const cursor = db
        .collection("quotes")
        .find()
        .toArray()
        .then(results => {
          console.log(results);
          res.render("index.ejs", { quotes: results });
        })
        .catch(error => console.error(error));
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect("/");
        })
        .catch(error => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
          res.json("Success");
        })
        .catch(error => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vadar Quote");
        })
        .catch(error => console.error(error));
    });
  }
);

app.listen(process.env.PORT || 4000, () => {
  console.log("Listening on 3000");
});
