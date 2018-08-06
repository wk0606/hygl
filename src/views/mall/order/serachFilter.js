import {excel} from '../../../func/excel'

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
            allList:[],
            page:{
                no:1,
                size:20,
                rows:0
            },
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
        //
        changPage(page){
            this.page.no=page;
            this.List=this.allList.slice((this.page.no-1)*this.page.size,this.page.no*this.page.size);
        },
        //执行筛选
        search() {
            this.load=true;
            var params=JSON.parse(JSON.stringify(this.params));
            params.zdrqs=params.xdsj[0]||'';
            params.zdrqz=params.xdsj[1]||'';
            delete params.xdsj;
            // this.$service('/api/x6/getOrderListByCondition.do',params).then(res=>{

            // });
            this.$http('/api/x6/getOrderListByCondition.do',params).then(res=>{
                this.load=false;
                this.allList=res.List;
                this.changPage(1);
            },err=>{
                this.load=false;
            });
        },
        exportExcel() {
            var exportDatas = {
                columns: [],
                data: [],
                fileName: "订单明细",
                title: "订单明细",
            };
            exportDatas.condition = this.params.xdsj.join('--');
            var cols = [
                { label: '商品', prop: 'name' },
                { label: '单价(元)', prop: 'dj' },
                { label: '数量', prop: 'sl', isSum: 1, align: 'right' },
                { label: '买家', prop: 'mjname' },
                { label: '收货人', prop: 'shr' },
                { label: '配送方式', prop: 'psfs' },
                { label: '实付金额(元)', prop: 'sfje', isSum: 1, align: 'right' },
                { label: '订单状态', prop: 'ddzt' },
            ];
            for (let obj of cols) {
                var temp = {};
                temp.colName = obj.label;
                if (obj.hasOwnProperty('isSum'))
                    temp.isSum = obj.isSum;
                if (obj.hasOwnProperty('align'))
                    temp.align = obj.align;
                exportDatas.columns.push(temp);
            }
            for (let row of this.List) {
                let _temp = [];
                for (let obj of cols) {
                    if (obj.prop == 'shr') {
                        _temp.push(`${row.shrname} / ${row.shrphone}`);
                    } else {
                        _temp.push(row[obj.prop]);
                    }
                }
                exportDatas.data.push(_temp);
            }
            excel.open(exportDatas);
        },
        //日期快捷选择
        selectDate(d) {
            this.params.xdsj = [this.$util.getDateByDistance(-1 * d), this.$util.getCurrentDate()];
        },
        //打开详情
        openDetails(id) {
            this.$router.push(`/main/mallchildren/order_details/${id}`);
        }
    }
}