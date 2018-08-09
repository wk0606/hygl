var Mock=require('mockjs')
Mock.mock('http://123.com',{
    'name|3':'fei',//这个定义数据的模板形式下面会介绍
    'age|20-30':25,
});