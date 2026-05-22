import React from 'react'
import { PricingTable } from '@clerk/clerk-react'
const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
      <div className="text-center">
        <h2>Choose Your Plan</h2>
        <p></p>
      </div>
      <div className="mt-14 max-sm:mx-8">
        <PricingTable></PricingTable>
      </div>
    </div>
  )
}

export default Plan
