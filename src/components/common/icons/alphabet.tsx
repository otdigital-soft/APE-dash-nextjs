export const AlphabetIcon: React.FC<IconProps> = ({ size = 17, color = 'currentColor', ...rest }) => {
  return (
    <svg
      fill="none"
      stroke={color}
      strokeWidth="2"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      viewBox="-2 0 15 15"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}>
      <polyline
        id="Path"
        points="11.1999993 13.1999991 5.59999967 0.199999094 0 13.1999991 5.59999967 0.199999094"></polyline>
      <line x1="2.25" y1="8" x2="8.75" y2="8" id="Line-2"></line>
    </svg>
  )
}
