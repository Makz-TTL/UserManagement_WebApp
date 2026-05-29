import MainLayout from "./MainLayout"

export default function UserNotFound(){
    return (
        <MainLayout>    
            <div class="error-container">
                <h1 class="error-title">404 - Utente Non Trovato</h1>
                <p class="error-message">L'utente che stai cercando non esiste.</p>
                <a class="button" href="/listUsers">
                    Torna alla pagina principale
                </a>
            </div>
        </MainLayout>
    )
}