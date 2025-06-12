import db from "../database.js"
import { formatDate } from "../utils/dateUtils.js";

async function formatBooksData(booksData){
    booksData.forEach(book => {
        book.start_reading_date = formatDate(book.start_reading_date);
        if(book.end_reading_date) book.end_reading_date = formatDate(book.end_reading_date);
    });
    return booksData;
}

export async function getAllBooks(){
    try{
        const res = await db.query("SELECT * FROM books ORDER BY title ASC");
        return res.rows;
    }catch(error){
        console.error(`ERROR/ getAllBooks(): ${error}`);
        throw error;
    }
}

export async function getAllBooksFormatted(){
    try{
        const books = await getAllBooks();
        return formatBooksData(books);
    }catch(error){
        console.error(`ERROR/ getAllBooksFormatted(): ${error}`);
        throw error;
    }
}

export async function getAllBooksFormattedByUser(userId){
    try{
        const res = await db.query("SELECT * FROM books WHERE user_id = $1", [userId]);
        return formatBooksData(res.rows);
    }catch(error){
        console.error(`ERROR/ getAllBooksFormatted(): ${error}`);
        throw error;
    }
}

export async function getBookById(id){
    try{
        const res = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        if(res.rows.length < 1) throw new Error(`Book with id: ${id} - was not found!`)
        const formattedBookData = await formatBooksData(res.rows);
        return formattedBookData[0];
    }catch(error){
        console.error(`ERROR/ getBookById(id): ${error}`);
        throw error;
    }
}

export async function getBookByIdAndUser(id, user_id){
    try{
        const res = await db.query("SELECT * FROM books WHERE id = $1 AND user_id = $2", [id, user_id]);
        if(res.rows.length < 1) throw new Error(`Book with id: ${id} and user_id: ${user_id} - was not found!`)
        const formattedBookData = await formatBooksData(res.rows);
        return formattedBookData[0];
    }catch(error){
        console.error(`ERROR/ getBookById(id): ${error}`);
        throw error;
    }
}

export async function updateBook(id,updatedBookData, user_id){
    try{
        await db.query("UPDATE books SET title = $1, description = $2, rating = $3, isbn = $4, start_reading_date = $5, end_reading_date = $6, link = $7 WHERE id = $8 AND user_id = $9",
            [
                updatedBookData?.title, 
                updatedBookData?.description,
                updatedBookData?.rating,
                updatedBookData?.isbn,
                updatedBookData?.start_reading_date,
                updatedBookData?.end_reading_date,
                updatedBookData?.link,
                id,
                user_id
            ]
        );
    }catch(error){
        console.error(`ERROR/ updateBook(updateBookData): ${error}`)
        throw error;
    }
}

export async function addBook(bookData, user_id){
    try{
        await db.query("INSERT INTO books(title, description, rating, isbn, start_reading_date, end_reading_date, link, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [
                bookData?.title, 
                bookData?.description,
                bookData?.rating,
                bookData?.isbn,
                bookData?.start_reading_date,
                bookData?.end_reading_date, //FIX IN FUTURE TO ADD ABILITY UPLOADING BOOKS WITH NULL END_READING_DATE
                bookData?.link,
                user_id 
            ]
        );
    }catch(error){
        console.error(`ERROR/ addBook(bookData): ${error}`)
        throw error;
    }
}

export async function deleteBookById(id, user_id) {
    try{
        await db.query("DELETE FROM books WHERE id = $1 AND user_id = $2", [id, user_id]);
    }catch(error){
        console.error(`ERROR/ addBook(bookData): ${error}`)
        throw error;
    }
}