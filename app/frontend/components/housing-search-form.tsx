'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import stateCityData from '@/libs/state_cities.json'
import PriceDisplay from '@/components/PriceDisplay'

type StateCityData = Record<string, string[]>

async function predictHousePrice(formData: unknown) {
  const api_url = process.env.NEXT_API_URL
  const api_public_url = process.env.NEXT_PUBLIC_API_URL

  console.log(api_url)
  console.log(api_public_url)

  const response = await fetch(`${api_public_url}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return response.json();
}

export default function HousingSearchForm() {
  const initialFormData = {
    n_bedrooms: '',
    n_bathrooms: '',
    area: '',
    city: '',
    state: '',
    Type: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [showPrice, setShowPrice] = useState(false) // State to toggle between form and price display
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null) // State to handle error messages

  useEffect(() => {
    const availableStates = Object.keys(stateCityData as StateCityData).sort()
    setStates(availableStates)
  }, [])

  const handleStateChange = (selectedState: string) => {
    setFormData(prev => ({ ...prev, state: selectedState, city: '' }))
    const stateCities = (stateCityData as StateCityData)[selectedState]?.sort() || []
    setCities(stateCities)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { n_bedrooms, n_bathrooms, area, city, state, Type } = formData;
    if (!n_bedrooms || !n_bathrooms || !area || !city || !state || !Type) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    try {
      const result = await predictHousePrice(formData)
      setEstimatedPrice(result.price)
      setShowPrice(true)
    } catch (error) {
      console.error('Error predicting price:', error)
    }
  }

  const handleGoBack = () => {
    setFormData(initialFormData);
    setEstimatedPrice(null);
    setShowPrice(false);
  }

  return (
    <div>
      {!showPrice ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8 p-8 rounded-xl bg-gray-900/60 backdrop-blur-sm border border-purple-500/20">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">Tunisian Real Estate Pricer</h1>
              <p className="text-purple-300">Enter property details below</p>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms" className="text-purple-100">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="Number of bedrooms"
                    className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                    value={formData.n_bedrooms}
                    onChange={(e) => setFormData({ ...formData, n_bedrooms: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-purple-100">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="Number of bathrooms"
                    className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                    value={formData.n_bathrooms}
                    onChange={(e) => setFormData({ ...formData, n_bathrooms: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-purple-100">Area (sq m)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="Total area in square feet"
                  className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-purple-100">State</Label>
                  <Select onValueChange={handleStateChange} value={formData.state} required>
                    <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-purple-500/30">
                      {states.map((state) => (
                        <SelectItem
                          key={state}
                          value={state}
                          className="hover:bg-purple-600 hover:ring-2 hover:ring-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                        >
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-purple-100">City</Label>
                  <Select
                    onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                    value={formData.city}
                    disabled={!formData.state}
                    required
                  >
                    <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-purple-500/30">
                      {cities.map((city) => (
                        <SelectItem
                          key={city}
                          value={city}
                          className="hover:bg-purple-600 hover:ring-2 hover:ring-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-purple-100">Property Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, Type: value })} required>
                  <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-500/30">
                    <SelectItem
                      value="apartment"
                      className="hover:bg-purple-600 hover:ring-2 hover:ring-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                    >
                      Apartment
                    </SelectItem>
                    <SelectItem
                      value="villa"
                      className="hover:bg-purple-600 hover:ring-2 hover:ring-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                    >
                      House
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Predict
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <PriceDisplay price={estimatedPrice} onGoBack={handleGoBack} />
      )}
    </div>
  )
}
