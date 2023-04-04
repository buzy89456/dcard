import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';

export default function Home() {
  const navigate = useNavigate();
  const CLIENT_ID = 'f6423415d660b979890c';
  // 載入 spinner 動畫用
  const [isLoading, setIsLoading] = useState(false);

  // 點擊按鈕後導到 github 授權網址
  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo+user:email`
    );
  };

  // 設定 2 秒後自動關掉 spinner
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading]);

  // 取得 github 授權後將資料存入 localStorage
  useEffect(() => {
    // github 授權碼
    const queryString = window.location.search;
    const code = queryString.split('=')[1];

    // 取得 accessToken 和使用者帳號，存入 localStorage
    if (code && !localStorage.getItem('accessToken')) {
      setIsLoading(true);
      async function getAccessToken() {
        try {
          // 取得 accessToken
          let { data } = await axios.get(`http://localhost:3001?code=${code}`);
          if (data.token) {
            localStorage.setItem('accessToken', data.token);
            navigate('/task');
          }
          // 取得 user 帳號
          let res = await axios({
            method: 'get',
            url: 'https://api.github.com/user',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
          });
          if (res.data.login) {
            localStorage.setItem('userEmail', res.data.login);
          }
        } catch (e) {
          console.error(e);
        }
      }
      getAccessToken();
    }

    // 如果有 accessToken 導入 task 頁
    if (localStorage.getItem('accessToken')) {
      navigate('/task');
    }
  }, []);

  // bootstrap spinner動畫設定
  const spinner = (
    <div className="spinner-border text-white" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  return (
    <>
      <main className="bg-github">
        {isLoading ? (
          spinner
        ) : (
          <Button onClick={loginWithGithub} variant="outline-white">
            Login with Github
          </Button>
        )}
      </main>
    </>
  );
}
