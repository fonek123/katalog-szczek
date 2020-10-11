

let dd = blogSchema.created.getDate();

let mm = blogSchema.created.getMonth()+1; 
const yyyy = blogSchema.created.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) {
    mm='0'+mm;
} 
const today = mm+'-'+dd+'-'+yyyy;