<script>
    var data = JSON.parse('{{ json_data | safe }}');
    var xValues = data.map(item => item.state_name);
    var yValues = data.map(item => item.total);
    var barColors = ["#b91d47", "#00aba9","#2b5797", "#e8c3b9", "#1e7145"];
    new Chart("myChart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Total Families Per State"
            }
        }
    });

    var active_states = JSON.parse('{{ active_states | safe }}');
    var inactive_states = JSON.parse('{{ inactive_states | safe }}');
    var x = ['active_states', 'inactive_states'];
    var y = [active_states, inactive_states];
    var Colors = ["#e8c3b9", "#b91d47"];
    new Chart("Chart2", {
        type: "doughnut",
        data: {
            labels: x,
            datasets: [{
                backgroundColor: Colors,
                data: y
            }]
        },
        options: {
            title: {
                display: true,
                text: "Active and Inactive State"
            }
        }
    });
</script>