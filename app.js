const
  url = value => {
    return `https://v3.sg.media-imdb.com/suggestion/x/${value}.json?includeVideos=1`
  },
  throttleDelay = 1000,
  clasess = {
    isVisible: 'is-visible',
    isHidden: 'is-hidden',
    isWinner: 'is-winner'
  },
  movieListSelector = '.movie-list .movie';

let DATA = '';

document.onclick = () => {
  const movieList = document.querySelectorAll(movieListSelector);

  if (movieList && movieList.length > 1) {
    button.classList.add(clasess.isVisible);
  }
};

button.onclick = () => {
  const
    movieList = document.querySelectorAll(movieListSelector),
    randomMovie = Math.floor(Math.random() * movieList.length);

  let ms = 1000;

  controls.classList.add(clasess.isHidden);
  movieList.forEach(el => {
    setTimeout(() => {
      el.classList.add(clasess.isHidden)
    }, ms);
    ms += 200;
  });

  setTimeout(() => {
    movieList[randomMovie].classList.add(clasess.isWinner);
  }, ms + 600);
};

search.oninput = e => {
  processChanges(e.target.value);
};

const processChanges = throttle((param) => {
  fetch(url(param))
    .then(response => response.json())
    .then(result => {
      DATA = result.d.filter(o => o.qid === 'movie');
      updateSerachFull(DATA);
    })
}, throttleDelay);

function updateSerachFull(data) {
  searchFull.innerText = '';
  data.forEach(m => {
    searchFull.appendChild(
      createMovie(m, 'mini')
    )
  });
}

function createMovie(movie, modifier = '') {
  const
    rootClassName = 'movie',
    o = {};

  ['', 'poster', 'img', 'content', 'name', 'year', 'directors'].forEach(value => {
    const div = document.createElement('div');
    div.classList = value && `${rootClassName}-${value}` || `${rootClassName} ${modifier}`;
    o[value || rootClassName] = div;
  });

  o.img.style.backgroundImage = `url(${movie && movie.i && movie.i.imageUrl})`;
  o.name.innerText = movie.l;
  o.year.innerText = movie.y;
  o.directors.innerText = movie.s;

  o.poster.appendChild(o.img);
  o.content.append(o.name, o.year, o.directors);
  o.movie.append(o.poster, o.content);

  o.movie.onclick = function () {
    addMovie(this.childNodes[0].childNodes[0].style.backgroundImage);
  };

  return o.movie;
}

function addMovie(backgroundImage) {
  let movie = document.createElement('div');
  movie.classList = 'movie';
  movie.style.backgroundImage = backgroundImage;

  movieList.appendChild(movie);
  clearSearch();
}

function clearSearch() {
  search.value = '';
  search.dispatchEvent(new Event('input'));
}

function throttle(func, ms) {
  let
    isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this
      return;
    }
    func.apply(this, arguments);
    isThrottled = true;
    setTimeout(function () {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }
  return wrapper;
}