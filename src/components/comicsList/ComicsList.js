import './comicsList.scss';
import { React, useEffect, useState, useRef } from 'react';
import {Link} from 'react-router-dom'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const ComicsList = () => {

const [comicsList, setComicsList] = useState([]);
const [offset,setOffset] = useState(0);
const [newItemLoading, setNewItemLoading] = useState(false);

const [comicsEnded, setComicsEnded] = useState(false);


const {loading, error, getAllComics} = useMarvelService();


useEffect(()=>{
      onRequest(offset, true)
    }, []);

const onRequest = (offset, initial) =>{
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllComics(offset)
       .then(onComicsListLoaded)
    
    }



const onComicsListLoaded = (newComicsList) => {
    let ended = false;
    if(newComicsList.length < 9){
        ended= true
    }

    setComicsList(comicsList => [...comicsList, ...newComicsList]);
    setNewItemLoading(newItemLoading=> false);
    setOffset(offset => offset +9);
    setComicsEnded(comicsEnded => ended);
}


function renderComics(arr){

    const items = arr.map((item) =>{


        return(
            <li 
            className="comics__item"
            key={item.id}>
                 <Link to={`/comics/${item.id}`}>
                <img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
                <div className="comics__item-name">{item.name}</div>
                <div className="comics__item-price">{item.price}$</div>
                </Link>
        </li>
        )
    })

    return (
        <ul className="comics__grid">
            {items}
        </ul>
    )


}
    const items = renderComics(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/>: null;
   
    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
            disabled = {newItemLoading}
            style ={{'display': comicsEnded ? 'none' :'block'}}
            onClick ={()=>onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;