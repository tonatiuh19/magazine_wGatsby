export const decode_utf8 = (s:string) =>{
    return decodeURIComponent(escape(s));
}


export const removeAccents = (str:any) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

export const firsLetterUpperCase = (str:any) =>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}
