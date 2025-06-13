import db from "../database.js"
import { formatDate, getCurrentFormatDate } from "../utils/dateUtils.js";

async function formatNotesData(notesData){
    notesData.forEach(note => {
        note.note_date = formatDate(note.note_date);
    });
    return notesData;
}

export async function getNotesByBookId(book_id){
    try{
        const res = await db.query("SELECT * FROM notes WHERE book_id = $1", [book_id]);
        return formatNotesData(res.rows);
    }catch(error){
        console.error(`ERROR/ getNotesByBookId(book_id): ${error}`)
        throw error;
    }
}

export async function addNote(note_data){
    try{
        await db.query("INSERT INTO notes(note_text, note_date, book_id) VALUES ($1, $2, $3)", [note_data.note_text, await getCurrentFormatDate(),note_data.book_id])
        return true;
    }catch(error){
        console.error(`ERROR/ getNotesByBookId(book_id): ${error}`)
        throw error;
    }
}