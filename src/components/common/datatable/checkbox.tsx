interface DatatableCheckboxProps {
  indeterminate?: boolean
}
export const DatatableCheckbox: React.FC<DatatableCheckboxProps> = ({ indeterminate, ...rest }) => {
  if (indeterminate) {
    // do nothing to remove error
  }
  return (
    <input
      type="checkbox"
      className="bg-transparent border-white rounded-sm w-[1.1rem] h-[1.1rem] border-[1.5px] focus:ring-0 text-primary focus-within:border-0 disabled:border-outline"
      {...rest}
    />
  )
}
