import MainLayout from "./MainLayout"

export default function ServerError() {
    return (
        <MainLayout>
            <div class="error-container">
                <h1 class="error-title">500 - Errore del Server</h1>
                <p class="error-message">Si è verificato un errore interno. Riprova più tardi.</p>
                <a class="button" href="/listUsers">
                    Torna alla pagina principale
                </a>
            </div>
        </MainLayout>
    )
}


    