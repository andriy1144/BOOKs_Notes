import express from "express";
import bodyParser from "body-parser";

import { addBook, deleteBookById, getAllBooksFormatted, getBookById, updateBook } from "./services/bookService.js";
import { authorize, checkAuthorized, registration } from "./services/userService.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// // TEMPORARY SOLUTION FOR AUTHORIZATION STATE
// const isLoggedIn = false;

// const checkAuthorized = (req,res,next) => {
//     const allowedEndpoints = ['/login'];

//     if(isLoggedIn || allowedEndpoints.includes(req.url)) next();
//     else{
//         res.redirect("/login");
//     }
// }
app.use(checkAuthorized);


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

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
});