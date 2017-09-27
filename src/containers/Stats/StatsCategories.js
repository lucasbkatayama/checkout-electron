import React from 'react'
import { connect } from 'react-redux'

import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts'
import ReactFC from 'react-fusioncharts'
charts(FusionCharts)

import { loadOrdersList } from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  orders: state.ordersListLines
});

class StatsCategoriesComponent extends React.Component
{
    componentDidMount()
    {
        if (this.props.orders.length == 0)
        {
            this.props.dispatch(loadOrdersList());
        }
    }

    getStatsByCategory()
    {
        let categoriesStats = [];

        this.props.orders.map((order) => {
            if (!order.lines) {
                return ;
            }
            order.lines.map((line) => {
                if (!categoriesStats[line.category]) {
                    categoriesStats[line.category] = 0;
                }

                categoriesStats[line.category] += line.price;
            })
        })

        return categoriesStats;
    }

    render()
    {
        let categoriesStatsData = this.getStatsByCategory();
        let categoriesStats = [];
        let categoriesStatsTotal = 0;
        let chartsData = [];
        for (var category in categoriesStatsData) {
            categoriesStatsTotal += categoriesStatsData[category];

            chartsData.push({ label: category, value: categoriesStatsData[category] });

            categoriesStats.push((
                <tr key={category}>
                    <td>{category}</td>
                    <td className="text-right">{categoriesStatsData[category].toFixed(2)} €</td>
                </tr>
            ))
        }

        let propsChart = {
            id: 'pie_chart',
            type: 'pie2d',
            width: 600,
            height: 400,
            dataFormat: 'json',
            dataSource: {
                chart: {
                    bgColor: '#ffffff',
                    showBorder: '0',
                    use3DLighting: '0',
                    showShadow: '0',
                    caption: 'Ventes par catégories',
                    startingangle: '120',
                    showlabels: '1',
                    showlegend: '1',
                    legendBgColor: '#ffffff',
                    legendBorderAlpha: '0',
                    legendShadow: '0',
                    enablemultislicing: '0',
                    slicingdistance: '15',
                    showpercentvalues: '1',
                    showpercentintooltip: '1',
                    plottooltext: '$label : $datavalue',
                    theme: 'fint'
                },
                data: chartsData
            }
        };

        return (
            <div className="row">
                <div className="col-md-6">
                    <h4>Par catégories</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Categories</th>
                                <th>CA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriesStats}
                            <tr>
                                <td className="text-right">TOTAL :</td>
                                <td className="text-right">{categoriesStatsTotal.toFixed(2)} €</td>
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

let StatsCategories = connect(mapStateToProps)(StatsCategoriesComponent);

export default StatsCategories
