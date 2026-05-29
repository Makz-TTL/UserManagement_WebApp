type UtenteInModifica = {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  userName: string;
  phone?: string | number;
  password: string;
};

type InputProps = {
  utenteInModifica?: UtenteInModifica;
};

const BaseForm = (props: InputProps) => {
  const isModifica = !!props.utenteInModifica;
  const actionUrl = isModifica ? `/updateUtente/${props.utenteInModifica!.id}` : "/createUser";
  const testoBottone = isModifica ? "Aggiorna Utente" : "Crea Utente";
  const titoloForm = isModifica ? "Modifica Utente" : "Nuovo Utente";

  return (
    <div className="form-container">
      <form className="form" action={actionUrl} method="post">
        <h2 className="form-title">{titoloForm}</h2>
        
        <div className="form-group">
          <label for="name">Nome</label>
          <input type="text" id="name" name="name" value={props.utenteInModifica?.nome || ""} required />
        </div>
        
        <div className="form-group">
          <label for="lastName">Cognome</label>
          <input type="text" id="lastName" name="lastName" value={props.utenteInModifica?.cognome || ""} required />
        </div>

        <div className="form-group">
          <label for="userName">Username</label>
          <input type="text" id="userName" name="userName" value={props.utenteInModifica?.userName || ""} required />
        </div>

        <div className="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value={props.utenteInModifica?.email || ""} required />
        </div>

        <div className="form-group">
          <label for="phone">Telefono (opzionale)</label>
          <input type="tel" id="phone" name="phone" value={props.utenteInModifica?.phone || ""} />
        </div>

       
        {!isModifica && (
          <div className="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
        )}

        <button className="button btn-submit" type="submit">
          {testoBottone}
        </button>
      </form>
    </div>
  );
}

export default BaseForm;