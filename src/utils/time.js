
//字符串 xxxx-xx-xxTxx:xx:xxZ 转成 东八区时间
export function UTCZ2UTC8(timeString){
  timeString = timeString.replace('T', ' ')
  timeString = timeString.substring(0,19);
  timeString = timeString.replace(/-/g,'/');
  let timeTamp = new Date(timeString).getTime();
  let d = new Date();
  let localOffset = d.getTimezoneOffset() * 60000;
  return format(timeTamp - localOffset)
}

function add0(m){return m<10?'0'+m:m }
function format(timeTamp)
{
  var time = new Date(timeTamp);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}