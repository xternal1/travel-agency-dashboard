import {Header, StatsCard, TripCard} from "../../../components"
import { dashboardStats, user, allTrips } from "~/constants";
import {getUser} from "~/appwrite/auth";
import type {Route} from "./+types/dashboard";


const dashboard = () => {


const {totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome home ${user?.name ?? 'Guest'}, my twin`}
        description="idk gng, i put random shi in here, also tell Saka Pandai Besi Sidoarjo that he is stank"
       />

       <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard 
              headerTitle="Total Trips"
              total={totalTrips}
              currentMonthCount = {tripsCreated.currentMonth}
              lastMonthCount = {tripsCreated.lastMonth}
            />
            <StatsCard 
              headerTitle="Total Users"
              total={totalUsers}
              currentMonthCount = {usersJoined.currentMonth}
              lastMonthCount = {usersJoined.lastMonth}
            />
            <StatsCard 
              headerTitle="Active Users Today"
              total={userRole.total}
              currentMonthCount = {userRole.currentMonth}
              lastMonthCount = {userRole.lastMonth}
            />
          </div>
       </section>
       <section className="container">
          <h1 className="text-xl font:semibold text-dark-100">
            Created Trips
            <div className="trip-grid">
              {allTrips.slice(0, 4).map(({id, name, imageUrls, itinerary, tags, estimatedPrice})=>(
                <TripCard 
                  key={id}
                  id={id.toString()}
                  name={name}
                  imageUrl={imageUrls[0]}
                  location={itinerary?.[0]?.location ?? ''}
                  tags={tags}
                  price={estimatedPrice}
                />
              ))}
            </div>
          </h1>
       </section>
    </main>
  )
}

export default dashboard