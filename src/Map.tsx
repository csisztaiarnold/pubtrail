import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './customStyles.css'
import { queryOverpass } from './overpass'
import markerIcon from './beer.png'
import markerIconRetina from './beer.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import drunkIcon from './drunk.png'

interface Result {
    lat: number
    lon: number
    tags: {
        name?: string
    }
}

interface MapProps {
    location: {
        latitude: number
        longitude: number
    }
    radius: number
    results: Result[]
    setResults: (results: Result[]) => void
    setLocation: (location: { latitude: number, longitude: number }) => void
}

const Map: React.FC<MapProps> = ({ location, radius, results, setResults, setLocation }) => {
    const mapRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.LayerGroup | null>(null)
    const urlParams = new URLSearchParams(window.location.search)
    const initialZoom = parseFloat(urlParams.get('zoom') || '15')
    const [zoom, setZoom] = useState(initialZoom)

    // Extract lat, lon, and location parameters from URL
    const urlLat = parseFloat(urlParams.get('lat') || '0')
    const urlLon = parseFloat(urlParams.get('lon') || '0')
    const urlLocation = urlParams.get('location')

    // Set initial location based on URL parameters if available
    const initialLocation = urlLocation === 'fixed' && urlLat && urlLon
        ? { latitude: urlLat, longitude: urlLon }
        : location

    const updateResults = async (lat: number, lon: number, radius: number) => {
        try {
            const newResults = await queryOverpass(lat, lon, radius)
            setResults(newResults)
        } catch (error) {
            console.error('Error updating results:', error)
        }
    }

    useEffect(() => {
        const urlRadius = parseFloat(urlParams.get('radius') || '3000') // Default radius if not specified

        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([initialLocation.latitude, initialLocation.longitude], zoom)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current)

            const DefaultIcon = L.icon({
                iconUrl: markerIcon,
                iconRetinaUrl: markerIconRetina,
                shadowUrl: markerShadow,
                iconSize: [36, 36],
                iconAnchor: [12, 41],
                popupAnchor: [1, -40],
                shadowSize: [5, 5]
            })
            L.Marker.prototype.options.icon = DefaultIcon

            markersRef.current = L.layerGroup().addTo(mapRef.current)

            const hereAreYouIcon = L.icon({
                iconUrl: drunkIcon,
                iconSize: [60, 60],
                iconAnchor: [12, 41],
                popupAnchor: [17, -40],
                shadowSize: [5, 5]
            })

            const hereAreYouMarker = L.marker([initialLocation.latitude, initialLocation.longitude], { icon: hereAreYouIcon, draggable: true, zIndexOffset: 1000000 })
                .bindPopup('<div class="popup-message">Úgy saccoltam meg, hogy<br /> valahol ezen a környéken lehetünk...<br /><br /> De át is dobhatsz innen,<br />ahova csak szeretnéd.<br /><br /> Amint elkezdesz mozgatni, megpróbálom majd megmutatni a környékemen lévő kocsmákat.</div>')
                .addTo(mapRef.current)
                .openPopup()

            hereAreYouMarker.on('dragend', async (event: L.LeafletEvent) => {
                const marker = event.target as L.Marker
                const position = marker.getLatLng()
                await updateResults(position.lat, position.lng, urlRadius)
                setLocation({ latitude: position.lat, longitude: position.lng })
                if (mapRef.current) {
                    mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom())
                    const newUrl = new URL(window.location.href)
                    newUrl.searchParams.set('lat', position.lat.toString())
                    newUrl.searchParams.set('lon', position.lng.toString())
                    newUrl.searchParams.set('zoom', mapRef.current.getZoom().toString())
                    newUrl.searchParams.set('radius', urlRadius.toString())
                    window.history.pushState({}, '', newUrl.toString())
                }
            })
            // Perform initial API query with location and radius from URL
            updateResults(initialLocation.latitude, initialLocation.longitude, urlRadius)
        } else {
            mapRef.current.setView([initialLocation.latitude, initialLocation.longitude], zoom)
        }

        if (markersRef.current) {
            markersRef.current.clearLayers()
        }

        results.forEach((result, index) => {
            const marker = L.marker([result.lat, result.lon], { zIndexOffset: 0 })
                .bindPopup(`<div class="popup-message place">
                <a href="#" onclick="document.getElementById('result-${index}').scrollIntoView({ behavior: 'smooth' });">
                    ${result.tags.name || 'Unknown'}
                </a>
            </div>`)
            markersRef.current?.addLayer(marker)
        })

        if (mapRef.current) {
            mapRef.current.on('zoomend', () => {
                const newZoom = mapRef.current?.getZoom()
                if (newZoom !== undefined) {
                    setZoom(newZoom)
                    const newUrl = new URL(window.location.href)
                    newUrl.searchParams.set('zoom', newZoom.toString())
                    window.history.pushState({}, '', newUrl.toString())
                }
            })
        }

    }, [initialLocation.latitude, initialLocation.longitude, radius, results, zoom])

    return <div id="map" style={{ height: '60vh', width: '100%' }}></div>
}

export default Map
