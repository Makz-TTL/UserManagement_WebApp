import MainLayout from "./MainLayout"

export default function RegError() {
  return (
    <MainLayout>
      <div class="error-container">
        <h1 class="error-title"></h1>
        <p class="error-message">Nome Utente o E-Mail gia' in uso</p>
        <a class="button" href="/home">
          Torna alla registrazione
        </a>
      </div>
    </MainLayout>
  )
}