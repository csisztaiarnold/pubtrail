export async function queryOverpass(latitude: number, longitude: number, radius: number): Promise<any[]> {
    const overpassUrl = 'https://overpass-api.de/api/interpreter'
    const maxRadius = Math.min(radius, 5000)
    const overpassQuery = `
    [out:json];
    (
      node["amenity"="pub"](around:${maxRadius},${latitude},${longitude});
      node["amenity"="bar"](around:${maxRadius},${latitude},${longitude});
      node["amenity"="biergarten"](around:${maxRadius},${latitude},${longitude});
    );
    out body;
  `

    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({data: overpassQuery})
        })

        if (response.ok) {
            const data = await response.json()
            return data.elements.filter((element: any) => element.tags && element.tags.name)
        } else {
            throw new Error(`Error querying Overpass API: ${response.status}`)
        }
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}
