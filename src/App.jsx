import Main from './components/Main';
import Timeline from './components/Timeline';

import MediaService from './services/MediaService';
import DiaryService from './services/DiaryService';
import MediaStorage from './persistence/MediaStorage';
import DiaryEntryStorage from './persistence/DiaryEntryStorage';
import useDate from './hooks/useDate';
import DateUtils from './utils/DateUtil';



const mediaStorage = new MediaStorage();
const diaryStorage = new DiaryEntryStorage();
const mediaService = new MediaService(mediaStorage);
const diaryService = new DiaryService(diaryStorage);


export default function App() {
  const [selectedDate, handleDate] = useDate();


  return (
    <div className='app'>
      <nav>
        <h1 className='home' onClick={() => handleDate(DateUtils.getCurrent())}>MyDiary</h1>
        <Timeline
          date={selectedDate}
          diaryService={diaryService}
          onCircleClick={handleDate}
        />
      </nav>
      <Main
        key={selectedDate}
        date={selectedDate}
        diaryService={diaryService}
        mediaService={mediaService}
        handleArrow={handleDate}
      />
    </div>
  );
}
