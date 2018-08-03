import {excel} from '../../../func/excel'

export const search = {
    data() {
        return {
            params: {},
            colModel: [
                { label: '商品', prop: 'name', width: '30%' },
                { label: '单价(元)/数量', prop: 'dj', width: '10%', align: 'center' },
                { label: '买家/收货人', prop: 'mj', width: '20%', align: 'center' },
                { label: '配送方式', prop: 'psfs', width: '10%', align: 'center' },
                { label: '实付金额(元)', prop: 'sfje', width: '10%', align: 'center' },
                { label: '订单状态', prop: 'ddzt', width: '10%', align: 'center' },
                { label: '操作', prop: 'cz', width: '10%', align: 'center' }
            ],
            List: [
                {
                    id: 1,
                    sppic: 'http://img0.imgtn.bdimg.com/it/u=2382110381,2382599939&fm=27&gp=0.jpg',
                    name: 'iphne X 64g 红 全网通-2018 世界杯特别版',
                    dj: 3200,
                    sl: 1,
                    mjname: '13459876652',
                    shrname: '赵普',
                    shrphone: '13678987655',
                    psfs: '快递',
                    sfje: 3200,
                    ddzt: '交易成功'
                },
                {
                    id: 2,
                    sppic: 'http://img0.imgtn.bdimg.com/it/u=2382110381,2382599939&fm=27&gp=0.jpg',
                    name: 'iphne X 64g 红 全网通-2018 世界杯特别版',
                    dj: 3200,
                    sl: 1,
                    mjname: '13459876652',
                    shrname: '赵普',
                    shrphone: '13678987655',
                    psfs: '快递',
                    sfje: 3200,
                    ddzt: '交易成功'
                }
            ]
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
            var params=JSON.parse(JSON.stringify(this.params));
            params.zdrqs=params.xdsj[0]||'';
            params.zdrqz=params.xdsj[1]||'';
            delete params.xdsj;
            this.$http('/api/x6/getAllOrdersByCondition.do',params);
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