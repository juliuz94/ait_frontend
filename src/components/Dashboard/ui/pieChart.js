import React from 'react'
import { VictoryPie } from 'victory'

const PieChart = ({ data}) => {

  return (
    <VictoryPie
      animate={{
        duration: 2000
      }}
      data={data}
      labels={({ datum }) => `${datum.x}`}
    />
  )
}

export default PieChart
