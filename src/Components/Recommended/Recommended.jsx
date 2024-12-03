import React, { useState, useEffect } from 'react'
import './Recommended.css'
import { API_KEY, value_converter, formatTimeAgo } from '../../data'
import { Link } from 'react-router-dom'

const Recommended = ({categoryId}) => {
    const [apiData, setApiData] = useState([]);

    const fetchApiData = async () => {
        try {
            const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=KR&videoCategoryId=${categoryId}&key=${API_KEY}`
            const response = await fetch(relatedVideo_url);
            const data = await response.json();
            setApiData(data.items);
        } catch (error) {
            console.error("관련 동영상 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    useEffect(() => {
        fetchApiData();
    }, [categoryId]);

    return (
        <div className='recommended'>
            {apiData.map((item, index) => (
                <Link to={`/video/${categoryId}/${item.id}`} key={index} className="side-video-list">
                    <img src={item.snippet.thumbnails.medium.url} alt="" />
                    <div className="vid-info">
                        <h4>{item.snippet.title.length > 30 ? item.snippet.title.slice(0, 30) + "..." : item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{value_converter(item.statistics.viewCount)}회 • {formatTimeAgo(item.snippet.publishedAt)}</p>
                    </div>
                </Link>  
            ))}
        </div>
    )
}

export default Recommended
