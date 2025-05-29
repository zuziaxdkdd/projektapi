import React, { useState, useEffect } from "react";
import EpisodeCard from "./Episode";

const API_KEY = "live_vjTfQGn1hpRTF6Zski12ym3bSfkwrAhRa9SIEbp";

function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Dodatkowy stan na przechowywanie indeksów niedziałających zdjęć
  const [brokenImages, setBrokenImages] = useState(new Set());

  //pobieranie danych:
  useEffect(() => {
    async function fetchEpisodes() {
      //ladowanie zdjec
      setLoading(true);
      try {
        const pages = [1, 2,3, 4, 5];
        const results = [];

        for (const page of pages) {
          const res = await fetch(`https://api.attackontitanapi.com/episodes?page=${page}`, {
            headers: {
              "x-api-key": API_KEY,
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error("Błąd API");

          //odczyt danych z odpowiediz
          const data = await res.json();

          //filtracja i mapowanie
          const eps = data.results
            .filter(ep => ep.img && ep.img.startsWith("http"))
            .map(ep => ({
              id: ep.id,
              name: ep.name,
              img: ep.img,
            }));

          results.push(...eps);
        }

        //zapis tego co wyszlo/rezultat
        setEpisodes(results);
        //bledy:
      } catch (err) {
        console.error("Błąd ładowania odcinków:", err);
      }
      setLoading(false);
    }

    fetchEpisodes();
  }, []);

  //ladowanie zdjec:
  if (loading) return <p className="loading-text">Ładowanie odcinków...</p>;
  if (episodes.length === 0) return <p>Brak odcinków do wyświetlenia.</p>;

  //zwracanie episodes:
  return (
    <div className="episodes-page">
      <div className="card-grid">
        {episodes.map((ep, i) =>
          brokenImages.has(i) ? null : (
            <EpisodeCard
              key={ep.id}
              name={ep.name}
              //omijanie bledow CORS:
              image={`https://images.weserv.nl/?url=${encodeURIComponent(ep.img.replace(/^https?:\/\//, ""))}`}
              onError={() => setBrokenImages(prev => new Set(prev).add(i))}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Episodes;
