import toString from '../../util/toString';

export default function renderChart(props) {
  const height = `${props.height || 400}px`;
  const width = props.width ? `${props.width}px` : 'auto';
  return `
    document.getElementById('main').style.height = "${height}";
    document.getElementById('main').style.width = "${width}";
    var maplist = ${toString(props.maplist)};
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(${toString(props.option)});
    window.document.addEventListener('message', function(e) {
      var option = JSON.parse(e.data);
      myChart.setOption(option);
    });
    myChart.on('click', function(params) {
        window.ReactNativeWebView.postMessage(JSON.stringify(params.data));
    });
  `
}