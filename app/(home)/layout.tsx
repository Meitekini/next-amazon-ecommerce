import Footer from '@/components/shared/footer/footer'
import Header from '@/components/shared/header'
import TinyHeader from '@/components/shared/header/header'
import React from 'react'

export default function HomeLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
  return (
    <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-1 flex flex-col'>{children}</main>
          <Footer />
        </div>
  )
}
