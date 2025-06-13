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

export async function addNote(note_data, user_id){
    try{
        await db.query("INSERT INTO notes(note_text, note_date, book_id, user_id) VALUES ($1, $2, $3, $4)", 
            [note_data.note_text,
             await getCurrentFormatDate(),
             note_data.book_id,
             user_id
            ])
        return true;
    }catch(error){
        console.error(`ERROR/ getNotesByBookId(book_id): ${error}`)
        throw error;
    }
}

export async function deleteNote(note_id, user_id){
    try{
        await db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [note_id, user_id]);
        return true;
    }catch(error){
        console.error(`ERROR/ deleteNote(note_id,user_id): ${error}`)
        throw error;
    }    
}

export async function updateNote(note_data, user_id){
    try{
        await db.query("UPDATE notes SET note_text = $1 WHERE id = $2 AND book_id = $3 AND user_id = $4", 
            [
                note_data.note_text,
                note_data.note_id,
                note_data.book_id,
                user_id
            ]
        );
        return true;
    }catch(error){
        console.error(`ERROR/ updateNote(note_data,user_id): ${error}`)
        throw error;
    }      
}