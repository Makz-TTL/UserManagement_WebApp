import MainLayout from "./MainLayout"

export default function PasError(){
    return (
        <MainLayout>    
            <div class="error-container">
                <h1 class="error-title"></h1>
                <p class="error-message">Non esiste nessun utente con questo nome e questa password</p>
                <a class="button" href="/loginForm">
                    Torna al login
                </a>
            </div>
        </MainLayout>
    )
}