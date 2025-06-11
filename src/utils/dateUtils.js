export function formatDate(date){
    // TO-DO: FIX TIME ZONE BUG IN THE FUTURE
    const dateObj = new Date(date);
    dateObj.setUTCHours(0,0,0,0);
    return dateObj.toISOString().split('T')[0];
}