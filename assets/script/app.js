const inputMovie = document.getElementById('input-movie');
const pResponse = document.getElementById('response');

inputMovie.addEventListener('input', () => {
    let filmName = inputMovie.value.toLowerCase();

    filmName = encodeURIComponent(filmName);

    const url = `https://www.omdbapi.com/?apikey=5c634cc7&s=${filmName}`;

    fetch(url, {
        method: 'GET'
    })
        .then((result) => {
            return result.json(); 
        })
        .then((result) => {
            if (result.Response == 'False') {
                pResponse.innerHTML = `<p class='text-site'><span>Nothing</span> found</p>`;
                return;
            };

            pResponse.innerHTML = '';

            let films = sortFilms(result.Search);

            for (film of films) { 
                pResponse.innerHTML += `
                    <div class='film'>
                        <a href="https://www.imdb.com/pt/title/${film.imdbID}/" target="_blank"><img src="${film.Poster}" class='film-poster'></a>
                        <p class='film-title'>${film.Title}</p>
                        <p class='film-year'>${film.Year}</p>
                    </div>
                `;
            };

            const infoDiv = document.getElementById('infoDiv');
            const posters = document.getElementsByClassName('film-poster');
            
            Array.from(posters).forEach((poster) => {
                poster.addEventListener('mousemove', (event) => {
                    if (event) {
                        const dad = poster.parentNode.parentNode;
                        const filmTitle = dad.querySelector('.film-title').innerText;

                        infoDiv.style.display = 'flex';
                        infoDiv.style.left = `${event.pageX}px`;
                        infoDiv.style.top = `calc(${event.pageY}px - 38px)`;

                        infoDiv.querySelector('p').innerText = `See more about "${filmTitle}"`;
                    }
                });

                poster.addEventListener('mouseleave', () => {
                    infoDiv.style.display = 'none';
                });
            });   
        });
});


function sortFilms(array) {
    array = array.filter((film) => film.Type === 'movie');

    array = array.filter((film) => film.Poster !== 'N/A');

    array.sort((a,b) => parseInt(b.Year) - parseInt(a.Year));

    return array;
};

