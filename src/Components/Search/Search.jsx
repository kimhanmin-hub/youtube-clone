import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_KEY, value_converter, formatTimeAgo } from '../../data'
import './Search.css'

const Search = () => {
    const { searchQuery } = useParams();
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery]);

    const fetchSearchResults = async () => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchQuery}&type=video&key=${API_KEY}`);
            const data = await response.json();
            setResults(data.items);
        } catch (error) {
            console.error("검색 결과를 가져오는 중 오류 발생:", error);
        }
    }

    return (
        <div className="search-results">
            <h2>'{searchQuery}' 검색 결과</h2>
            {results.map((item) => (
                <Link to={`/video/${item.id.videoId}`} key={item.id.videoId} className="search-result-item">
                    <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                    <div className="search-result-info">
                        <h3>{item.snippet.title}</h3>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{formatTimeAgo(item.snippet.publishedAt)}</p>
                        <p>{item.snippet.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Search
