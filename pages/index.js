import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/script.js'; // served from public/
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <>
      <Head>
        <title>Chat App</title>
        <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
      </Head>
      <div style={{ padding: 20, color: '#fff', background: '#222' }}>
        <h1>Room: <span id="room-name"></span></h1>
        <ul id="user-list" style={{ listStyle: 'none', padding: 0 }}></ul>

        <div id="messages" style={{ margin: '20px 0', height: '200px', overflowY: 'auto', background: '#333', padding: 10 }}></div>

        <form id="chat-form">
          <input type="text" id="msg" autoComplete="off" placeholder="Type a message" required style={{ padding: '8px', width: '70%' }} />
          <button type="submit" style={{ padding: '8px 16px' }}>Send</button>
        </form>
      </div>
    </>
  );
}
