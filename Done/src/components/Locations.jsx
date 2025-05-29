import React, { useState, useEffect } from "react";

const API_KEY = "live_vjTfQGn1hpRTF6Zski12ym3bSfkwrAhRa9SIEbp";

function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  // Dodatkowy stan na przechowywanie indeksów niedziałających zdjęć
  const [brokenImages, setBrokenImages] = useState(new Set());

  //pobieranie danych:
  useEffect(() => {
    async function fetchLocations() {
      //ladowanie zdjec
      setLoading(true);
      try {
        const pages = [1, 2];
        const results = [];

        for (const page of pages) {
          const res = await fetch(`https://api.attackontitanapi.com/locations?page=${page}`, {
            headers: {
              "x-api-key": API_KEY,
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error("Błąd API");

          //odczyt danych z odpowiediz
          const data = await res.json();

          //filtracja i mapowanie
          const locs = data.results
            .filter(loc => loc.img && loc.img.startsWith("http"))
            .map(loc => ({
              id: loc.id,
              name: loc.name,
              img: loc.img,
            }));

          results.push(...locs);
        }

        //zapis tego co wyszlo/rezultat
        setLocations(results);
        //bledy:
      } catch (err) {
        console.error("Błąd ładowania lokalizacji:", err);
      }
      setLoading(false);
    }

    fetchLocations();
  }, []);

  //ladowanie zdjec:
  if (loading) return <p className="loading-text">Ładowanie lokalizacji...</p>;

  if (locations.length === 0) return <p>Brak lokalizacji do wyświetlenia.</p>;

  //zwracanie episodes:
  return (
    <div className="locations-page">
      <div className="card-grid">
        {locations.map((loc, i) =>
          brokenImages.has(i) ? null : (
            <div key={loc.id} className="card">
              <img
              //omijanie bledow CORS:
                src={`https://images.weserv.nl/?url=${encodeURIComponent(loc.img.replace(/^https?:\/\//, ""))}`}
                alt={loc.name}
                onError={() => setBrokenImages(prev => new Set(prev).add(i))}
              />
              <p className="loc-name">{loc.name}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Locations;
