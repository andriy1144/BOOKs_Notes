import express from "express";
import bodyParser from "body-parser";

import { addBook, getAllBooksFormatted, updateBook } from "./services/bookService.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res) => {
    try{
        const books = await getAllBooksFormatted();
        res.render("index.ejs", {books: books});
    }catch(error){
        res.status(500).json({error: error});
    }
});

//BOOKS ENDPOINTS
app.post("/book/add", async (req,res) =>{
    try{
        const bookData = req.body;
        await addBook(bookData);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error});
    }
});

app.post("/book/:id/update", async (req,res) => {
    try{
        const id = parseInt(req.params.id);
        const updatedBookData = req.body;
        await updateBook(id,updatedBookData);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});