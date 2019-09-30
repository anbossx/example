
Vue.component('vue-week', {
    props: ['weekprop','value'],
    model:{
        prop:'value',
        event:'modelChange'
    },
    template: `
       <div> 
       <div class="inputContainer"  @click="pannelShow">
        <input type="text"
         class="inputStyle" 
         :value="currentValue"
       />
         <span> <img src="./icon/ios-calendar-outline.svg" alt="" style="height: 20px"></span>
      </div>
         <transition name="fade">
       <div class="weekpanel" v-if="isActive">
      <div class="YearDispaly">
           <div  class="changeMonthIcon" @click="changeDate(-1)"><</div>
           <div>{{year}}年{{month}}月</div>
           <div class="changeMonthIcon" @click="changeDate(1)">></div>
      </div> 
        <div class="weekContaner">
         <span class="weekText"></span>
         <span v-for="week in weekArr" v-text="week" class="weekText"></span>
         </div>
         
       <div v-for="item in dateArr" class="dateContainer" :class="item[1].class" @click="selectedDate(item)">
          <span v-for="key in item" v-text="key.date" :class="key.type"></span>
       </div>
     </div>
        </transition>
      
      </div>
      
    `,
    data(){
        return{
            weekArr:['日','一','二','三','四','五','六'],
            dateArr:[],
            year:new Date().getFullYear(),
            month:new Date().getMonth()+1,
            panelDate: new Date(),
            userSelected:[],
            currentValue:'',
            count:0,
            isActive:false
        }
    },
    computed:{

      },
    methods:{
        //点击选中周
        selectedDate(data){
            data[1].class.dateSelected=true;
            let firtDate=data[0].date<10?0+data[0].date:data[0].date;
            let year=data[0].year;
            let week=data[0].date<10?'0'+data[0].date:data[0].date;
            if(this.count<=1){
                Vue.set(this.userSelected,this.count,{
                    year:year,
                    week:week,
                })
                if(this.count==1){
                    this.$emit('modelChange',timeArr(this.userSelected));
                    this.isActive=false;
                }
            }else {
                this.userSelected.shift();
                this.userSelected.push({
                    year:year,
                    week:week,
                });


            }
            for(let item of this.dateArr){
                if(this.userSelected.length==2){
                    if(( item[0].date==this.userSelected[0].week &&item[0].year==this.userSelected[0].year) || (item[0].date==this.userSelected[1].week &&item[0].year==this.userSelected[1].year)){
                        Vue.set(item[1].class,'dateSelected',true)
                    }else {
                        Vue.set(item[1].class,'dateSelected',false)
                    }
                }

            }
            this.currentValue=timeDel(this.userSelected);
            this.count++;
        },
        //传入默认日期
        getDefaultDate(){
            if(this.userSelected.length==0){
                return ;
            }else {
                let dateList=this.userSelected.map((item,index)=>{
                     if(item.toString().length==1){
                         return{
                             year:new Date().getFullYear(),
                             week:'0'+item
                         }
                     };
                     if(item.toString().length==2){
                         return{
                             year:new Date().getFullYear(),
                             week:item
                         }
                     };
                     if(item.toString().length==6){
                         return{
                             year:item.toString().slice(0,4),
                             week:item.toString().slice(4,6),
                         }
                     }
                });
                this.userSelected=dateList;
                this.currentValue=timeDel(dateList);
                let month=getMonthByWeek(this.userSelected[0].year,parseInt(this.userSelected[0].week));
                this.year=this.userSelected[0].year;
                this.month=month+1;
                this.panelDate=new Date(this.year,month,1);
                this.getDate(this.year,month)


            }
        },
        pannelShow(){
            this.count=0;
          this.isActive=!this.isActive;
        },
        changeDate(key){
            this.panelDate = siblingMonth(this.panelDate, key);   //改变月份
            this.year=this.panelDate.getFullYear();
            this.month=this.panelDate.getMonth()+1;
            this.getDate(this.year,this.month-1)
        },
        //根据年月获取到天数和对应的周
       getDate(Year,Month){
           this.dateArr=[];
           let datearr=[];
           let date=new Date().getDate();

           let year=Year;
           let month=Month;
           let lastMonthDay=new Date(year,month,0).getDate();//上个月有多少天
           let currentMonthlastDay=new Date(year,month+1,0).getDate();//本月有多少天
           let currentMonthfirstDayWeek=new Date(year,month,1).getDay();//本月第一天的星期
           let currentMonthWeek=new Date(year,month,currentMonthlastDay).getDay();//本月最后一天的星期

          for(let i=1;i<=currentMonthlastDay;i++){
              datearr.push({
                  date:i,
                  year:year,
                  month:month,
                  type:'currentMonth',
                  class:{
                      dateSelected:false,
                  }

              })
          }
           for(let i=lastMonthDay;i>lastMonthDay-currentMonthfirstDayWeek;i--) {
               datearr.unshift({
                   date:i,
                   month:month==0?11:month-1,
                   type:'lastMonth',
                   year:month==0?year-1:year,
                   class:{
                       dateSelected:false,
                   }
               })
           }
           if(currentMonthWeek!=6){
               for(let i=1;i<=6-currentMonthWeek;i++){
                   datearr.push({
                       date:i,
                       month:month==11?0:month+1,
                       type:'nextMonth',
                       year:month==11?year+1:year,
                       class:{
                           dateSelected:false,
                       }

                   })
               }
           }

           for(let i=0;i<datearr.length;i=i+7){
               let weekarr=datearr.slice(i,i+7);
               // console.log(weekarr);
               this.dateArr.push(weekarr);
           }
           this.getweek(Year);
       },
        getweek(Year){
             let DateList=this.dateArr;
             let firstdayOfyearweek=new Date(Year,0,1).getDay();//获取到今年第一天是星期几
            for(let item of DateList){
                 let Saturday=item[item.length-1].date;//获取到面板每条行日期的周六
                 let month=item[item.length-1].month;
                 let year=item[item.length-1].year; //每周六对应的年份
                 let timeRange=(new Date(year,month,Saturday).getTime()+ 86400000*(firstdayOfyearweek+1))-new Date(Year,0,1).getTime();
                 let week=timeRange/(86400000*7);
                 item.unshift({
                     type:'week',
                     date:week,
                     year:Year,
                 });
                 //将选中的改变状态
                for(let SelectedItem of this.userSelected){
                    if(item[0].date==SelectedItem.week && item[0].year==SelectedItem.year){
                        Vue.set(item[1].class,'dateSelected',true)
                    }
                }
            }

            this.dateArr=DateList;
        }

    },

    mounted(){
        // window.onclick=()=>{
          // this.isActive=false;
        // };
        if(this.userSelected.length==0){
            this.getDate(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
        }else {


            this.getDefaultDate();
        }

    },
    created(){
        this.userSelected=this.value;
    }

});