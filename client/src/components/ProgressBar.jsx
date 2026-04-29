export default function ProgressBar({ current, total }) {
  // ここに処理を書く
    return (
        <div>
            <div>
                {current} / {total} ペア
            </div>
        <div style={{ width: `${(current / total) * 100}%`, backgroundColor: 'white', height: '4px' }}></div>
        </div>
    );
}
