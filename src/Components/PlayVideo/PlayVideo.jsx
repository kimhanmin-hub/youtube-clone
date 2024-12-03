import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { API_KEY, value_converter, formatTimeAgo } from '../../data'


// 비디오 재생 페이지
const PlayVideo = () => {
    const {videoId} = useParams();
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState(null);

    const fetchVideoData = async () => {
        try {
            const videoDetails_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`
            const response = await fetch(videoDetails_url);
            const data = await response.json();
            setApiData(data.items[0]);
        } catch (error) {
            console.error("비디오 데이터를 가져오는 중 오류 발생:", error);
        }
    } 

    // 채널 데이터 가져오기
    const fetchChannelData = async () => {
        try {
            if (apiData && apiData.snippet.channelId) {
                const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`
                const response = await fetch(channelData_url);
                const data = await response.json();
                setChannelData(data.items[0]);
            }
        } catch (error) {
            console.error("채널 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 채널 댓글 불러오기
    const fetchCommentData = async () => {
        try {
            const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
            const response = await fetch(comment_url);
            const data = await response.json();
            setCommentData(data.items);
        } catch (error) {
            console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
        }
    }
    
    useEffect(() => {
        fetchVideoData();
        fetchCommentData();
    }, [videoId]);

    useEffect(() => {
        if (apiData) {
            fetchChannelData();
        }
    }, [apiData]);

    if (!apiData) return <div>로딩 중...</div>;

    return (
        <div className='play-video'>
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            <h3>{apiData.snippet?.title}</h3>
            <div className="play-video-info">
                <p>{value_converter(apiData.statistics.viewCount)}회 • {formatTimeAgo(apiData.snippet.publishedAt)}</p>
            </div>
            <div>
                <span><img src={like} alt="" />{value_converter(apiData.statistics.likeCount)}</span>
                <span><img src={dislike} alt="" />싫어요</span>
                <span><img src={share} alt="" />공유</span>
                <span><img src={save} alt="" />저장</span>
            </div>
            <hr />
            <div className="publisher">
                <img src={channelData?.snippet.thumbnails.default.url} alt="" />
                <div>
                    <p>{apiData.snippet.channelTitle}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "로딩 중..."} 구독자</span>               
                </div>
                <button>구독하기</button>
            </div>
            <div className="vid-description">
                <p>{apiData.snippet.description.slice(0,250)}</p>
                <hr />
                <h4>댓글 {value_converter(apiData.statistics.commentCount)} 개</h4>
                {commentData && commentData.map((item, index) => (
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{formatTimeAgo(item.snippet.topLevelComment.snippet.publishedAt)}</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-action">
                                <img src={like} alt="" />
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike} alt="" /> 
                                <span>답글</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayVideo
