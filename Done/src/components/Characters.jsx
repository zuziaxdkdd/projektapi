import React, { useState, useEffect } from "react";

const API_KEY = "live_vjTfQGn1hpRTF6Zski12ym3bSfkwrAhRa9SIEbp";

function AttackOnTitanImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dodatkowy stan na przechowywanie indeksów niedziałających zdjęć
  const [brokenImages, setBrokenImages] = useState(new Set());

  //pobieranie danych:
  useEffect(() => {
    async function fetchImages() {
      //ladowanie zdjec
      setLoading(true);
      try {
        const pages = [1, 2, 3, 4,5 ,6 ,7 ,8 ,9 ,10, 11];
        const results = [];

        for (const page of pages) {
          const res = await fetch(`https://api.attackontitanapi.com/characters?page=${page}`, {
            headers: {
              "x-api-key": API_KEY,
              Accept: "application/json",
            },
          });

          if (!res.ok) throw new Error("Błąd API");

          //odczyt danych z odpowiediz
          const data = await res.json();

          //filtracja i mapowanie
          const imgs = data.results
            .filter(char => char.img && char.img.startsWith("http"))
            .map(char => ({
              name: char.name,
              img: char.img,
            }));

          results.push(...imgs);
        }

        //zapis tego co wyszlo/rezultat
        setImages(results);
        //bledy:
      } catch (err) {
        console.error("Błąd ładowania postaci:", err);
      }
      setLoading(false);
    }

    fetchImages();
  }, []);

  //ladowanie zdjec:
  if (loading) return <p className="loading-text">Ładowanie obrazków...</p>;

  //zwracanie postaci:
  return (
    <div className="characters-page">
      <div className="card-grid">
        {images.map((char, i) =>
          brokenImages.has(i) ? null : (
            <div key={i} className="card">
              <img
              //omijanie bledow CORS:
                src={`https://images.weserv.nl/?url=${encodeURIComponent(char.img.replace(/^https?:\/\//, ""))}`}
                alt={char.name}
                onError={(e) => {
                  setBrokenImages(prev => new Set(prev).add(i));
                }}
              />
              <p className="char-name">{char.name}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default AttackOnTitanImages;
