<template>
    <div class="tb">
        <!--2. 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main" style="width: 600px;height:400px;"></div>
    </div>
</template>

<script>
import echarts from 'echarts' // 1.导入echarts
import TotalApi from '@/api/total'
export default {
    data(){
        return{
            // res:[]

        }
    },

    mounted() {  // 此时，页面上的元素已经被渲染完毕了
        //3. 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        // 发送http请求
    
        TotalApi.getTotal().then(response=>{
          
            const res = response.data.data


        // 4.指定图表的配置项和数据
        var option = {
                title: {
                    text: '总数'
                },
                tooltip: {},
                legend: {
                    data:[]
                },
                xAxis: {
                    data: ["会员","供应商","商品","员工",]
                },
                yAxis: {},
                series: [{
                    name: '',
                    type: 'bar',
                    data: response.data.data
                }]
            };
        // 5.展示数据
        myChart.setOption(option,true);
        })
    },
}

</script>
<style>
    .tb{
    text-align: center; /*让div内部文字居中*/
    background-color: #fff;
    border-radius: 20px;
    width: 300px;
    height: 350px;
    margin: auto;
    position: absolute;
    top: 0;
    left: -152px;
    right: 0;
    bottom: 0;

    }
</style>