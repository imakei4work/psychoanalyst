import React from 'react';
import Button from '@material-ui/core/Button';
import './style.css';

/**
 * ファイル選択コンポーネント.
 * @param {object} props
 * @param {string} props.accept 許容拡張子（カンマ区切り）（default: .xlsx）
 * @param {string} props.filename ファイル名
 * @param {function} props.onFileSelected ファイル選択後に実行される関数
 */
function FileSelect(props) {
	const { accept = ".mp4", filename, onFileSelected } = props;
	return (
		<div class="file-select">
			<label className="file-select-button">
				<Button variant="contained" component="span" size="small" color="primary">
					ファイルを選択
          <input type="file"
						className="file-select-input"
						accept={accept}
						onChange={event => onFileSelected(event.target.files[0])}
						onClick={event => {
							// この処理が無いと同一ファイル選択時にonChangeが発火しない
							event.target.value = '';
						}}
					/>
				</Button>
			</label>
			<div className="file-select-filename">
				{filename ? filename : "****** アップロードするファイルを選択してください ******"}
			</div>
		</div>
	)
}
export default FileSelect;
