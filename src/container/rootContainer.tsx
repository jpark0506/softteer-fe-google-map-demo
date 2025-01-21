import React from 'react'

type Props = {
    children: React.ReactNode
}

const RootContainer = ({children} : Props) : React.ReactNode => {
  return (
    <div>
        {children}
    </div>
  )
}

export default RootContainer