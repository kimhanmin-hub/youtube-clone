import moment from 'moment';
import 'moment/locale/ko';

export const API_KEY ='AIzaSyD-bpYO41rVvhvDG4R4haqh3vasnH_y3yU'

//숫자변환기 구축
export const value_converter = (value) => {
  const num = parseInt(value);
  
  if (num >= 100000000) {
    return Math.floor(num / 100000000) + "억";
  } else if (num >= 10000) {
    return Math.floor(num / 10000) + "만";
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "천";
  } else {
    return num.toString();
  }
}

export const formatTimeAgo = (date) => {
  moment.locale('ko');  // 한국어 설정
  const now = moment();
  const momentDate = moment(date);
  const diffDays = now.diff(momentDate, 'days');
  const diffHours = now.diff(momentDate, 'hours');
  const diffMinutes = now.diff(momentDate, 'minutes');

  if (diffDays >= 30) {
    return momentDate.format('YYYY년 M월 D일');
  } else if (diffDays >= 7) {
    return `${Math.floor(diffDays / 7)}주 전`;
  } else if (diffDays >= 1) {
    return `${diffDays}일 전`;
  } else if (diffHours >= 1) {
    return `${diffHours}시간 전`;
  } else if (diffMinutes >= 1) {
    return `${diffMinutes}분 전`;
  } else {
    return '방금 전';
  }
}
