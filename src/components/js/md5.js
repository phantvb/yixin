var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64encode(str){
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};
function time_init(time){
    if(time.getTime()>new Date().getTime()){
        if (time.getFullYear()>new Date().getFullYear()){
            return (""+time.getFullYear()).substring(2)+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日';
        }else if(time.getFullYear()==new Date().getFullYear()&&1*24*60*60*1000<(time.getTime()-new Date().getTime())){
            return (time.getMonth()+1)+'月'+time.getDate()+'日'+' '+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()+1){
            return '明天'+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&1*60*60*1000<(time.getTime()-new Date().getTime())){
            return (time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(time.getTime()-new Date().getTime())>60*1000){
            return Math.floor((time.getTime()-new Date().getTime())/60000)+'分钟后';
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(time.getTime()-new Date().getTime())<60*1000){
            return '1分钟内';
        }
    }else{
        if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(new Date().getTime()-time.getTime())<60*1000){
            return '刚刚';
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&60*60*1000>(new Date().getTime()-time.getTime())&&(new Date().getTime()-time.getTime())>60*1000){
            return Math.ceil((new Date().getTime()-time.getTime())/60000)+'分钟前';
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&1*60*60*1000<((new Date().getTime()-time.getTime()))){
            return (time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==(new Date().getDate()-1)){
            return '昨天'+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()==new Date().getFullYear()&&(new Date().getTime()-time.getTime())>1*24*60*60*1000){
            return (time.getMonth()+1)+'月'+time.getDate()+'日'+' '+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        }else if(time.getFullYear()<new Date().getFullYear()){
            return (""+time.getFullYear()).substring(2)+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日';
        }
    }
}
export default{
    md5:base64encode,
    time_init:time_init
}