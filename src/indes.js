import express from "express";
import bodyParser from "body-parser";

import { getAllBooksFormatted } from "./services/bookService.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res) => {
    const books = await getAllBooksFormatted();
    res.render("index.ejs", {books: books});
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});