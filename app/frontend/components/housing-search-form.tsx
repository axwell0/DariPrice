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
  const [showPrice, setShowPrice] = useState(false)
  const [states, setStates] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

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

  const generateLabel = (field: string) => {
    if (formData.Type === "apartment") {
      if (field === 'n_bathrooms') {
        return `Bathrooms (Min: 1, Max: 2)`;
      }
      if (field === 'n_bedrooms') {
        return `Bedrooms (Min: 1, Max: 4)`;
      }
      if (field === 'area') {
        return `Area (Min: 30 sq m, Max: 200 sq m)`;
      }
    } else if (formData.Type === "villa") {
      if (field === 'n_bathrooms') {
        return `Bathrooms (Min: 1, Max: 5)`;
      }
      if (field === 'n_bedrooms') {
        return `Bedrooms (Min: 1, Max: 7)`;
      }
      if (field === 'area') {
        return `Area (Min: 100 sq m, Max: 1000 sq m)`;
      }
    }

    return '';
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseInt(e.target.value);

    if (formData.Type === "apartment") {
      if (field === 'n_bathrooms' && value >= 1 && value <= 2) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      } else if (field === 'n_bedrooms' && value >= 1 && value <= 4) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      } else if (field === 'area' && value >= 30 && value <= 200) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      }
    } else if (formData.Type === "villa") {
      if (field === 'n_bathrooms' && value >= 1 && value <= 5) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      } else if (field === 'n_bedrooms' && value >= 1 && value <= 7) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      } else if (field === 'area' && value >= 100 && value <= 1000) {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      }
    }
  }

  const handleAreaBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (formData.Type === "apartment") {
      if (value < 30 || value > 200) {
        setError("Area must be between 30 and 200 sq m for apartments.");
      } else {
        setError(null);
      }
    } else if (formData.Type === "villa") {
      if (value < 100 || value > 1000) {
        setError("Area must be between 100 and 1000 sq m for houses.");
      } else {
        setError(null);
      }
    }
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

              {formData.Type && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms" className="text-purple-100">{generateLabel('n_bedrooms')}</Label>
                        <Input
                            id="bedrooms"
                            type="number"
                            placeholder="Number of bedrooms"
                            className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                            value={formData.n_bedrooms}
                            onChange={(e) => handleInputChange(e, 'n_bedrooms')}
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms" className="text-purple-100">{generateLabel('n_bathrooms')}</Label>
                        <Input
                            id="bathrooms"
                            type="number"
                            placeholder="Number of bathrooms"
                            className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                            value={formData.n_bathrooms}
                            onChange={(e) => handleInputChange(e, 'n_bathrooms')}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-purple-100">{generateLabel('area')}</Label>
                      <Input
                          id="area"
                          type="number"
                          placeholder="Area in sq m"
                          className="bg-gray-800 border-purple-500/30 text-white placeholder:text-gray-400"
                          value={formData.area}
                          onChange={(e) => setFormData({...formData, area: e.target.value})}
                          onBlur={(e) => handleAreaBlur(e)}
                          required
                      />
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-purple-100">State</Label>
                      <Select onValueChange={handleStateChange} value={formData.state} required>
                        <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select State"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-purple-500/30">
                          {states.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-purple-100">City</Label>
                      <Select
                          onValueChange={(value) => setFormData({...formData, city: value})}
                          value={formData.city}
                          required
                      >
                        <SelectTrigger className="bg-gray-800 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select City"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-purple-500/30">
                          {cities.map(city => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
              )}

              <div className="flex justify-center">
                <Button
                    type="submit"
                    className="bg-purple-600 text-white w-full"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
          <PriceDisplay
              price={estimatedPrice}
              onGoBack={handleGoBack}
          />
      )}
    </div>
  )
}
