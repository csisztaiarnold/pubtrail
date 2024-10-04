import React, {useState, useEffect, useRef} from 'react'
import Map from './Map'
import Form from './Form'
import Results from './Results'
import {getLocation} from './location'
import {queryOverpass} from './overpass'
import './App.css' // Import the CSS file

interface Location {
    latitude: number
    longitude: number
}

const App: React.FC = () => {
    const [location, setLocation] = useState<Location | null>(null)
    const [radius, setRadius] = useState<number>(0)
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [geoLoading, setGeoLoading] = useState<boolean>(true)
    const prevRadiusRef = useRef<number>(radius)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const locationParam = urlParams.get('location')
        const lat = urlParams.get('lat')
        const lon = urlParams.get('lon')
        const radiusFromUrl = urlParams.get('radius')

        if (lat && lon) {
            setLocation({latitude: parseFloat(lat), longitude: parseFloat(lon)})
            setGeoLoading(false)
        } else if (locationParam !== 'fixed') {
            getLocation().then(location => {
                setLocation(location)
                setGeoLoading(false)
            }).catch(() => {
                window.location.href = '?radius=5000&zoom=14&lat=46.255965958029144&lon=20.13004302978516'
            })
        } else {
            window.location.href = '?radius=5000&zoom=14&lat=46.255965958029144&lon=20.13004302978516'
        }

        if (radiusFromUrl) {
            const parsedRadius = parseInt(radiusFromUrl, 10)
            setRadius(parsedRadius)
        }
    }, [])

    useEffect(() => {
        if (location && radius !== prevRadiusRef.current) {
            setLoading(true)
            queryOverpass(location.latitude, location.longitude, radius)
                .then(setResults)
                .catch(console.error)
                .finally(() => setLoading(false))
            prevRadiusRef.current = radius
        }
    }, [location, radius])

    const handleFormSubmit = (newRadius: number) => {
        setRadius(newRadius)
    }

    return (
        <div>
            {geoLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="loader-text">Megpróbálom belőni kb. hol lehetsz...</div>
                </div>
            ) : (
                <>
                    {location && <Map location={location} radius={radius} results={results} setResults={setResults}
                                      setLocation={setLocation}/>}
                    <Form onSubmit={handleFormSubmit} loading={loading}/>
                    <Results results={results}/>
                </>
            )}
        </div>
    )
}

export default App
