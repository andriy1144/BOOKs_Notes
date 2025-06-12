import express from "express";
import bodyParser from "body-parser";

import { addBook, deleteBookById, getAllBooksFormatted, getBookById, updateBook } from "./services/bookService.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req,res) => {
    try{
        const books = await getAllBooksFormatted();
        res.render("index.ejs", {books: books});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//BOOKS ENDPOINTS
app.get("/book/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const book = await getBookById(id);
        res.render("bookPage.ejs", {pageTitle: book.title,headerTitle: book.title, book: book})
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/book/add", async (req,res) =>{
    try{
        const bookData = req.body;
        await addBook(bookData);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/book/:id/update", async (req,res) => {
    try{
        const id = parseInt(req.params.id);
        const updatedBookData = req.body;
        await updateBook(id,updatedBookData);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/book/:id/delete", async(req,res) => {
    try{
        const id = req.params.id;
        await deleteBookById(id);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});