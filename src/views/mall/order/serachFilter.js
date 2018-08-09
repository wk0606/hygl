import {excel} from '../../../func/excel'
//MockJs----（开发测试数据）
//import '../../../public/mock'

export const search = {
    data() {
        return {
            params: {},
            colModel: [
                { label: '商品', prop: 'spname', width: '30%' },
                { label: '单价(元)/数量', prop: 'dj', width: '10%', align: 'center' },
                { label: '买家/收货人', prop: 'mj', width: '20%', align: 'center' },
                { label: '配送方式', prop: 'psfs', width: '10%', align: 'center' },
                { label: '实付金额(元)', prop: 'sfje', width: '10%', align: 'center' },
                { label: '订单状态', prop: 'ddzt', width: '10%', align: 'center' },
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
        //执行筛选
        search() {
            this.load=true;
            var params=JSON.parse(JSON.stringify(this.params));
            params.zdrqs=params.xdsj[0]||'';
            params.zdrqz=params.xdsj[1]||'';
            params.pageSize=this.page.size;
            params.pageNo=this.page.no;
            delete params.xdsj;
            this.$http('/api/x6/getOrderListByCondition.do',params).then(res=>{
                this.load=false;
                this.List=res.rows;
                this.page.rows=res.totalRows;
            },err=>{
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
        openDetails(ddh) {
            this.$router.push(`/main/mallchildren/order_details/${ddh}`);
        }
    }
}