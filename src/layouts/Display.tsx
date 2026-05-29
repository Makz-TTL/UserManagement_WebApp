

type InputProps = {
    
    title?: string; 
}

const BaseForm = (props: InputProps) => {
    return (
     
        <form
            class="form" 
            action="/creaUtente" 
            method="post"
        >
          <div class="form-container">   
            {}
            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" required /><br /><br />
            
            <label for="cognome">Cognome:</label>
            <input type="text" id="cognome" name="cognome" required /><br /><br />
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required /><br /><br />
            
            <label for="phone">Telephone number:</label>
            <input type="tel" id="phone" name="phone" required /><br /><br />

            <button class="button" type="submit">
              Crea Utente
            </button>
          </div>
        </form>
      
    );
}

export default BaseForm;