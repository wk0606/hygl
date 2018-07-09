export const map = {
    data(){
        return {
            province:'',
            city:'',
            town:'',
            maps:[],
            townList:[]
        }
    },
    methods:{
        clearCity() {
            this.city='';
            this.town='';
            this.townList=[];
        },
        getTown(p,c){
            this.town = "";
            this.$http("/api/x6/getTownList.do", {
                province: p,
                city: c
            }).then((res) => {
                this.townList = res.list;
            })
        }
    },
    mounted(){
        this.maps=this.$util.getProvinceAndCity();
    }
}