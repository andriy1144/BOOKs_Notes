import db from "../database.js"
import { formatDate } from "../utils/dateUtils.js";


db.connect();

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

export async function updateBook(id,updatedBookData){
    try{
        await db.query("UPDATE books SET title = $1, description = $2, rating = $3, isbn = $4, start_reading_date = $5, end_reading_date = $6, link = $7 WHERE id = $8",
            [
                updatedBookData?.title, 
                updatedBookData?.description,
                updatedBookData?.rating,
                updatedBookData?.isbn,
                updatedBookData?.start_reading_date,
                updatedBookData?.end_reading_date,
                updatedBookData?.link,
                id
            ]
        );
    }catch(error){
        console.error(`ERROR/ updateBook(updateBookData): ${error}`)
        throw error;
    }
}