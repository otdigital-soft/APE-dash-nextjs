import { cn } from '@/lib/utils'

interface CardProps {
  title?: string
  headerStyle?: React.CSSProperties
  headerElement?: React.ReactNode
  footerElement?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export const Header: React.FC<CardProps> = ({ title, headerElement, headerStyle }) => {
  if (!title && !headerElement) return <></>
  return (
    <div className="flex justify-between lg:items-center mb-3 lg:mb-4" style={{ fontSize: '1.125rem', ...headerStyle }}>
      {/* title */}
      <span>{title}</span>
      {/* icon */}
      {headerElement && headerElement}
    </div>
  )
}
export const Footer: React.FC<CardProps> = ({ footerElement }) => {
  if (!footerElement) return <></>
  return <div className="flex justify-between items-center mt-4">{footerElement}</div>
}
export const Content: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('bg-dark-gray p-4 lg:p-5 rounded-xl', className)}>
      <Header {...props} />
      <Content>{children}</Content>
      <Footer {...props} />
    </div>
  )
}
