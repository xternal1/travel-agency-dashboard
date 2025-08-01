import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { cn, getFirstWord, parseTripData } from "lib/utils";
import { Header, InfoPill, TripCard } from "components";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || "1", 10);
  const offset = (page - 1) * limit

  const { allTrips, total } = await getAllTrips(limit, offset);

  return { 
  Trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
          id: $id,
          ...parseTripData(tripDetail),
          imageUrls: imageUrls ?? []
      })),
      total  
  };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const trips = loaderData.Trips as Trip[] | [];

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get('page') || '1')

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`
  }

  return (
    <main className='all-users wrapper'>
      <Header
        title="Travel Plan"
        description="Create your travel plan in here!"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
       />
       <section>
        <h1 className='p-24-semibold text-dark-100 mb-4'>Manage Created Trips</h1>
        <div className="trip-grid mb-4">
        {trips.map(({id, name, imageUrls, itinerary, interests, travelStyle, estimatedPrice}) => (
              <TripCard
                id={id}
                key={id}
                name={name}
                location={itinerary?.[0]?.location ?? ''}
                imageUrl={imageUrls[0]}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
              />
            ))}
        </div>
        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args)=> handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
       </section>
    </main>
  )
}

export default Trips