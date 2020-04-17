export default class HttpClient {

	/**
	 * Http GET処理.
	 * @param {string} url 
	 */
	static async get(url) {
		try {
			let response = await fetch(url, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin" // URLが呼び出し元のスクリプトと同一オリジンだった場合のみクッキーを送信
			});
			if (response.ok) return response.json();
			throw await response.json(); // エラーの場合はオブジェクトに復元してから直下のcatchへthrow
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Http POST処理.
	 * @param {string} url 
	 * @param {object} param 
	 */
	static async post(url, param) {
		try {
			let response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",  // URLが呼び出し元のスクリプトと同一オリジンだった場合のみクッキーを送信
				body: JSON.stringify(param)
			});
			if (response.ok) return response.json();
			throw await response.json(); // エラーの場合はオブジェクトに復元してから直下のcatchへthrow
		} catch (error) {
			throw error;
		}
	}

	static async delete(url) {
		try {
			let response = await fetch(url, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin" // URLが呼び出し元のスクリプトと同一オリジンだった場合のみクッキーを送信
			});
			if (response.ok) return response.json();
			throw await response.json(); // エラーの場合はオブジェクトに復元してから直下のcatchへthrow
		} catch (error) {
			throw error;
		}
	}
}