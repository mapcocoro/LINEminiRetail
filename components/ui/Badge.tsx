interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'new' | 'popular' | 'soldout' | 'discount'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-stone-100 text-stone-700',
    new: 'bg-green-100 text-green-700',
    popular: 'bg-amber-100 text-amber-700',
    soldout: 'bg-red-100 text-red-700',
    discount: 'bg-rose-500 text-white',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
