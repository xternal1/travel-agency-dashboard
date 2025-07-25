import { Header } from "components"

const Trips = () => {
  return (
    <main className='all-users wrapper'>
      <Header
        title="Trips"
        description="View and Edit AI-Generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
       />
    </main>
  )
}

export default Trips