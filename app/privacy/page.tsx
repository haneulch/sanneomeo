// Google Play 등록 요건인 개인정보처리방침. 정적 페이지 (ko + en).
export const metadata = { title: "개인정보처리방침 · 산너머" };

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px", lineHeight: 1.7 }}>
      <h1>개인정보처리방침</h1>
      <p>최종 수정: 2026-08-23</p>

      <h2>수집하는 정보</h2>
      <ul>
        <li><b>Google 로그인(선택)</b>: 이메일, 이름. 스탬프를 계정에 보존하는 용도로만 사용합니다.</li>
        <li><b>등산 스탬프 기록</b>: 방문한 산 이름과 적립 시각.</li>
        <li><b>위치 정보</b>: 스탬프 인증과 거리순 정렬 시 기기에서 일시적으로만 사용하며, 좌표는 서버에 저장하지 않습니다.</li>
      </ul>

      <h2>보관과 보호</h2>
      <p>계정·스탬프 데이터는 Supabase(암호화 전송·저장)에 보관하며, 제3자에게 판매·제공하지 않습니다.</p>

      <h2>삭제</h2>
      <p>계정과 데이터 삭제를 원하시면 아래 문의처로 요청해 주세요. 요청 즉시 삭제합니다.</p>

      <h2>문의</h2>
      <p>
        <a href="https://github.com/haneulch/sanneomeo/issues">github.com/haneulch/sanneomeo/issues</a>
      </p>

      <hr style={{ margin: "32px 0" }} />

      <h1>Privacy Policy</h1>
      <p>Last updated: 2026-08-23</p>

      <h2>What we collect</h2>
      <ul>
        <li><b>Google sign-in (optional)</b>: email and name, used only to keep your stamps on your account.</li>
        <li><b>Hiking stamps</b>: the mountain visited and the time collected.</li>
        <li><b>Location</b>: used transiently on your device for stamp verification and distance sorting. Coordinates are never stored on our servers.</li>
      </ul>

      <h2>Storage & protection</h2>
      <p>Account and stamp data are stored in Supabase (encrypted in transit and at rest) and are never sold or shared with third parties.</p>

      <h2>Deletion</h2>
      <p>Request account and data deletion via the contact below; we delete promptly.</p>

      <h2>Contact</h2>
      <p>
        <a href="https://github.com/haneulch/sanneomeo/issues">github.com/haneulch/sanneomeo/issues</a>
      </p>
    </main>
  );
}
