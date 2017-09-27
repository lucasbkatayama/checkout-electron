import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
charts(FusionCharts)

import { loadOrdersList } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  orders: state.ordersListLines
});

class StatsDaysComponent extends React.Component
{
    componentDidMount()
    {
        if (this.props.orders.length == 0)
        {
            this.props.dispatch(loadOrdersList());
        }
    }

    getStatsByDays()
    {
        let stats = [];
        let date;

        this.props.orders.map((order) => {
            if (!order.total) {
                return ;
            }

            date = moment(order.date).locale('fr').format('DD/MM/YYYY')

            if (!stats[date]) {
                stats[date] = 0;
            }

            stats[date] += order.total;
        })

        return stats;
    }

    render()
    {
        let statsData = this.getStatsByDays();
        let stats = [];
        let statsTotal = 0;
        let chartsData = [];
        for (var category in statsData) {
            statsTotal += statsData[category];

            chartsData.push({ label: category, value: statsData[category] });

            stats.push((
                <tr key={category}>
                    <td>{category}</td>
                    <td className="text-right">{statsData[category].toFixed(2)} €</td>
                </tr>
            ))
        }

        let propsChart = {
            type: 'column2d',
            width: 600,
            height: 400,
            dataFormat: 'json',
            dataSource: {
                chart: {
                    bgColor: '#ffffff',
                    xAxisName: 'Jours',
                    yAxisName: 'CA',
                    paletteColors: '#0075c2',
                    usePlotGradientColor: 0,
                    caption: 'Ventes par jour',
                    numberPrefix: '€ ',
                    paletteColors: '#0075c2',
                    bgColor: '#ffffff',
                    borderAlpha: 20,
                    showBorder: '0',
                    canvasBorderAlpha: 0,
                    usePlotGradientColor: 0,
                    plotBorderAlpha: 10,
                    placevaluesInside: 1,
                    rotatevalues: 1,
                    valueFontColor: '#ffffff',
                    showXAxisLine: 1,
                    xAxisLineColor: '#999999',
                    divlineColor: '#999999',
                    divLineIsDashed: 1,
                },
                data: chartsData
            }
        };

        return (
            <div className="row">
                <div className="col-md-6">
                    <h4>Par jour</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Jour</th>
                                <th>CA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats}
                            <tr>
                                <td className="text-right">TOTAL :</td>
                                <td className="text-right">{statsTotal.toFixed(2)} €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <ReactFC {...propsChart} />
                </div>
            </div>
        );
    }
}

let StatsDays = connect(mapStateToProps)(StatsDaysComponent);

export default StatsDays
