import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const DiaryDetail = () => {
    const { date } = useParams();
    const [diaryEntry, setDiaryEntry] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {

    }, {date});

    const handleSave = () => {
        setIsSaved(true)
    };

    return (
        <div>
            <h2>{date}の日記</h2>
            <textarea
                value={diaryEntry}
                onChange={(e) => setDiaryEntry(e.target.value)}
                placeholder="ここに日記を書いてください"
            />
            <button onClick={handleSave}>保存</button>
            {isSaved && <p>日記が保存されました！</p>}
        </div>
    )
};

export default DiaryDetail