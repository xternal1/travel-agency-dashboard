import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {Header} from "../../../components";
import type {Route} from "./+types/create-trip";
import { comboBoxItems, groupTypes, interests, selectItems, travelStyles } from "~/constants";
import {cn, formatKey} from "../../../lib/utils";
import { Coordinate, LayerDirective, MapsComponent, LayersDirective } from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async() => {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag,latlng,maps');
  const data = await response.json();
  
  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMaps,
}))
}

const CreateTrip = ({loaderData}: Route.ComponentProps ) => {
  const navigate = useNavigate();
  const countries = loaderData as Country[];
  const [formData, setFormData] = useState<TripFormData>({
  country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    groupType: '',
    budget: '',
    duration: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
      setLoading(true);

    if (
      !formData.country ||
      !formData.budget ||
      !formData.interest ||
      !formData.groupType ||
      !formData.travelStyle
    ) {
      setError('Please fill in all the required fields');
      setLoading(false)
      return;
    }
    if (formData.duration < 1 || formData.duration > 10 ){
      setError('Please provide a duration between 1 to 10');
      setLoading(false)
      return;
    }
    const user = await account.get();
    if(!user.$id){
      console.error('User is not authenticated');
      setLoading(false)
      return;
    }
    try {
      const response = await fetch('/api/create-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle, 
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,    
          userId: user.$id
        })
      });      
      const result: CreateTripResponse = await response.json();
      
      if (result?.id) navigate(`/trips/${result.id}`)
        else console.error('Failed to generate the trip')
    } catch (e) {
      console.error('Error generating trip', e);
    } finally {
      setLoading(false)
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
      setFormData({ ...formData, [key]: value})
  };

  const countryData = countries.map((country)=> ({
    text: country.name,
    value: country.value,

  }))

  const mapData = [
    {
      country: formData.country,
      color: '#EA382E',
      coordinates: countries.find((c: Country) => c.name == formData.country)?.coordinates || []
    }
  ]

  return (
    <main className="flex flex-col gap-7 pb-15 pl-[100px] pr-6 w-full">
      <Header title="Add a new Trip" description="Where are we going today..." />
      <section className="mt-2.5 wrapped-md">
       <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">
              Country
            </label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData} 
              fields={{ value: 'value'}}
              placeholder="Select a country"
              className="combo-box"
              change={(e: {value: string | undefined})=>{
                if(e.value){
                  handleChange('country', e.value)
                }

              }}
              allowFiltering
              filtering={(e)=>{
                const query = e.text.toLowerCase();

                e.updateData(
                  countries.filter((country)=> 
                  country.name.toLowerCase().includes(query))
                  .map(((country) => ({
                    text: country.name,
                    value: country.value
                  })))
                )
              }}
              />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
                id="duration"
                name="duration"
                placeholder="Enter the number of days (5,12..)"
                className="form-input placeholder:text-gray-100"
                onChange={(e)=> handleChange('duration', Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>

            <ComboBoxComponent 
              id={key}
              dataSource={comboBoxItems[key].map((item)=>({
                
                text: item,
                value: item,
              }))}
              fields={{text: 'text', value: 'value'}}
              placeholder={`Select ${formatKey(key)}`}
              change={(e: {value: string | undefined})=>{
                if(e.value){
                  handleChange(key, e.value)
                }

              }}
              allowFiltering
              filtering={(e)=>{
                const query = e.text.toLowerCase();

                e.updateData(
                  comboBoxItems[key].filter((item)=> 
                  item.toLowerCase().includes(query))
                  .map(((item) => ({
                    text: item,
                    value: item
                  }))))}}
                  className="combo-box"
              />
            </div>
            ))}
          <div>
            <label htmlFor="location">
              Location on the world map
            </label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map} 
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: 'color', fill: '#e5e5e5'}}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full"/>
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer>
            <ButtonComponent type="submit" className="button-class !h-12 !w-full" disabled={loading}>
              <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", {'animate-spin': loading})}/>
              <span className="p-16-semibold text-white">
                {loading ? 'Generating...' : 'Generate Trip'}
              </span>
            </ButtonComponent>
          </footer>
       </form>
      </section>
    </main>
  )
}

export default CreateTrip