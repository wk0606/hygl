import bus from '../../func/eventBus'
export default{
    methods:{
        clickNotify(obj){
            let orderLx=['WDTX_DDSH','WDTX_SPFH','WDTX_DDTK'];//订单相管类提醒
            let goodsLx=['WDTX_SPQH','WDTX_KCYJ'];//商品相关提醒
            let commentsLx=['WDTX_KHPJ'];
            if(orderLx.indexOf(obj.lx)>-1){
                if(this.$route.name=='order'){
                    bus.$emit('order-change',{value:obj.data.ddh});
                }else{
                    this.$util.setCache('ORDER',{value:obj.data.ddh});
                    this.$router.push('/main/mall/shop/order');
                }
            }
            if(goodsLx.indexOf(obj.lx)>-1){
                if(obj.data.spid){
                    this.$http('/api/x6/getWdSpxxBySpid.do',{
                        spid:obj.data.spid
                    }).then(res=>{
                        if(this.$route.name=='product_sp'){
                            bus.$emit('goods-change',{
                                name:res.spname,
                                bzw:res.bzw
                            });
                        }else{
                            this.$util.setCache('GOODS-ID',{
                                name:res.spname,
                                bzw:res.bzw
                            });
                            this.$router.push('/main/mall/shop/product_sp');
                        }
                    });
                }  
            }
            if(commentsLx.indexOf(obj.lx)>-1){
                if(this.$route.name=='comments'){
                    bus.$emit('rate-change',{ddh:obj.data.ddh});
                }else{
                    this.$util.setCache('COMMENTS',{ddh:obj.data.ddh});
                    this.$router.push('/main/comments');
                }
            }
        }
    }
}