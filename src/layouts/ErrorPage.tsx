import MainLayout from "./MainLayout";

export default () => (
  <MainLayout>
    <div class="form" style="text-align: center;"> 
      <h1 style="color: #ff4444; font-size: 24px; margin-bottom: 15px;">
        Errore tremendo
      </h1>
    <img src="/public/f_you.jpg" alt="Error" style="width: 150px; margin-bottom: 20px;" />
      
      
      <a href="/loginForm" class="button" style="text-decoration: none; display: block; line-height: 26px;">
        Torna alla Home
      </a>
    </div>
  </MainLayout>
);