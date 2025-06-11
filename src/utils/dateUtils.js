export function formatDate(date){
    return new Date(date).toLocaleDateString('ua-UA',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}