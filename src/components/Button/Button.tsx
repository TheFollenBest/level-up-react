import type { ComponentProps } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '../../utils/cx.ts'
import styles from './Button.module.css'

type ButtonStyleProps = {
  variant?: 'accent' | 'outline' | 'text' | 'red' | 'navy'
  size?: 'small' | 'default'
  fullWidth?: boolean
}

function buttonClassName({ variant = 'accent', size = 'default', fullWidth = false }: ButtonStyleProps, className?: string) {
  return cx(styles.button, styles[variant], size !== 'default' && styles[size], fullWidth && styles.fullWidth, className)
}

type ButtonProps = ComponentProps<'button'> & ButtonStyleProps

export function Button({ variant, size, fullWidth, className, type = 'button', children, ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, fullWidth }, className)} {...props}>
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & ButtonStyleProps

export function ButtonLink({ variant, size, fullWidth, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...props}>
      {children}
    </Link>
  )
}
