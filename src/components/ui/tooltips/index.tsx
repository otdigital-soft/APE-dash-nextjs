import { ITooltip, Tooltip as ReactTooltip } from 'react-tooltip'

interface TooltipProps extends ITooltip {
  id: string
}
export const Tooltip: React.FC<TooltipProps> = ({ id, ...props }) => {
  return (
    <ReactTooltip
      id={id}
      opacity={1}
      className="!bg-dark !rounded-lg !shadow"
      style={{
        zIndex: 1024
      }}
      {...props}
    />
  )
}
