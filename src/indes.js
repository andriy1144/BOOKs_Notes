import express from "express";
import bodyParser from "body-parser";

import { addBook, deleteBookById, getBookByIdAndUser, updateBook, getAllBooksFormattedByUser } from "./services/bookService.js";
import { authorize, checkAuthorized, registration, getCurrentUserId, logout } from "./services/userService.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.use(checkAuthorized);


app.get("/", async (req,res) => {
    try{
        const user_id = await getCurrentUserId();
        const books = await getAllBooksFormattedByUser(user_id);
        res.render("index.ejs", {books: books});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//BOOKS ENDPOINTS
app.get("/book/:id", async (req,res) => {
    try{
        const id = parseInt(req.params.id);
        const user_id = await getCurrentUserId();
        const book = await getBookByIdAndUser(id, user_id);
        res.render("bookPage.ejs", {pageTitle: book.title,headerTitle: book.title, book: book})
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/book/add", async (req,res) =>{
    try{
        const bookData = req.body;
        const user_id = await getCurrentUserId();
        await addBook(bookData, user_id);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.post("/book/:id/update", async (req,res) => {
    try{
        const id = parseInt(req.params.id);
        const user_id = await getCurrentUserId();
        const updatedBookData = req.body;
        await updateBook(id,updatedBookData, user_id);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/book/:id/delete", async(req,res) => {
    try{
        const id = req.params.id;
        const user_id = await getCurrentUserId();
        await deleteBookById(id, user_id);
        res.redirect("/");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});


// LOGIN AND REGISTRATION ENDPOINTS
app.get("/login", async (req,res) => {
    res.render("login.ejs");
});
app.post("/login", async (req,res) => {
    try{
        const userData = req.body;
        const authorizeRes = await authorize(userData);
        
        if(authorizeRes) res.redirect("/");
    }catch(error){
        res.status(403).json({error: error.message});
    }
});

app.get("/registration", async (req,res) => {
    res.render("registration.ejs");
});

app.post("/registration", async (req,res) => {
    try{
        const userData = req.body;
        const registrationRes = await registration(userData);

        if(registrationRes) res.render("login.ejs", {registrationMessage: "Registration was successful. "});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.get("/logout", async (req,res) => {
    try{
        await logout();
        res.redirect("/login");
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});