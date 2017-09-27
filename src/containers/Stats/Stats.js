import React from 'react'

import StatsCategories from './StatsCategories'
import StatsDays from './StatsDays'

let Stats = ({ action, info, children, dispatch }) => {
    return (
        <div style={{ padding: '0 10px' }}>
            <h2>Statistiques</h2>
            <StatsCategories />
            <StatsDays />
        </div>
    )
};

export default Stats
