import MainLayout from "./MainLayout"

export default function loginForm() {
  return (
    <MainLayout>
      <div class="form-container">
        <form class="form" action="/login" method="post">
          <h2 class="form-title">Accedi</h2>

          <div class="form-group">
            <label for="userName">Username</label>
            <input type="text" id="userName" name="userName" placeholder="Inserisci il tuo username..." required />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required />
          </div>


          
          <button class="button btn-submit" type="submit">
            Login
          </button>

          <a class="button" href="/home" style="margin-top: 12px;" >
            Crea Account
          </a>
        </form>
        
      </div>
    </MainLayout>       
  )   
}