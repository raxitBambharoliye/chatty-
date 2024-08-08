

 const getDate = (dateStr) => {
const date = new Date(dateStr);
const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
const formattedDate = date.toLocaleDateString('en-CA', options);
return formattedDate;
}
export const checkDatePrint = (currentDate, preDate,lastDate=false) => {
    const date1= getDate(currentDate)
    const date2 = getDate(preDate)
    if (date1 != date2 || lastDate) {
        return formatDate(currentDate);
    } else {
        return false;
    }
} 
 function formatDate(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    const inputDateString = inputDate.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    if (inputDateString === todayString) {
        return 'today';
    } else if (inputDateString === yesterdayString) {
        return 'yesterday';
    } else {
        const diffInTime = today.getTime() - inputDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        if (diffInDays < 7) {
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return `last ${dayNames[inputDate.getDay()]}`;
        } else {
            return inputDateString;
        }
    }
}
