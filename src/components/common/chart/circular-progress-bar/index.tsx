'use client'
import 'react-circular-progressbar/dist/styles.css'

import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

interface CircularProgressBarProps {
  value: number
  pathColor?: string
  trailColor?: string
  textColor?: string
}
export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  value,
  pathColor = '#CD9D43',
  trailColor = '#181818',
  textColor = '#fff'
}) => {
  return (
    <CircularProgressbar
      value={value}
      text={`${value?.toFixed(0)}%`}
      styles={buildStyles({
        pathColor: pathColor,
        trailColor: trailColor,
        textSize: '24px',
        textColor: textColor
      })}
    />
  )
}
