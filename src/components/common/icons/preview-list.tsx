export const PreviewListIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', ...rest }) => {
  return (
    <svg
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      viewBox="0 0 20 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}>
      <rect x="9.77777778" y="0" width="6.22222222" height="6.22222222"></rect>{' '}
      <rect x="9.77777778" y="9.77777778" width="6.22222222" height="6.22222222"></rect>{' '}
      <line x1="0" y1="2" x2="6" y2="2"></line> <line x1="0" y1="8" x2="6" y2="8"></line>{' '}
      <line x1="0" y1="14" x2="6" y2="14"></line>
    </svg>
  )
}
