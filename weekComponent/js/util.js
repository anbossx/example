 siblingMonth = function(src, diff) {
    const temp = new Date(src); // lets copy it so we don't change the original   1,src:如果选择日期则为已经选的日期，如果没选，则为当天
    //2 diff 下个月为1 上个月为-1
    const newMonth = temp.getMonth() + diff;
    temp.setMonth(newMonth);

    return temp;
};
 timeDel=function (src) {
     let timearr=src.map((item,index)=>{
         return parseInt(item.year.toString()+item.week.toString())
     });
     timearr.sort((a,b)=>{
         return a-b;
     });
     if(timearr.length==2){
         let timeStr=timearr[0].toString().slice(0,4)+'年'+timearr[0].toString().slice(4,6)+'周'+'-'+timearr[1].toString().slice(0,4)+'年'+timearr[1].toString().slice(4,6)+'周';

         return timeStr
     }
};
 timeArr=function(src){
     let timearr=src.map((item,index)=>{
         return parseInt(item.year.toString()+item.week.toString())
     });
     timearr.sort((a,b)=>{
         return a-b;
     });
     if(timearr.length==2){
         return timearr
     }
 };
 getMonthByWeek=function (year,week) {
     let firstdayOfyearweek=new Date(year,0,1).getDay();
     let countDay=week*7-firstdayOfyearweek;
     let countDayBymonth=0;
     let month=0;
     for(let i=0;i<12;i++){
         countDayBymonth=countDayBymonth+new Date(year,i+1,0).getDate();
         if(countDayBymonth>=countDay){
             month=i;
             break;
         }
     };
  return month;

 };
