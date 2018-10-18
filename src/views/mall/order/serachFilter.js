
import datePicker from '../../../components/datePicker/index'
import orderRow from './orderRow'
import {Loading} from '../../../func/loading'
import {excel} from '../../../func/excel'
export const search = {
    props:['currentTab'],
    data() {
        return {
            colModel: [
                { label: '商品', prop: 'spname', width: '25%' },
                { label: '单价(元)/数量', prop: 'dj', width: '10%', align: 'center' },
                { label: '买家/收货人', prop: 'mj', width: '15%', align: 'center' },
                { label: '配送方式', prop: 'psfs', width: '10%', align: 'center' },
                { label: '实付金额', prop: 'sfje', width: '10%', align: 'center' },
                { label: '订单状态', prop: 'ddzt', width: '10%', align: 'center' },
                { label: '退款状态', prop: 'tkzt', width: '10%', align: 'center' },
                { label: '操作', prop: 'cz', width: '10%', align: 'center' }
            ],
            List: [],
            load1:false,
            load2:false
        }
    },
    computed:{
        getSerachLabel(){
            for(let obj of this.searchType){
                if(obj.value==this.params.lx){
                    return obj.name;
                }
            }
        }
    },
    methods: {
        getDataByDdh(ddh){
            this.initSearchParams();
            this.params.value=ddh;
            this.search();
        },
        openFh(row){
            //console.log(row)
            this.$parent.sendOut(row);
        },
        //执行筛选
        search() {
            Loading.open({
                height:document.body.height
            });
            this.$util.setCache(this.$parent.currentTab,this.params);
            this.load=true;
            var params=JSON.parse(JSON.stringify(this.params));
            params.zdrqs=params.xdsj[0]||'';
            params.zdrqz=params.xdsj[1]||'';
            params.pageSize=this.page.size;
            params.pageNo=this.page.no;
            params.psfs=this.currentTab=='qbdd'?this.params.psfs:this.currentTab=='wdfh'?0:1;
            delete params.xdsj;
            this.$http('/api/x6/getOrderListByCondition.do',params).then(res=>{
                Loading.close();
                this.load=false;
                for(let r of res.rows){
                    let records=JSON.parse(r.tkrecords.value);
                    let temp=r.details.map(item=>{
                        return item.tkzt;
                    });
                    if(Math.max.apply(null,temp)==0){
                        r.hbtkcell=true;
                    }
                    if(records.length){
                        let i=1;
                        let j=1;
                        for(let obj of records){
                            if(obj.tkzt==1){
                                obj.label=`退款申请${i}`
                                //this.$set(obj,'label',);
                                i++;
                            }else{
                                obj.label=`存在退款记录${j}`
                                //this.$set(obj,'label',``);
                                j++;
                            }
                        }
                    }
                    r.tkrecords=records;
                }
                this.List=res.rows;
                this.page.rows=res.totalRows;
            },err=>{
                Loading.close();
                this.load=false;
            });
        },
        exportExcel() {
            var params=JSON.parse(JSON.stringify(this.params));
            params.zdrqs=params.xdsj[0]||'';
            params.zdrqz=params.xdsj[1]||'';
            delete params.xdsj;
            var exportDatas = {
                columns: [],
                data: [],
                fileName: "订单明细",
                title: "订单明细",
                paramData:{},
                condition:'',
                exportFlag:1,
                paramData:params,
                url:'/api/x6/exportOrderExcel.do'
            };
            var cols = [
                { label: '商品', prop: 'spname' },
                { label: '单价(元)', prop: 'spdj', isSum: 1, align: 'right'  },
                { label: '数量', prop: 'sl', isSum: 1, align: 'right' },
                { label: '买家', prop: 'mjname' },
                { label: '收货人', prop: 'shr' },
                { label: '收货人号码', prop: 'shrlxfs' },
                { label: '配送方式', prop: 'psfs' },
                { label: '实付金额(元)', prop: 'je', isSum: 1, align: 'right' },
                { label: '订单状态', prop: 'ddzt' },
            ];
            for (let obj of cols) {
                var temp = {};
                temp.colName = obj.label;
                temp.colLx=obj.prop;
                if (obj.hasOwnProperty('isSum'))
                    temp.isSum = obj.isSum;
                if (obj.hasOwnProperty('align'))
                    temp.align = obj.align;
                exportDatas.columns.push(temp);
            }
            excel.open(exportDatas);
        },
        //日期快捷选择
        selectDate(d) {
            this.params.xdsj = [this.$util.getDateByDistance(-1 * d), this.$util.getCurrentDate()];
        },
        //打开详情
        openDetails(row) {
            this.$router.push(`/main/mall/shop/order_details/${row.ddh}`);
        },
        //打开备注
        openComments(row){
            this.$parent.dialog.data=row.remark;
            this.$parent.dialog.ddh=row.ddh;
            this.$parent.dialog.show=true;
        },
        //跟新备注
        updateRowRemark(ddh,bz){
            for(let obj of this.List){
                if(obj.ddh==ddh){
                    obj.remark=bz;
                    break;
                }
            }
        },
        getDdzt(zt,psfs){
            if(zt==0){
                return '待付款';
            }else if(zt==1){
                return psfs?'待自提':'待发货';
            }else if(zt==2){
                return '待收货';
            }else if(zt==3){
                return '已完成';
            }else
                return '已关闭';
        },
        resetPage(){
            let cache=this.$util.getCache('ORDER');
            this.$util.removeCache('ORDER');
            if(cache){
                this.initSearchParams();
                for(let key in cache){
                    this.params[key]=cache[key];
                }
                this.search();
            }else{
                let temp=this.$util.getCache(this.$parent.currentTab);
                if(temp){
                    for(let key in temp){
                        this.$set(this.params,key,temp[key]);
                    }
                    this.search();
                }
            }
        },
    },
    activated() {
        this.resetPage();
    },
    mounted(){
        this.resetPage();
    },
    components:{
        datePicker,
        orderRow
    }
}