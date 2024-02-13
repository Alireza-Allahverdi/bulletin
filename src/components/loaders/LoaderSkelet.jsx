import React from 'react'
import Skeleton from 'react-loading-skeleton'

function LoaderSkelet({loadingLines}) {
  return (
    <Skeleton baseColor='rgba(216, 220, 232, 0.8)' count={loadingLines}/>
  )
}

export default LoaderSkelet