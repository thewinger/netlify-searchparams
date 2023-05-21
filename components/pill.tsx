import React, { ReactNode } from 'react'

interface IProps {
  children: ReactNode
}

export default function Pill({ children }: IProps) {
  return (
    <div className='absolute left-4 top-4 z-10 rounded-md border border-white bg-white/90 px-2 py-1 text-xs font-semibold uppercase text-zinc-800 shadow-sm'>
      {children}
    </div>
  )
}
