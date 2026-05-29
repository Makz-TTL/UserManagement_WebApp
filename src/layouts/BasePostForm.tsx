type UtenteOpzione = {
  id: number;
  nome: string;
  cognome: string;
};

type BasePostFormProps = {
  utenti: UtenteOpzione[];
  selectedAuthorId: number;
};

const BasePostForm = (props: BasePostFormProps) => {
  const autoreCorrente = props.utenti.find(u => u.id === props.selectedAuthorId);

  return (
    <div class="form-container">
      <form class="form" action="/createPost" method="post" enctype="multipart/form-data">
        <h2 class="form-title">Nuovo Post</h2>
        
        <input type="hidden" name="authorId" value={props.selectedAuthorId.toString()} />

        <div class="form-group" style="margin-bottom: 24px;">
          <label>Autore del Post</label>
          <p style="margin: 0; font-size: 16px; font-weight: 500; color: #ffffff;">
            {autoreCorrente ? `${autoreCorrente.nome} ${autoreCorrente.cognome}` : "Utente Sconosciuto"}
          </p>
        </div>
        
        <div class="form-group">
          <label for="title">Titolo</label>
          <input type="text" id="title" name="title" placeholder="Inserisci il titolo..." required />
        </div>

        <div class="form-group">
          <label for="content">Contenuto</label>
          <textarea id="content" name="content" rows={6} placeholder="Scrivi il tuo post qui..." required class="form-textarea"></textarea>
        </div>

        <div class="form-group">
          <label for="image">Immagine del post</label>
          <input type="file" id="image" name="image" accept="image/*" />
        </div>
        
        <button class="button btn-submit" type="submit">
          Pubblica Post
        </button>
      </form>
    </div>
  );
}

export default BasePostForm;