interface ColorPlaceholderProps {
  width?: number
  height?: number
  color: string
  name?: string
  textColor?: string
}
export const ColorPlaceholder: React.FC<ColorPlaceholderProps> = ({
  width = '100%',
  height = '100%',
  name,
  color,
  textColor = '#fff'
}) => {
  return (
    <div
      className="rounded-xl flex items-center justify-center text-center flex-col"
      style={{
        width,
        height,
        backgroundColor: color,
        color: textColor
      }}>
      {name && <span className="text-xl font-medium">{name}</span>}
      <span className="text-sm">{color}</span>
    </div>
  )
}
