import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface Props {
	children: React.JSX.Element;
}

function ProtectedRoute({ children }: Props) {
	const [isAuthorized,] = useState<boolean | null>(true);

	useEffect(() => {
		async function auth() {
			// const token = localStorage.getItem(ACCESS_TOKEN);
			// if (!token) {
			// 	setIsAuthorized(false);
			// 	return;
			// }
			// const decoded = jwtDecode(token);
			// const tokenExpiration = decoded.exp;
			// const now = Date.now() / 1000;

			// if (tokenExpiration < now) {
			// 	await refreshToken();
			// } else {
			// 	setIsAuthorized(true);
			// }
		};

		// async function refreshToken() {
		// const refreshToken = localStorage.getItem(REFRESH_TOKEN);
		// try {
		// 	const res = await api.post("/api/token/refresh/", {
		// 		refresh: refreshToken,
		// 	});
		// 	if (res.status === 200) {
		// 		localStorage.setItem(ACCESS_TOKEN, res.data.access)
		// 		setIsAuthorized(true)
		// 	} else {
		// 		setIsAuthorized(false)
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	setIsAuthorized(false);
		// }
		// };
		auth();
	}, []);

	if (isAuthorized === null) {
		return <div>Loading...</div>;
	}

	return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;