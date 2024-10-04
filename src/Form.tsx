import React, {useState, useEffect, useRef} from 'react'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

interface FormProps {
    onSubmit: (radius: number) => void
    loading: boolean
}

const Form: React.FC<FormProps> = ({onSubmit, loading}) => {
    const initialLoad = useRef(true)
    const [radius, setRadius] = useState<number>(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const radiusFromUrl = urlParams.get('radius')
        return radiusFromUrl ? Math.min(parseInt(radiusFromUrl, 10), 5000) : 3000
    })

    useEffect(() => {
        if (initialLoad.current) {
            if (radius > 0) {
                onSubmit(radius)
            }
            initialLoad.current = false
        }
    }, [onSubmit, radius])

    const handleSliderChangeCommitted = async (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
        let newRadius = newValue as number
        newRadius = Math.min(newRadius, 5000)
        setRadius(newRadius)

        const url = new URL(window.location.href)
        url.searchParams.set('radius', newRadius.toString())
        window.history.pushState({}, '', url.toString())

        onSubmit(newRadius)
    }

    return (
        <form className="slider-form">
            <Typography
                id="distance-slider"
                gutterBottom
                sx={{fontWeight: 300, textAlign: 'center', fontFamily: 'Montserrat'}}
            >
                Kocsmák {Math.ceil(radius / 1000)} km-es körzetben
            </Typography>
            <Box sx={{width: '90%', margin: '0 auto', height: 38}}>
                {loading ? (
                    <LinearProgress sx={{margin: '20px 0'}}/>
                ) : (
                    <Slider
                        value={radius}
                        onChange={(event, newValue) => setRadius(newValue as number)}
                        onChangeCommitted={handleSliderChangeCommitted}
                        aria-labelledby="distance-slider"
                        valueLabelDisplay="auto"
                        step={1000}
                        marks
                        min={1000}
                        max={5000}
                    />
                )}
            </Box>
        </form>
    )
}

export default Form
