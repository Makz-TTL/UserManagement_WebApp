import MainLayout from "./MainLayout"

export default function NoAuthError() {
    return (
        <MainLayout>    
            <div class="error-container">
                <h1 class="error-title">403 - Accesso Negato</h1>
                <p class="error-message">Non hai i permessi necessari per accedere a questa pagina.</p>
                <a class="button" href="/listUsers">
                    Torna alla pagina principale
                </a>
            </div>
        </MainLayout>
    )
}