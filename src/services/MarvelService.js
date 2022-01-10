import { useHttp } from "../hooks/http.hook";

const useMarvelService = () =>{
    const{loading, request, error, clearError} = useHttp();


    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey ='apikey=349e879b1b67425907037bf5d5edbb7f';
    const _baseOffset = 210;

    
    const getAllCharacters = async (offset = _baseOffset) =>{
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async (id) =>{
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) =>{
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getAllComics = async (offset = 50) => { 
        const res = await request(`${_apiBase}comics?limit=10&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
      }
  
    const getComics = async (id) =>{
      const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
      return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) =>{
        return{
            id: comics.id,
            name: comics.title,
            description: comics.description || 'There is no description',
            pages: comics.pageCount ? `${comics.pageCount} p.` : " No information available",
            thumbnail: comics.thumbnail.path+ '.' +comics.thumbnail.extension,
            price: comics.prices[0].price,
            language: comics.textObjects.language || 'en-us'
        }
    }
    
    const _transformCharacter = (char) => {
        return{
            id: char.id,
            name: char.name,
            description: char.description.length < 1 ? char.description='No data available' : `${char.description.slice(0,250)}...`,
            thumbnail: char.thumbnail.path+ '.' +char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.length > 9 ? char.comics.items.slice(0, 9) : char.comics.items
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getCharacterByName, getAllComics, getComics }
}

export default useMarvelService;