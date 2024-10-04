import React, {useState, useEffect} from 'react'
import Typography from '@mui/material/Typography'

interface Result {
    lat: number
    lon: number
    tags: {
        name?: string
        description?: string
        website?: string
        wikipedia?: string
        opening_hours?: string
        contact_phone?: string
        'addr:city'?: string
        'addr:postcode'?: string
        'addr:street'?: string
        'addr:housenumber'?: string
        contact_website?: string
        contact_email?: string
        'contact:facebook'?: string
        'contact:instagram'?: string
        outdoor_seating?: string
        'survey:date'?: string
    }
}

interface ResultsProps {
    results: Result[]
}

const Results: React.FC<ResultsProps> = ({results = []}) => {
    const [showScrollToTop, setShowScrollToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 500)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const filteredResults = results.filter(result => result.tags.name)
    const resultCount = filteredResults.length

    return (
        <div id="results">
            <Typography className="number-of-results" gutterBottom>
                {resultCount === 0 ? 'Sajnos a környéken nincs kocsma...' : `${resultCount} kocsma a környékeden`}
            </Typography>
            {filteredResults.map((result, index) => (
                <div key={index} className="result" id={`result-${index}`}>
                    <h3>{result.tags.name}</h3>
                    {result.tags.description && <p className="description">{result.tags.description}</p>}
                    {(result.tags['addr:street'] || result.tags['addr:housenumber'] || result.tags['addr:postcode'] || result.tags['addr:city']) && (
                        <p>
                            <strong>Cím:</strong> {result.tags['addr:street']} {result.tags['addr:housenumber']}, {result.tags['addr:postcode']} {result.tags['addr:city']}
                        </p>
                    )}
                    {result.tags.opening_hours && <p><strong>Nyitva tartás:</strong> {result.tags.opening_hours}</p>}
                    {result.tags.contact_phone && <p><strong>Telefon:</strong> {result.tags.contact_phone}</p>}
                    {result.tags.contact_website && (
                        <p><strong>Honlap:</strong> <a href={result.tags.contact_website} target="_blank"
                                                       rel="noopener noreferrer">{result.tags.contact_website}</a></p>
                    )}
                    {result.tags.contact_email && (
                        <p><strong>Email:</strong> <a
                            href={`mailto:${result.tags.contact_email}`}>{result.tags.contact_email}</a></p>
                    )}
                    {result.tags['contact:facebook'] && (
                        <p><strong>Facebook:</strong> <a href={result.tags['contact:facebook']} target="_blank"
                                                         rel="noopener noreferrer">{result.tags['contact:facebook']}</a>
                        </p>
                    )}
                    {result.tags['contact:instagram'] && (
                        <p><strong>Instagram:</strong> <a href={result.tags['contact:instagram']} target="_blank"
                                                          rel="noopener noreferrer">{result.tags['contact:instagram']}</a>
                        </p>
                    )}
                    {result.tags.outdoor_seating &&
                        <p><strong>Terasz:</strong> {result.tags.outdoor_seating === 'yes' ? 'Van' : 'Nincs'}</p>}
                    <a href={`https://www.google.com/maps/search/${result.lat},${result.lon}`}
                       target="_blank" rel="noopener noreferrer" className="googlemaps">
                        Nézd meg a Google Térképen
                    </a>
                </div>
            ))}
            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>Vissza a térképhez</button>
            )}
        </div>
    )
}

export default Results
